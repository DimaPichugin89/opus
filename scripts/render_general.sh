#!/usr/bin/env bash
# Render the general block: out/maslarada_general_0N.mp4 and a joined review copy.
set -euo pipefail
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
mkdir -p out
list=$(mktemp)
for i in 1 2 3 4 5 6 7; do
  npx remotion render src/index.ts "General0$i" "out/maslarada_general_0$i.mp4" --browser-executable="$BROWSER" --log=error
  echo "file '$PWD/out/maslarada_general_0$i.mp4'" >> "$list"
done
ffmpeg -v error -y -f concat -safe 0 -i "$list" -c copy out/maslarada_general_all.mp4
rm "$list"
