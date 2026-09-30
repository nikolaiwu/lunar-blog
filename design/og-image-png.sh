#!/bin/sh
# Renders design/og-image.svg to public/og-image.png (1200x630) with headless
# Chrome, using the Space Grotesk and Space Mono files that ship with
# @nikolaiwu/lunarcss. An alternative to exporting from Figma.
#
# Run from the repo root, after python3 design/og-image.py:
#   sh design/og-image-png.sh
# CHROME overrides the browser path, which defaults to the macOS one.
set -e

chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
fonts="$PWD/node_modules/@nikolaiwu/lunarcss/dist/lunarcss-fonts.min.css"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# The SVG goes inline, so its text can use the page's web fonts
{
  printf '<!doctype html><html><head><link rel="stylesheet" href="file://%s">' "$fonts"
  printf '<style>html,body{margin:0}svg{display:block}</style></head><body>'
  cat design/og-image.svg
  printf '</body></html>'
} > "$tmp/og-image.html"

"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=5000 --allow-file-access-from-files \
  --screenshot="$PWD/public/og-image.png" "file://$tmp/og-image.html" 2>/dev/null

echo "Wrote public/og-image.png"
