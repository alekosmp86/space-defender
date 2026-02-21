Small game implementation while learning to use canvas, websockets and game concepts.

Controls:

- Arrow keys to move
- Space to shoot
- Touch screen to move and shoot

## Technical Implementation: Network Synchronization & Interpolation

To ensure smooth rendering despite network jitter and differing tick rates (Server 30Hz vs Client 60Hz+), the following systems were implemented:

### The Problem

- **Tickrate Mismatch**: Entities appeared to "jump" because the client rendered frames faster than it received updates.
- **Network Jitter**: Inconsistent packet arrival times caused interpolation to stutter.
- **Clock Drift**: Local and server time slowly diverged, causing interpolation windows to break over time.
- **Subpixel Jitter**: High-DPI screens showed flickering due to minuscule floating-point changes in anti-aliased coordinates.

### The Solution: `StateInterpolator`

Located in `src/game/interpolator.ts`, this class provides:

1. **Entity Tracking**: `Bullet` and `Enemy` types now include unique `id`s to match them across snapshots.
2. **Adaptive Virtual Clock**: Instead of using real-time timestamps, the client maintains a virtual clock that adapts its speed via a low-pass filter to stay in sync with server ticks while maintaining a 150ms buffer.
3. **Linear Interpolation (Lerp)**: Positions are smoothly transitioned between the two closest server snapshots.
4. **Pixel Snapping**: The renderer (`src/render/renderer.ts`) applies `Math.round()` to all coordinates, eliminating subpixel-induced flickering.
