"""Synthesised sound effects for the Maslarada stories.

Everything is generated from scratch with small physical models (damped
resonators, bubble chirps, plucked strings, filtered noise), written as
48 kHz stereo WAVs into public/sfx/. Each file is normalised to the same peak
(FILE_PEAK_DB); the mix level of each effect lives in src/sfx.tsx, so
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


# --- building blocks -----------------------------------------------------------

def t_axis(seconds):
    return np.arange(int(SR * seconds)) / SR


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


def onepole_hp(x, cutoff):
    return x - onepole_lp(x, cutoff)


def resonator(excite, freq, decay):
    """Two-pole resonator: a struck mode ringing at freq with an exponential decay (s)."""
    r = math.exp(-1.0 / (decay * SR))
    c = 2 * r * math.cos(2 * math.pi * freq / SR)
    y = np.zeros_like(excite)
    y1 = y2 = 0.0
    for i, v in enumerate(excite):
        y0 = v + c * y1 - r * r * y2
        y[i] = y0
        y2, y1 = y1, y0
    return y * (1 - r)


def burst(n_ms, cutoff=4000, length=None):
    """Short noise impulse, the 'strike' that excites resonators."""
    n = int(SR * n_ms / 1000)
    x = np.zeros(length or n)
    x[:n] = rng.standard_normal(n) * np.linspace(1, 0, n) ** 2
    return onepole_lp(x, cutoff)


def bubble(t, f0, rise, decay):
    """Minnaert-style bubble: a sine whose pitch rises as it decays."""
    freq = f0 * (1 + rise * t / decay)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / decay)


def place(dst, src, at_s, gain=1.0):
    i = int(at_s * SR)
    n = min(len(src), len(dst) - i)
    if n > 0:
        dst[i:i + n] += src[:n] * gain


def stereo(mono, width_ms=0.0):
    if not width_ms:
        return np.stack([mono, mono], axis=1)
    d = int(SR * width_ms / 1000)
    return np.stack([mono, np.concatenate([np.zeros(d), mono[:-d]])], axis=1)


def pan(mono, positions):
    """Equal-power pan along a per-sample position array (0 = left, 1 = right)."""
    return np.stack([mono * np.cos(positions * np.pi / 2), mono * np.sin(positions * np.pi / 2)], axis=1)


# --- effects -----------------------------------------------------------------

def tap():
    """A seed tapping on a wooden table: tiny strike into two wood modes."""
    n = int(SR * 0.12)
    hit = burst(1.2, 6000, n)
    body = resonator(hit, 1150, 0.018) * 1.0 + resonator(hit, 2350, 0.009) * 0.6 + resonator(hit, 520, 0.025) * 0.5
    mono = onepole_lp(body + hit * 0.15, 7000)
    return stereo(fade(mono, 0.2, 20), 0.3)


def pour():
    """Thick liquid pouring past: a soft noise swell carrying a stream of bubbles."""
    dur = 0.75
    t = t_axis(dur)
    p = t / dur
    swell = np.sin(np.pi * np.clip(p * 1.15, 0, 1)) ** 2
    noise = onepole_lp(onepole_hp(rng.standard_normal(len(t)), 250), 1800) * swell * 0.35
    mono = noise.copy()
    for _ in range(26):
        at = rng.uniform(0.05, 0.6)
        f0 = rng.uniform(380, 1100)
        tb = t_axis(0.06)
        place(mono, bubble(tb, f0, rng.uniform(0.4, 1.2), rng.uniform(0.008, 0.02)), at, rng.uniform(0.25, 0.7) * math.sin(math.pi * at / 0.65))
    mono = onepole_lp(mono, 5000)
    return pan(fade(mono, 10, 60), 0.35 + 0.3 * p)


def thud():
    """A full glass bottle set down on wood: low knock, wood body, faint glass ring."""
    n = int(SR * 0.45)
    hit = burst(3, 1800, n)
    t = t_axis(0.45)
    low = np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.07)
    wood = resonator(hit, 210, 0.05) * 1.2 + resonator(hit, 380, 0.03) * 0.7
    glass = resonator(burst(0.6, 9000, n), 3150, 0.05) * 0.10 + resonator(burst(0.6, 9000, n), 4720, 0.035) * 0.06
    mono = low * 0.9 + wood + glass
    return stereo(fade(mono, 0.3, 60), 0.4)


def clink():
    """A spoon lightly tapping a glass: inharmonic glass partials, short ring."""
    n = int(SR * 1.2)
    hit = burst(0.5, 12000, n)
    f = 2093.0
    modes = [(1.0, 1.0, 0.55), (2.32, 0.45, 0.32), (4.25, 0.22, 0.18), (6.63, 0.08, 0.1)]
    mono = sum(resonator(hit, f * r, d) * a for r, a, d in modes)
    return stereo(fade(mono, 0.2, 120), 0.6)


def plop():
    """An oil drop landing: small impact plus a rising-pitch bubble 'plink'."""
    t = t_axis(0.25)
    impact = burst(1.5, 2500, len(t)) * 0.4
    plink = np.zeros(len(t))
    place(plink, bubble(t_axis(0.12), 520, 1.6, 0.035), 0.004)
    place(plink, bubble(t_axis(0.06), 1250, 0.8, 0.012), 0.05, 0.25)
    mono = onepole_lp(impact + plink, 6000)
    return stereo(fade(mono, 0.3, 30), 0.3)


def pluck(freq, seconds, brightness=0.5):
    """Karplus-Strong plucked string."""
    n = int(SR * seconds)
    period = int(SR / freq)
    buf = onepole_lp(rng.standard_normal(period), 1500 + 5000 * brightness)
    out = np.zeros(n)
    damp = 0.996
    for i in range(n):
        v = buf[i % period]
        out[i] = v
        buf[i % period] = damp * 0.5 * (v + buf[(i + 1) % period])
    return out


def chord():
    """Warm plucked chord for the logo: D major add9, gently strummed."""
    dur = 2.4
    notes = [146.83, 220.00, 293.66, 369.99, 440.00, 329.63 * 2]
    gains = [0.9, 0.75, 0.7, 0.6, 0.5, 0.25]
    out = np.zeros((int(SR * dur), 2))
    for i, (f, g) in enumerate(zip(notes, gains)):
        s = pluck(f, dur - 0.1, brightness=0.35) * g
        side = 0.3 + 0.4 * i / (len(notes) - 1)
        st = np.stack([s * math.cos(side * math.pi / 2), s * math.sin(side * math.pi / 2)], axis=1)
        d = int(SR * 0.018 * i)
        out[d:d + len(s)] += st[: len(out) - d]
    out[:, 0], out[:, 1] = onepole_lp(out[:, 0], 3200), onepole_lp(out[:, 1], 3200)
    return np.stack([fade(out[:, 0], 0, 300), fade(out[:, 1], 0, 300)], axis=1)


def seeds():
    """Seeds raining onto a table: dense soft ticks that thin out."""
    dur = 1.6
    out = np.zeros((int(SR * dur), 2))
    for _ in range(90):
        at = rng.uniform(0, 1.0) ** 1.3 * 1.4
        f = rng.uniform(1400, 3600)
        n = int(SR * 0.03)
        tick = resonator(burst(0.4, 9000, n), f, rng.uniform(0.003, 0.008))
        side = rng.uniform(0.1, 0.9)
        g = rng.uniform(0.3, 1.0)
        i = int(at * SR)
        m = min(n, len(out) - i)
        out[i:i + m, 0] += tick[:m] * g * math.cos(side * math.pi / 2)
        out[i:i + m, 1] += tick[:m] * g * math.sin(side * math.pi / 2)
    return np.stack([fade(out[:, 0], 0, 200), fade(out[:, 1], 0, 200)], axis=1)


def press():
    """A screw press at work: low motor hum, slow mechanical pulse, seed crackle."""
    dur = 2.6
    t = t_axis(dur)
    hum = sum(np.sin(2 * np.pi * 55 * k * t) / k for k in (1, 2, 3, 4)) * 0.5
    pulse = 0.7 + 0.3 * np.sin(2 * np.pi * 2.2 * t)
    rumble = onepole_lp(rng.standard_normal(len(t)), 220) * 2.5
    crackle = np.zeros(len(t))
    for _ in range(120):
        n = int(SR * 0.02)
        place(crackle, resonator(burst(0.3, 8000, n), rng.uniform(1500, 4000), 0.004), rng.uniform(0, dur - 0.05), rng.uniform(0.2, 0.6))
    env = np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.4, 0, 1)
    mono = (onepole_lp(hum * pulse + rumble, 500) * 0.8 + crackle * 0.5) * env
    return stereo(mono, 0.8)


def squeeze():
    """Seeds crushed between press plates: machine rumble swells, shells crack, then a wet squish."""
    dur = 1.3
    t = t_axis(dur)
    out = np.zeros(len(t))
    # Machine: low hum and rumble rising as the plates close.
    rise = np.clip(t / 0.5, 0, 1) ** 2 * np.exp(-np.clip(t - 0.55, 0, None) / 0.2)
    hum = sum(np.sin(2 * np.pi * 48 * k * t) / k for k in (1, 2, 3))
    out += onepole_lp(hum * 0.6 + onepole_lp(rng.standard_normal(len(t)), 160) * 3.0, 400) * rise * 0.8
    # Cracks: shells giving way at contact.
    for _ in range(9):
        at = 0.48 + rng.uniform(0, 0.14)
        n = int(SR * 0.03)
        place(out, resonator(burst(0.5, 10000, n), rng.uniform(1800, 4200), 0.006), at, rng.uniform(0.4, 0.9))
    # Squish: low wet noise swell with a few low bubbles.
    sq_env = np.clip((t - 0.52) / 0.1, 0, 1) * np.exp(-np.clip(t - 0.65, 0, None) / 0.25)
    out += onepole_lp(rng.standard_normal(len(t)), 700) * sq_env * 1.6
    for _ in range(7):
        place(out, bubble(t_axis(0.08), rng.uniform(260, 600), 0.9, 0.025), rng.uniform(0.6, 0.95), rng.uniform(0.3, 0.6))
    return stereo(fade(onepole_lp(out, 6000), 2, 120), 0.5)


# --- io ------------------------------------------------------------------------

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
    for old in OUT.glob("*.wav"):
        old.unlink()
    for fn in (tap, pour, thud, clink, plop, chord, seeds, press, squeeze):
        write(fn.__name__, fn())
