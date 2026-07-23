"""
metrics_client.py — fetches real-world social metric values for market resolution.
Counterpart to espn_client.py, but for follower/view/subscriber counts instead
of game scores.

platform: "X" | "YOUTUBE" | "TIKTOK"  (matches Platform enum in the contract)
metric_type: "FOLLOWERS" | "VIEWS" | "SUBSCRIBERS"
"""

import os
import time

YT_API_KEY = os.environ.get("YT_API_KEY")


def clean_metric_to_int(metric_str: str) -> int:
    metric_str = metric_str.upper().replace("FOLLOWERS", "").replace("VIEWS", "").strip()
    if "K" in metric_str:
        return int(float(metric_str.replace("K", "")) * 1_000)
    if "M" in metric_str:
        return int(float(metric_str.replace("M", "")) * 1_000_000)
    try:
        return int(metric_str.replace(",", ""))
    except ValueError:
        return 0


def _fetch_x_followers(username: str) -> int:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        page.goto(f"https://x.com/{username}", wait_until="domcontentloaded")
        time.sleep(3)
        el = page.locator("a[href$='/verified_followers'] span span").first
        raw = el.text_content() if el.count() > 0 else "0"
        browser.close()
        return clean_metric_to_int(raw)


def _fetch_tiktok_followers(username: str) -> int:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(f"https://www.tiktok.com/@{username}", wait_until="domcontentloaded")
        el = page.locator('[data-e2e="follower-count"]')
        raw = el.text_content() if el.count() > 0 else "0"
        browser.close()
        return clean_metric_to_int(raw)


def _fetch_youtube(channel_id: str, video_id: str, metric_type: str) -> int:
    from googleapiclient.discovery import build
    youtube = build("youtube", "v3", developerKey=YT_API_KEY)

    if metric_type == "SUBSCRIBERS":
        res = youtube.channels().list(part="statistics", id=channel_id).execute()
        return int(res["items"][0]["statistics"]["subscriberCount"])

    if metric_type == "VIEWS" and video_id:
        res = youtube.videos().list(part="statistics", id=video_id).execute()
        return int(res["items"][0]["statistics"]["viewCount"])

    raise ValueError(f"unsupported YouTube metric combo: {metric_type}, video_id={video_id}")


def fetch_metric(platform: str, username: str, video_id: str, metric_type: str) -> int:
    """Dispatch to the right fetcher based on platform. Raises on failure so the
    resolver can catch it and retry next scheduled run instead of resolving on bad data."""
    if platform == "X":
        return _fetch_x_followers(username)
    if platform == "TIKTOK":
        return _fetch_tiktok_followers(username)
    if platform == "YOUTUBE":
        return _fetch_youtube(username, video_id, metric_type)
    raise ValueError(f"unknown platform: {platform}")
