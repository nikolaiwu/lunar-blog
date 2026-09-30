#!/bin/sh
# Renders public/apple-touch-icon.png (180x180) from public/favicon.svg with
# headless Chrome, the way LunarCSS's touch icon is made: the favicon box at
# 4x (128px, so every edge stays on a whole pixel), centred on the dark page
# color. iOS needs an opaque PNG and rounds the corners itself.
#
# Run from the repo root after changing the favicon:
#   sh design/apple-touch-icon.sh
# CHROME overrides the browser path, which defaults to the macOS one.
set -e

chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

{
  printf '<!doctype html><html><head><style>'
  printf 'html,body{margin:0;background:#2a2c2f}'
  printf 'svg{display:block;width:128px;height:128px;margin:26px}'
  printf '</style></head><body>'
  cat public/favicon.svg
  printf '</body></html>'
} > "$tmp/icon.html"

"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=180,180 --screenshot="$PWD/public/apple-touch-icon.png" \
  "file://$tmp/icon.html" 2>/dev/null

echo "Wrote public/apple-touch-icon.png"
