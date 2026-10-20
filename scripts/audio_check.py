"""Audio QA for a rendered story: overall peak and per-cue onsets/peaks.

Usage: python3 -I scripts/audio_check.py out/maslarada_story01.mp4
"""
import subprocess
import sys

import numpy as np

SR = 48000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype='<f4').reshape(-1, 2)
mono = np.abs(x).max(axis=1)
peak = mono.max()
print(f'overall peak: {20 * np.log10(peak):.1f} dBFS   clipped samples: {(mono >= 0.999).sum()}')
# Onset list: 10 ms envelope, report rises above -40 dBFS after >= 60 ms of lower level.
hop = SR // 100
env = np.array([mono[i:i + hop].max() for i in range(0, len(mono), hop)])
db = 20 * np.log10(np.maximum(env, 1e-6))
quiet = 0
for i, v in enumerate(db):
    if v > -40 and quiet >= 3:
        seg = db[i:i + 30]
        print(f'  onset {i / 100:5.2f}s  frame {i * 0.3:6.1f}  peak {seg.max():5.1f} dBFS')
    quiet = quiet + 1 if v < db[max(0, i - 1)] - 0.0 or v < -40 else 0
