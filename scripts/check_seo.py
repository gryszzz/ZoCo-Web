#!/usr/bin/env python3
"""Validate the static ZoCo website's search-discovery plumbing.

Runs with Python's standard library. No traffic, tracking, or SEO claims.
"""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://zocodrains.com"
SITEMAP = ROOT / "sitemap.xml"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
errors: list[str] = []


def fail(page: str, message: str) -> None:
    errors.append(f"{page}: {message}")


class Metadata(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.titles: list[str] = []
        self.description: list[str] = []
        self.canonicals: list[str] = []
        self.robots: list[str] = []
        self.og_urls: list[str] = []
        self.h1_count = 0
        self.json_ld: list[str] = []
        self._title_open = False
        self._json_ld_open = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if tag == "title":
            self._title_open = True
            self.titles.append("")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "meta":
            name = (a.get("name") or "").lower()
            prop = (a.get("property") or "").lower()
            content = a.get("content") or ""
            if name == "description":
                self.description.append(content)
            if name == "robots":
                self.robots.append(content)
            if prop == "og:url":
                self.og_urls.append(content)
        elif tag == "link" and "canonical" in (a.get("rel") or "").lower().split():
            self.canonicals.append(a.get("href") or "")
        elif tag == "script" and (a.get("type") or "").lower() == "application/ld+json":
            self._json_ld_open = True
            self.json_ld.append("")

    def handle_data(self, data: str) -> None:
        if self._title_open and self.titles:
            self.titles[-1] += data
        if self._json_ld_open and self.json_ld:
            self.json_ld[-1] += data

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._title_open = False
        if tag == "script":
            self._json_ld_open = False


def expected_pages() -> dict[str, Path]:
    pages: dict[str, Path] = {}
    for file in ROOT.rglob("index.html"):
        if any(part.startswith(".") for part in file.relative_to(ROOT).parts):
            continue
        rel = file.relative_to(ROOT)
        url = ORIGIN + "/" + ("/".join(rel.parts[:-1]) + "/" if len(rel.parts) > 1 else "")
        pages[url] = file
    return pages


def main() -> int:
    try:
        sitemap = ElementTree.parse(SITEMAP)
    except (OSError, ElementTree.ParseError) as exc:
        print(f"Invalid sitemap: {exc}", file=sys.stderr)
        return 1

    listed = [(loc.text or "").strip() for loc in sitemap.findall(".//sm:url/sm:loc", NS)]
    listed_set = set(listed)
    pages = expected_pages()

    if len(listed_set) != len(listed):
        fail("sitemap.xml", "duplicate URL(s)")
    if not listed:
        fail("sitemap.xml", "no listed URLs")
    for url in listed:
        parsed = urlparse(url)
        if parsed.scheme != "https" or parsed.netloc != "zocodrains.com" or parsed.query or parsed.fragment:
            fail("sitemap.xml", f"not a canonical ZoCo URL: {url}")
    for url in sorted(listed_set - pages.keys()):
        fail("sitemap.xml", f"listed URL has no index.html: {url}")
    for url in sorted(pages.keys() - listed_set):
        fail("sitemap.xml", f"page missing from sitemap: {url}")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if f"Sitemap: {ORIGIN}/sitemap.xml" not in robots:
        fail("robots.txt", "missing canonical sitemap directive")

    for url, file in sorted(pages.items()):
        html = file.read_text(encoding="utf-8")
        meta = Metadata()
        meta.feed(html)
        label = str(file.relative_to(ROOT))

        if len(meta.titles) != 1 or not meta.titles[0].strip():
            fail(label, "expected exactly one nonempty title")
        if len(meta.description) != 1 or not meta.description[0].strip():
            fail(label, "expected exactly one nonempty meta description")
        if len(meta.canonicals) != 1 or meta.canonicals[0] != url:
            fail(label, f"canonical must be {url}")
        if meta.h1_count != 1:
            fail(label, f"expected one H1; found {meta.h1_count}")
        if any(
            token.strip().lower() in {"noindex", "none"}
            for directive in meta.robots
            for token in directive.split(",")
        ):
            fail(label, "indexable sitemap page has noindex/none directive")
        if meta.og_urls and (len(meta.og_urls) != 1 or meta.og_urls[0] != url):
            fail(label, "Open Graph URL differs from canonical")
        if not meta.json_ld:
            fail(label, "no JSON-LD structured data")
        for i, raw in enumerate(meta.json_ld, start=1):
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError as exc:
                fail(label, f"JSON-LD block {i} is invalid: {exc.msg}")
                continue
            if not isinstance(payload, (dict, list)):
                fail(label, f"JSON-LD block {i} must be object or array")

    if errors:
        print("Technical SEO check failed:")
        for error in errors:
            print(f"  - {error}")
        return 1
    print(f"Technical SEO check passed: {len(pages)} pages, {len(listed)} sitemap URLs; canonical, title, description, H1, indexability, OG URL and JSON-LD valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
