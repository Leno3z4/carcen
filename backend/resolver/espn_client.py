"""
Free, keyless client for ESPN's public scoreboard API.

No signup, no API key, no cost. This is the same data ESPN's own site and app use.
It's undocumented but stable and widely relied on by hobby sports projects.

Endpoint pattern:
  https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard
  https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/summary?event={id}

"leaguePath" throughout this project means "{sport}/{league}", e.g.:
  football/nfl, basketball/nba, soccer/eng.1 (EPL), mma/ufc
Full list of valid paths: https://github.com/pseudo-r/Public-ESPN-API (community-maintained reference)
"""

import requests

BASE = "https://site.api.espn.com/apis/site/v2/sports"


class GameStatus:
    def __init__(self, completed: bool, home_team: str, away_team: str,
                 home_score: int, away_score: int, home_won: bool | None,
                 state: str):
        self.completed = completed
        self.home_team = home_team
        self.away_team = away_team
        self.home_score = home_score
        self.away_score = away_score
        self.home_won = home_won  # None if tie or not completed
        self.state = state  # "pre", "in", "post"

    def __repr__(self):
        return (f"<GameStatus {self.away_team} {self.away_score} @ "
                f"{self.home_team} {self.home_score} [{self.state}]>")


def get_scoreboard(league_path: str, dates: str | None = None) -> dict:
    """Raw scoreboard for a league. `dates` is optional YYYYMMDD to look at a specific day."""
    url = f"{BASE}/{league_path}/scoreboard"
    params = {"dates": dates} if dates else {}
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()


def list_upcoming_events(league_path: str, dates: str | None = None) -> list[dict]:
    """Simplified list of upcoming/live games: id, names, start time, status."""
    data = get_scoreboard(league_path, dates)
    events = []
    for event in data.get("events", []):
        competition = event["competitions"][0]
        competitors = competition["competitors"]
        home = next(c for c in competitors if c["homeAway"] == "home")
        away = next(c for c in competitors if c["homeAway"] == "away")
        events.append({
            "id": event["id"],
            "name": event.get("shortName", event.get("name", "")),
            "home_team": home["team"]["displayName"],
            "away_team": away["team"]["displayName"],
            "start_time": event["date"],  # ISO 8601 UTC
            "state": competition["status"]["type"]["state"],  # pre / in / post
        })
    return events


def get_game_status(league_path: str, event_id: str) -> GameStatus:
    """Fetch the current status of a single game by ESPN event ID."""
    url = f"{BASE}/{league_path}/summary"
    resp = requests.get(url, params={"event": event_id}, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    header = data["header"]
    competition = header["competitions"][0]
    competitors = competition["competitors"]
    home = next(c for c in competitors if c["homeAway"] == "home")
    away = next(c for c in competitors if c["homeAway"] == "away")

    status_type = competition["status"]["type"]
    completed = bool(status_type.get("completed", False))
    state = status_type.get("state", "pre")

    home_score = int(home.get("score", 0) or 0)
    away_score = int(away.get("score", 0) or 0)

    home_won = None
    if completed:
        if home_score > away_score:
            home_won = True
        elif away_score > home_score:
            home_won = False
        # else: tie, home_won stays None — resolver should handle this as a special case

    return GameStatus(
        completed=completed,
        home_team=home["team"]["displayName"],
        away_team=away["team"]["displayName"],
        home_score=home_score,
        away_score=away_score,
        home_won=home_won,
        state=state,
    )
