# Bundled demo media

These fixtures were created for the public renderer demo on 2026-10-02.
They replace unavailable production inputs; they are not original production
recordings or footage.

## Graphics and video

- `orbit-teal.mp4`, `orbit-violet.mp4`, and `orbit-blue.mp4` are original
  procedural graphics: a grid, orbit paths, moving shapes, and data bars.
- `captioned-video.mp4` uses the same procedural graphics with bundled narration.
- No stock footage, third-party photographs, or external video clips are used.
- The complete pixel drawing and encoding source is
  `scripts/generate-demo-media.py`. FFmpeg encodes the generated PNG stream
  as H.264. The source artwork is 360 × 640 at 30 fps and is scaled by the
  renderer to its original 1080 × 1920 composition size.

## Narration and word timings

- All narration scripts were authored for these demos and are present in
  `scripts/generate-demo-media.py`.
- `audio/*.wav` was synthesized with eSpeak NG 1.52.0, the built-in `en-us`
  voice, speaking rate 195, pitch 45, and amplitude 135.
- This uses eSpeak's procedural speech synthesis. No MBROLA voice, recorded
  human voice, voice cloning, proprietary system voice, or paid API is used.
- eSpeak author Jonathan Duddington explicitly confirmed that the GPL does
  not apply to generated WAV output and that it can be used freely:
  <https://sourceforge.net/p/espeak/discussion/538920/thread/c6944a60/>.
- Only generated output is bundled. eSpeak NG itself is not redistributed.
  Engine source and license: <https://github.com/espeak-ng/espeak-ng>.
- Each word is synthesized separately, trimmed, faded briefly at its edges,
  and joined with controlled pauses. `src/demo/audio.ts` contains measured
  word boundaries and exact WAV durations. These are deterministic fixture
  timings, not an automatic transcription or forced-alignment result.
- `captioned-video.json` carries the same word boundaries in the original
  CaptionedVideo sidecar format.
- The synthetic narration is intentionally simple and audible. It is a
  portable engineering fixture rather than a production voiceover sample.

## Regeneration

Rendering the demos needs only the checked-in files and npm dependencies.
Regeneration is optional and additionally requires Python 3 and eSpeak NG
1.52.0 on PATH. The script uses FFmpeg on PATH, or the npm-installed Remotion
compositor's FFmpeg when a standalone executable is unavailable:

```sh
python3 scripts/generate-demo-media.py
```

No Python packages are required. The content and timing are reproducible
with the stated eSpeak version. Encoded MP4 bytes may vary with the FFmpeg
and libx264 versions; no byte-for-byte cross-version guarantee is implied.
