Create a **single self-contained HTML file** with all CSS and JavaScript inline that produces a visually impressive, interactive cosmology-themed physics simulation.

The goal is to create something that looks immediately impressive, feels alive within seconds of loading, and is genuinely fun to interact with.

## Core simulation

Use an HTML5 `<canvas>` that fills most or all of the viewport.

Simulate a simplified **N-body gravitational system** containing glowing stars, particles, or proto-galaxies.

Objects should:

- Move continuously through space.
- Attract one another using simplified inverse-square gravity.
- Have different masses.
- Produce visible gravitational interactions and orbital behaviour.
- Leave soft luminous trails behind them.
- Occasionally create interesting emergent structures such as orbits, clusters, slingshots, collisions, or chaotic systems.

Scientific perfection is not required. Prioritise visually convincing behaviour, stability, and fun interaction.

## Expanding universe

Add a subtle **cosmic expansion effect**.

Objects should have a very small outward drift roughly proportional to their distance from the centre, creating the impression of an expanding universe.

Keep this subtle enough that gravity can still produce local structures.

## Interaction

Make the simulation highly interactive.

The user should be able to:

- Click to create a new massive object.
- Click-and-drag to create an object with an initial velocity based on the drag direction and distance.
- Use the mouse to gently perturb nearby particles.
- Create especially massive black-hole-like attractors using a modifier such as Shift + click.

Make these interactions visually satisfying.

For example, show a temporary trajectory or velocity indicator while dragging.

## Visual design

The visual quality is extremely important.

Aim for a cinematic scientific-visualisation aesthetic rather than a basic coding demo.

Use:

- Deep black and dark-blue space tones.
- Hundreds of subtle background stars.
- A faint procedural nebula, dust, or cosmic background effect.
- Vibrant glowing stars and particles.
- Soft bloom-like lighting.
- Particle trails.
- Additive-looking light effects where appropriate.
- Smooth transitions and animations.
- Subtle depth and parallax if useful.

Massive objects should feel visually different from ordinary particles.

Black-hole-like objects could have effects such as:

- A dark central region.
- Bright accretion glow.
- Distorted or curved-looking nearby trails.
- Increased gravitational influence.

Do not use external images or assets.

## Interface

Add a small elegant translucent UI panel.

Title:

**Cosmic Gravity Playground**

Include a short instruction explaining the main controls.

Also include:

- Pause / Resume
- Reset
- Simulation speed control
- Gravity strength control
- Particle count or density control

Keep the interface minimal so it does not obscure the simulation.

## Initial state

Do not start with completely random noise.

Create an interesting initial configuration that immediately demonstrates the simulation.

For example:

- A central massive star or galactic core.
- Several orbiting bodies.
- A cloud of smaller particles.
- One or two secondary gravitational systems.

The scene should already look interesting before the user touches anything.

## Performance

Target smooth animation at approximately 60 fps on a modern desktop browser.

Use sensible optimisation techniques where necessary.

Avoid allowing the simulation to become unstable because of extremely small distances or infinite gravitational forces.

## Constraints

Use only:

- HTML
- CSS
- Vanilla JavaScript
- HTML5 Canvas

No external libraries.

No build tools.

No external assets.

Everything must exist inside **one HTML file** that can be saved and opened directly in a browser.

## Priorities

In order of importance:

1. Visual impact
2. Immediate “wow” factor
3. Smooth animation
4. Interesting emergent behaviour
5. Interaction quality
6. UI polish
7. Reasonably convincing physics
8. Code quality

Do not spend excessive effort building menus, documentation, or unnecessary application architecture.

The result should feel more like an **interactive digital artwork / scientific toy** than a traditional web application.

Make sensible creative decisions yourself.

Return the **complete working HTML file** with no omitted sections, pseudocode, placeholders, or TODOs.

