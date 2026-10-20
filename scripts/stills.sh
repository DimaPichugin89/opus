#!/usr/bin/env bash
# Render stills of a story at given frames: scripts/stills.sh Story01 out/frames 20 60 100
set -euo pipefail
id=$1; dir=$2; shift 2
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
mkdir -p "$dir"
for f in "$@"; do
  npx remotion still src/index.ts "$id" "$dir/${id}_f$(printf %03d "$f").png" --frame="$f" --browser-executable="$BROWSER" --log=error
done
