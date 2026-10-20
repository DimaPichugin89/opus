"""Synthesised sound effects for the Maslarada stories.

Every effect is generated from scratch (sines, filtered noise) and written
as a 48 kHz stereo WAV into public/sfx/. Each file is normalised to the same
peak (FILE_PEAK_DB); the mix level of each effect lives in src/sfx.tsx, so
character is tuned here and loudness there.

Usage: python3 -I scripts/gen_sfx.py
"""
import math
import wave
from pathlib import Path

import numpy as np

SR = 48000
FILE_PEAK_DB = -1.0
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(7)


def t_axis(seconds):
    return np.arange(int(SR * seconds)) / SR


def env_exp(t, decay):
    return np.exp(-t / decay)


def fade(x, ms_in=1.0, ms_out=8.0):
    n_in, n_out = int(SR * ms_in / 1000), int(SR * ms_out / 1000)
    x = x.copy()
    if n_in:
        x[:n_in] *= np.linspace(0, 1, n_in)
    if n_out:
        x[-n_out:] *= np.linspace(1, 0, n_out)
    return x


def onepole_lp(x, cutoff):
    a = math.exp(-2 * math.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def svf_bandpass(x, freqs, q):
    """State-variable band-pass with a per-sample centre frequency."""
    low = band = 0.0
    y = np.empty_like(x)
    damp = 1.0 / q
    for i, v in enumerate(x):
        f = 2 * math.sin(math.pi * min(freqs[i], SR / 6) / SR)
        low += f * band
        high = v - low - damp * band
        band += f * high
        y[i] = band
    return y


def sine_sweep(t, f0, f1, tau):
    """Sine whose frequency glides exponentially from f0 towards f1."""
    freq = f1 + (f0 - f1) * np.exp(-t / tau)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR)


# --- effects -----------------------------------------------------------------

def tap():
    """Soft short tap for a word or phrase appearing."""
    t = t_axis(0.09)
    tick = np.sin(2 * np.pi * 2100 * t) * env_exp(t, 0.006)
    body = sine_sweep(t, 520, 300, 0.02) * env_exp(t, 0.022) * 0.9
    click = onepole_lp(rng.standard_normal(len(t)), 3500) * env_exp(t, 0.0025) * 0.6
    mono = onepole_lp(tick * 0.35 + body + click, 6000)
    return stereo(fade(mono, 0.3, 15))


def whoosh():
    """Airy whoosh from band-passed noise; sweeps up then settles, pans L->R."""
    dur = 0.5
    t = t_axis(dur)
    p = t / dur
    freqs = 350 + 2600 * np.sin(np.pi * np.clip(p * 1.1, 0, 1)) ** 2
    noise = rng.standard_normal(len(t))
    band = svf_bandpass(noise, freqs, q=1.4)
    air = onepole_lp(noise, 9000) - onepole_lp(noise, 2500)
    amp = np.sin(np.pi * p) ** 1.6 * (1 - 0.35 * p)
    mono = (band + air * 0.12) * amp
    pan = np.clip(0.2 + 0.6 * p, 0, 1)
    left, right = mono * np.cos(pan * np.pi / 2), mono * np.sin(pan * np.pi / 2)
    return np.stack([fade(left, 5, 30), fade(right, 5, 30)], axis=1)


def thud():
    """Dull low knock for a bottle landing."""
    t = t_axis(0.32)
    tone = sine_sweep(t, 110, 48, 0.05) * env_exp(t, 0.09)
    knock = onepole_lp(rng.standard_normal(len(t)), 600) * env_exp(t, 0.012) * 1.6
    mono = onepole_lp(tone + knock, 900)
    return stereo(fade(mono, 0.5, 40))


def ding():
    """Light bell-like ding for numbers and facts."""
    t = t_axis(1.1)
    f = 1568.0
    partials = [(1.0, 1.0, 0.45), (2.0, 0.35, 0.25), (2.76, 0.18, 0.12), (5.4, 0.06, 0.05)]
    mono = sum(a * np.sin(2 * np.pi * f * r * t) * env_exp(t, d) for r, a, d in partials)
    shimmer = 1 + 0.015 * np.sin(2 * np.pi * 5.5 * t)
    return stereo(fade(mono * shimmer, 1.5, 80), width=0.004)


def plop():
    """Soft oil-drop plop: sine with a fast falling pitch."""
    t = t_axis(0.22)
    main = sine_sweep(t, 950, 210, 0.018) * env_exp(t, 0.045)
    t2 = t - 0.055
    bubble = np.where(t2 > 0, sine_sweep(np.clip(t2, 0, None), 1300, 480, 0.012)
                      * env_exp(np.clip(t2, 0, None), 0.02), 0) * 0.3
    mono = onepole_lp(main + bubble, 5000)
    return stereo(fade(mono, 0.8, 30))


def chord():
    """Warm short chord accent for the logo: soft FM keys, D major add9."""
    t = t_axis(2.2)
    notes = [146.83, 220.00, 293.66, 329.63, 369.99, 440.00]
    gains = [0.9, 0.7, 0.6, 0.35, 0.5, 0.35]
    out = np.zeros((len(t), 2))
    for i, (f, g) in enumerate(zip(notes, gains)):
        for detune, side in ((-0.0018, 0), (0.0018, 1)):
            fc = f * (1 + detune)
            index = 1.1 * env_exp(t, 0.25)
            mod = np.sin(2 * np.pi * fc * t) * index
            voice = np.sin(2 * np.pi * fc * t + mod) * env_exp(t, 0.75 + 0.1 * i)
            delay = int(SR * 0.012 * i)  # gentle strum
            out[delay:, side] += g * voice[: len(t) - delay]
    attack = np.clip(t / 0.012, 0, 1)[:, None]
    out *= attack
    out[:, 0], out[:, 1] = onepole_lp(out[:, 0], 2400), onepole_lp(out[:, 1], 2400)
    return np.stack([fade(out[:, 0], 0, 200), fade(out[:, 1], 0, 200)], axis=1)


# --- io ------------------------------------------------------------------------

def stereo(mono, width=0.0):
    if not width:
        return np.stack([mono, mono], axis=1)
    d = int(SR * width)
    return np.stack([mono, np.concatenate([np.zeros(d), mono[:-d]])], axis=1)


def write(name, data):
    peak = np.max(np.abs(data))
    data = data / peak * 10 ** (FILE_PEAK_DB / 20)
    pcm = (data * 32767).astype("<i2")
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{name:7s} {len(data) / SR:.2f}s")


if __name__ == "__main__":
    for fn in (tap, whoosh, thud, ding, plop, chord):
        write(fn.__name__, fn())
