import { useEffect, useState } from "react";

interface LiveScoreProps {
  leaguePath: string; // e.g. "football/nfl"
  eventId: string;
}

interface Score {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  state: "pre" | "in" | "post";
  detail: string; // e.g. "Q3 4:12" or "Final"
}

async function fetchScore(leaguePath: string, eventId: string): Promise<Score | null> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${leaguePath}/summary?event=${eventId}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();

  const competition = data.header.competitions[0];
  const competitors = competition.competitors;
  const home = competitors.find((c: { homeAway: string }) => c.homeAway === "home");
  const away = competitors.find((c: { homeAway: string }) => c.homeAway === "away");
  const statusType = competition.status.type;

  return {
    homeTeam: home.team.displayName,
    awayTeam: away.team.displayName,
    homeScore: Number(home.score ?? 0),
    awayScore: Number(away.score ?? 0),
    state: statusType.state,
    detail: statusType.shortDetail ?? statusType.description ?? "",
  };
}

export function LiveScore({ leaguePath, eventId }: LiveScoreProps) {
  const [score, setScore] = useState<Score | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!leaguePath || !eventId) return;
    let cancelled = false;

    async function poll() {
      try {
        const s = await fetchScore(leaguePath, eventId);
        if (!cancelled) setScore(s);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    void poll();
    // Only worth polling frequently while the game is actually live — otherwise
    // once a minute is plenty and keeps this genuinely free/lightweight.
    const interval = setInterval(poll, score?.state === "in" ? 15000 : 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaguePath, eventId, score?.state]);

  if (!leaguePath || !eventId || failed || !score) return null;
  if (score.state === "pre") return null; // nothing useful to show before kickoff

  return (
    <div className={`live-score ${score.state === "in" ? "live-score--live" : ""}`}>
      {score.state === "in" && <span className="live-score__dot" />}
      <span className="live-score__matchup">
        {score.awayTeam} {score.awayScore} — {score.homeScore} {score.homeTeam}
      </span>
      <span className="live-score__detail">{score.detail}</span>
    </div>
  );
}
