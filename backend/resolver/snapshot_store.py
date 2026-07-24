"""
snapshot_store.py — writes periodic metric snapshots to JSON files and commits
them back to the repo, so the frontend can plot growth charts by fetching
raw.githubusercontent.com URLs. No database, no extra hosting, genuinely free.

File layout: data/snapshots/<market_id>.json
Format: [{"t": 1721770000, "v": 2410000}, {"t": 1721770900, "v": 2483000}, ...]
"""

import json
import os
import subprocess
import time


def _repo_root() -> str:
    """Finds the repo root via git, so snapshots always land at <repo>/data/snapshots/
    regardless of what directory the script is actually run from (the workflow runs
    it from backend/resolver, not the repo root)."""
    result = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True)
    if result.returncode != 0 or not result.stdout.strip():
        return "."  # fallback: current directory, if git lookup somehow fails
    return result.stdout.strip()


SNAPSHOT_DIR = os.path.join(_repo_root(), "data", "snapshots")


def _snapshot_path(market_id: int) -> str:
    return os.path.join(SNAPSHOT_DIR, f"{market_id}.json")


def append_snapshot(market_id: int, value: int, timestamp: int | None = None) -> None:
    """Append one {t, v} entry to this market's snapshot file. Creates the file
    and directory if they don't exist yet."""
    os.makedirs(SNAPSHOT_DIR, exist_ok=True)
    path = _snapshot_path(market_id)
    timestamp = timestamp if timestamp is not None else int(time.time())

    history = []
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                history = json.load(f)
        except (json.JSONDecodeError, OSError):
            history = []  # corrupted or unreadable — start fresh rather than crash the run

    history.append({"t": timestamp, "v": value})

    with open(path, "w") as f:
        json.dump(history, f)


def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True)


def commit_and_push_snapshots(commit_message: str = "Update metric snapshots") -> None:
    """Commits any changes under data/snapshots/ and pushes. Safe to call even
    if nothing changed — just no-ops in that case instead of failing the run."""
    _run(["git", "config", "user.name", "resolver-bot"])
    _run(["git", "config", "user.email", "resolver-bot@users.noreply.github.com"])

    _run(["git", "add", SNAPSHOT_DIR])

    diff_check = _run(["git", "diff", "--cached", "--quiet"])
    if diff_check.returncode == 0:
        print("No snapshot changes to commit.")
        return

    commit_result = _run(["git", "commit", "-m", commit_message])
    if commit_result.returncode != 0:
        print(f"Commit failed (non-fatal, continuing): {commit_result.stderr}")
        return

    push_result = _run(["git", "push"])
    if push_result.returncode != 0:
        print(f"Push failed (non-fatal, continuing): {push_result.stderr}")
    else:
        print("Snapshot changes committed and pushed.")
