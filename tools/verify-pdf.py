"""Render and inspect a publication PDF without changing it."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image
from pypdf import PdfReader


def verify(source: Path, destination: Path, expected_pages: int) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(source))
    reader = PdfReader(source)
    assert len(document) == expected_pages, "Unexpected page count"
    assert source.stat().st_size < 10_000_000, "PDF exceeds 10 MB"
    report = []
    images = []
    for index, page in enumerate(document):
        rendered = page.render(scale=1.5).to_pil().copy()
        rendered.save(destination / f"page-{index + 1}.png")
        images.append(rendered)
        content = reader.pages[index]
        text = content.extract_text()
        assert len(text.strip()) > 50, "Missing selectable text"
        embedded = []
        for reference in content["/Resources"].get("/Font", {}).values():
            font = reference.get_object()
            # Chromium embeds variable-font glyph outlines as Type 3 CharProcs.
            if font.get("/Subtype") == "/Type3":
                embedded.append(bool(font.get("/CharProcs") and font.get("/ToUnicode")))
                continue
            descriptor = font.get("/FontDescriptor")
            if descriptor is None and font.get("/DescendantFonts"):
                descriptor = font["/DescendantFonts"][0].get_object().get("/FontDescriptor")
            embedded.append(bool(descriptor and any(
                name in descriptor.get_object() for name in ("/FontFile", "/FontFile2", "/FontFile3")
            )))
        assert embedded and all(embedded), "Font content is not embedded"
        links = []
        for annotation in content.get("/Annots", []):
            action = annotation.get_object().get("/A")
            if action and action.get("/URI"):
                links.append(str(action["/URI"]))
        assert links, "Page has no navigation link"
        report.append({"page": index + 1, "text": text, "embeddedFonts": True, "links": links})
    for offset in range(0, len(images), 4):
        contact = Image.new("RGB", (1520, 2050), "#18232b")
        for index, original in enumerate(images[offset:offset + 4]):
            preview = original.copy()
            preview.thumbnail((750, 1000))
            contact.paste(preview, ((index % 2) * 760, (index // 2) * 1025))
        contact.save(destination / f"contact-{offset // 4 + 1}.png")
    (destination / "report.json").write_text(json.dumps({
        "source": source.name, "bytes": source.stat().st_size, "pages": report,
        "visualReview": "Inspect every rendered page; structural checks cannot detect all layout faults."
    }, indent=2), encoding="utf-8")
    print(f"Verified {len(report)} pages, selectable text, embedded glyphs and links; {source.stat().st_size:,} bytes.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--pages", type=int, default=8)
    options = parser.parse_args()
    verify(options.source, options.destination, options.pages)
