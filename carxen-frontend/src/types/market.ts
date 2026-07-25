export interface Market {
  id: string;
  creator: string;
  platform: "YouTube" | "X";
  question: string;
  current: number;
  target: number;
  yes: number;
  no: number;
  volume: number;
  endTime: number;
}
