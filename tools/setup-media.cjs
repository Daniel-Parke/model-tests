const {fs,path,root,hash,write} = require('./common.cjs');
const {execFileSync} = require('node:child_process');
const pin = {
  version:'9.0.1',
  url:'https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-9.0.1-essentials_build.zip',
  sha256:'fec81ae03971d9dd4be3ebe02e263bd2ec1d789483f931bdba5f5715e65da2e9'
};
async function main() {
  if (process.platform !== 'win32') throw Error('Use your local FFmpeg and ffprobe through FFMPEG and FFPROBE on this platform.');
  const zip = path.join(root,'.tool-cache/ffmpeg.zip');
  if (!fs.existsSync(zip) || hash(fs.readFileSync(zip)) !== pin.sha256) {
    console.log('Downloading portable FFmpeg '+pin.version);
    const response = await fetch(pin.url, {signal:AbortSignal.timeout(300000)});
    if (!response.ok) throw Error('Download failed: '+response.status);
    const data = Buffer.from(await response.arrayBuffer());
    if (hash(data) !== pin.sha256) throw Error('FFmpeg archive checksum mismatch');
    write('.tool-cache/ffmpeg.zip',data);
  }
  const destination = path.join(root,'.tool-cache/ffmpeg');
  const literal = value => "'"+value.replaceAll("'","''")+"'";
  execFileSync('powershell.exe',['-NoProfile','-Command',`Expand-Archive -LiteralPath ${literal(zip)} -DestinationPath ${literal(destination)} -Force`]);
  write('.tool-cache/ffmpeg-pin.json',JSON.stringify(pin,null,2));
  console.log('Portable FFmpeg verified and extracted. No PATH changes.');
}
main().catch(error => {console.error(error.message);process.exitCode=1;});
