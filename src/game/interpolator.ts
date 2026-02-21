import type { GameState, Player } from "./types";

export interface Snapshot {
  state: GameState;
  timestamp: number;
}

export class StateInterpolator {
  private snapshots: Snapshot[] = [];
  private readonly bufferSize = 30;
  private readonly delayTicks = 5;
  private readonly msPerTick = 1000 / 30;

  private playbackTime: number | null = null;
  private lastRealTime: number | null = null;

  public addSnapshot(state: GameState) {
    // Filter duplicates
    if (this.snapshots.some((s) => s.state.tick === state.tick)) return;

    this.snapshots.push({
      state,
      timestamp: state.tick * this.msPerTick,
    });

    this.snapshots.sort((a, b) => a.timestamp - b.timestamp);

    if (this.snapshots.length > this.bufferSize) {
      this.snapshots.shift();
    }
  }

  public getInterpolatedState(now: number): GameState | null {
    if (this.snapshots.length < 2) {
      return this.snapshots.length === 1 ? this.snapshots[0].state : null;
    }

    if (this.playbackTime === null || this.lastRealTime === null) {
      // Start playback delayed from the latest snapshot
      const latest = this.snapshots[this.snapshots.length - 1];
      this.playbackTime = latest.timestamp - this.delayTicks * this.msPerTick;
      this.lastRealTime = now;
      return this.snapshots[0].state;
    }

    const deltaTime = now - this.lastRealTime;
    this.lastRealTime = now;

    // Adaptive speed adjustment
    const latestServerTime =
      this.snapshots[this.snapshots.length - 1].timestamp;
    const targetPlaybackTime =
      latestServerTime - this.delayTicks * this.msPerTick;
    const diff = targetPlaybackTime - this.playbackTime;

    // Smoothly adjust speed to maintain the desired delay
    // If diff is positive, we are too slow; if negative, too fast.
    const speedAdjustment = 1 + diff * 0.005;
    this.playbackTime += deltaTime * speedAdjustment;

    // Find the snapshots to interpolate between
    let i = 0;
    while (
      i < this.snapshots.length - 2 &&
      this.snapshots[i + 1].timestamp < this.playbackTime
    ) {
      i++;
    }

    const s0 = this.snapshots[i];
    const s1 = this.snapshots[i + 1];

    if (this.playbackTime < s0.timestamp) return s0.state;
    if (this.playbackTime > s1.timestamp) return s1.state;

    const span = s1.timestamp - s0.timestamp;
    const alpha = span > 0 ? (this.playbackTime - s0.timestamp) / span : 1;
    const clampedAlpha = Math.max(0, Math.min(1, alpha));

    return {
      ...s1.state,
      players: this.interpolatePlayers(
        s0.state.players,
        s1.state.players,
        clampedAlpha,
      ),
      bullets: this.interpolateEntities(
        s0.state.bullets,
        s1.state.bullets,
        clampedAlpha,
      ),
      enemies: this.interpolateEntities(
        s0.state.enemies,
        s1.state.enemies,
        clampedAlpha,
      ),
    };
  }

  private interpolatePlayers(
    p0s: Record<string, Player>,
    p1s: Record<string, Player>,
    alpha: number,
  ): Record<string, Player> {
    const interpolated: Record<string, Player> = {};
    for (const id in p1s) {
      const p1 = p1s[id];
      const p0 = p0s[id];
      if (!p0) {
        interpolated[id] = p1;
      } else {
        interpolated[id] = {
          ...p1,
          x: p0.x + (p1.x - p0.x) * alpha,
          y: p0.y + (p1.y - p0.y) * alpha,
        };
      }
    }
    return interpolated;
  }

  private interpolateEntities<T extends { id: number; x: number; y: number }>(
    e0: T[],
    e1: T[],
    alpha: number,
  ): T[] {
    return e1.map((entity1) => {
      const entity0 = e0.find((e) => e.id === entity1.id);
      if (!entity0) return entity1;

      return {
        ...entity1,
        x: entity0.x + (entity1.x - entity0.x) * alpha,
        y: entity0.y + (entity1.y - entity0.y) * alpha,
      };
    });
  }
}
