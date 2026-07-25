export enum Platform {
  X = 0,
  YOUTUBE = 1,
  TIKTOK = 2,
}

export enum MetricType {
  FOLLOWERS = 0,
  VIEWS = 1,
  SUBSCRIBERS = 2,
}

export enum Outcome {
  UNRESOLVED = 0,
  YES = 1,
  NO = 2,
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.X]: "X",
  [Platform.YOUTUBE]: "YouTube",
  [Platform.TIKTOK]: "TikTok",
};

export const METRIC_LABELS: Record<MetricType, string> = {
  [MetricType.FOLLOWERS]: "Followers",
  [MetricType.VIEWS]: "Views",
  [MetricType.SUBSCRIBERS]: "Subscribers",
};

/** Matches the Market struct returned by getMarket() exactly, field order included. */
export interface Market {
  id: number;
  question: string;
  closeTime: bigint;
  outcome: Outcome;
  yesPool: bigint;
  noPool: bigint;
  platform: Platform;
  username: string;
  videoId: string;
  metricType: MetricType;
  targetValue: bigint;
  measuredValue: bigint;
}

export interface SnapshotPoint {
  t: number; // unix timestamp
  v: number; // metric value
}
