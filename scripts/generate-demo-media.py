#!/usr/bin/env python3
"""Regenerate bundled fixtures using eSpeak NG's built-in voice + procedural pixels.

No cloud service, private input, recordings, or MBROLA voices are used.
Requires eSpeak NG 1.52.0 and FFmpeg (or npm-installed Remotion FFmpeg).
"""
from array import array
import json
import struct
import zlib
import math
from pathlib import Path
import platform
import shutil
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/demo'
ESPEAK = shutil.which('espeak-ng')
if not ESPEAK:
    raise SystemExit('Install eSpeak NG 1.52.0 and put espeak-ng on PATH.')
FFMPEG = shutil.which('ffmpeg')
if not FFMPEG:
    os_name = {'Darwin': 'darwin', 'Linux': 'linux', 'Windows': 'win32'}[platform.system()]
    arch = {'arm64': 'arm64', 'aarch64': 'arm64', 'x86_64': 'x64', 'AMD64': 'x64'}[platform.machine()]
    FFMPEG = str(ROOT / f'node_modules/@remotion/compositor-{os_name}-{arch}/ffmpeg')
    ffmpeg_file = Path(FFMPEG)
    if not ffmpeg_file.exists():
        raise SystemExit('Install npm dependencies or put FFmpeg on PATH.')
    ffmpeg_file.chmod(ffmpeg_file.stat().st_mode | 0o111)
FFMPEG = str(Path(FFMPEG).resolve())

# Newly authored demo copy. Single-word synthesis makes alignment measurable,
# rather than representing estimated timings as a production transcription.
SCRIPTS = {
    'quiz-intro': 'Three quick questions about our solar system.',
    'quiz-outro': 'How many did you get right? Thanks for playing!',
    'quiz-q1': 'Which planet is known as the red planet?',
    'quiz-a1': 'Mars.',
    'quiz-c1': 'Iron minerals give its surface a rusty color.',
    'quiz-q2': 'Which planet has the most famous rings?',
    'quiz-a2': 'Saturn.',
    'quiz-c2': 'Its rings are made of ice and rock.',
    'quiz-q3': 'What is the name of our star?',
    'quiz-a3': 'The Sun.',
    'quiz-c3': 'Its light takes about eight minutes to reach Earth.',
    'ranking-three': 'Number three. Reusable scenes keep a consistent visual language.',
    'ranking-two': 'Number two. Word timings turn narration into readable captions.',
    'ranking-one': 'Number one. A shared timeline keeps sound and picture together.',
    'ranking-closing': 'Three building blocks. One repeatable video pipeline.',
    'captioned-video': 'This demo pairs a generated video with word captions. Every asset is bundled. Clone the project and render it locally.',
}


def speech(name, text, temp):
    sample_rate = 22050
    combined = array('h', [0] * int(sample_rate * 0.12))
    captions = []
    for index, word in enumerate(text.split()):
        wav_path = temp / f'{name}-{index}.wav'
        subprocess.run([ESPEAK, '-v', 'en-us', '-s', '195', '-p', '45', '-a', '135', '-w', str(wav_path), word], check=True)
        with wave.open(str(wav_path), 'rb') as stream:
            assert stream.getnchannels() == 1 and stream.getsampwidth() == 2
            assert stream.getframerate() == sample_rate
            samples = array('h', stream.readframes(stream.getnframes()))
        # Remove eSpeak's per-utterance silence before adding controlled pauses.
        active = [i for i, value in enumerate(samples) if abs(value) > 90]
        if not active:
            raise ValueError(f'No speech samples for {word}')
        start = max(0, active[0] - 120)
        end = min(len(samples), active[-1] + 121)
        samples = samples[start:end]
        # Short fades avoid clicks when joining independently synthesized words.
        for i in range(min(100, len(samples) // 2)):
            samples[i] = int(samples[i] * i / 100)
            samples[-i - 1] = int(samples[-i - 1] * i / 100)
        word_start = len(combined) / sample_rate
        combined.extend(samples)
        word_end = len(combined) / sample_rate
        captions.append({'startInSeconds': round(word_start, 6), 'endInSeconds': round(word_end, 6), 'text': word})
        pause = 0.18 if word[-1] in '.?!' else 0.09 if word[-1] in ',;' else 0.025
        combined.extend(array('h', [0] * int(sample_rate * pause)))
    combined.extend(array('h', [0] * int(sample_rate * 0.12)))
    path = OUT / 'audio' / f'{name}.wav'
    with wave.open(str(path), 'wb') as stream:
        stream.setnchannels(1)
        stream.setsampwidth(2)
        stream.setframerate(sample_rate)
        stream.writeframes(combined.tobytes())
    return {'audioUrl': f'demo/audio/{name}.wav', 'durationInSeconds': len(combined) / sample_rate, 'captions': captions}


WIDTH, HEIGHT, FPS = 360, 640, 30
PALETTES = [(11, 22, 45, 44, 214, 189), (30, 17, 51, 182, 129, 250), (7, 30, 44, 81, 176, 255)]


def frame_at(frame, theme):
    """Paint original orbital/data graphics using Python's standard library."""
    red, green, blue, ar, ag, ab = PALETTES[theme]
    t = frame / FPS
    image = bytearray()
    for y in range(HEIGHT):
        glow = int(14 * math.sin(math.pi * y / HEIGHT))
        image.extend(bytes((red + glow, green + glow, blue + glow)) * WIDTH)

    def rect(x, y, w, h, color):
        left, right = max(0, int(x)), min(WIDTH, int(x + w))
        if right <= left:
            return
        row = bytes(color) * (right - left)
        for yy in range(max(0, int(y)), min(HEIGHT, int(y + h))):
            offset = (yy * WIDTH + left) * 3
            image[offset:offset + len(row)] = row

    def circle(cx, cy, radius, color):
        for y in range(max(0, int(cy - radius)), min(HEIGHT, int(cy + radius + 1))):
            half = math.sqrt(max(0, radius * radius - (y - cy) ** 2))
            rect(cx - half, y, half * 2 + 1, 1, color)

    grid_color = (red + 16, green + 16, blue + 16)
    for x in range(0, WIDTH, 30):
        rect(x, 0, 1, HEIGHT, grid_color)
    for y in range(0, HEIGHT, 30):
        rect(0, y, WIDTH, 1, grid_color)
    # Three elliptical orbit paths around an original procedural planet.
    for radius in (65, 100, 135):
        for step in range(150):
            angle = step * math.tau / 150
            rect(180 + radius * math.cos(angle), 315 + radius * 0.7 * math.sin(angle), 2, 2, (ar // 2, ag // 2, ab // 2))
    circle(180, 315, 37, (ar, ag, ab))
    circle(169, 303, 25, (min(255, ar + 32), min(255, ag + 32), min(255, ab + 32)))
    for index, radius in enumerate((65, 100, 135)):
        angle = t * (0.8 - index * 0.16) + index * 2.1
        circle(180 + radius * math.cos(angle), 315 + radius * 0.7 * math.sin(angle), 6 + index * 2, (231, 242, 250))
    # Small moving data bars illustrate the procedural footage's progression.
    for index in range(5):
        length = 40 + 80 * (0.5 + 0.5 * math.sin(t * 1.5 + index))
        rect(28, 490 + index * 12, length, 3, (ar, ag, ab))
        rect(238, 490 + index * 12, 90, 3, grid_color)
    rect(28, 105, 50, 5, (ar, ag, ab))
    rect(28, 118, 115, 3, grid_color)
    rect(28, 125, 90, 3, grid_color)
    return image


def png(image):
    def chunk(name, data):
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', zlib.crc32(name + data))
    stride = WIDTH * 3
    scanlines = b''.join(b'\x00' + image[y * stride:(y + 1) * stride] for y in range(HEIGHT))
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', WIDTH, HEIGHT, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(scanlines, 3)) + chunk(b'IEND', b'')


def video(path, seconds, theme, audio=None):
    count = math.ceil(seconds * FPS)
    command = [FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', str(FPS), '-i', 'pipe:0']
    if audio:
        command += ['-i', str(audio), '-c:a', 'aac', '-b:a', '128k']
    command += ['-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-map_metadata', '-1', '-t', str(count / FPS), str(path)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE, cwd=str(Path(FFMPEG).parent))
    try:
        for index in range(count):
            process.stdin.write(png(frame_at(index, theme)))
        process.stdin.close()
    finally:
        status = process.wait()
    if status:
        raise RuntimeError(f'FFmpeg exited with {status}')


def main():
    (OUT / 'audio').mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='ncstudio-demo-') as directory:
        temp = Path(directory)
        audios = {name: speech(name, text, temp) for name, text in SCRIPTS.items()}
    (ROOT / 'src/demo/audio.ts').write_text('// Generated by scripts/generate-demo-media.py.\nexport const demoAudio = ' + json.dumps(audios, indent=2) + ';\n')
    for theme, name in enumerate(('orbit-teal', 'orbit-violet', 'orbit-blue')):
        video(OUT / f'{name}.mp4', 8, theme)
    captioned = audios['captioned-video']
    video(OUT / 'captioned-video.mp4', captioned['durationInSeconds'] + 0.3, 0, OUT / 'audio/captioned-video.wav')
    subtitles = {'transcription': [{**caption} for caption in captioned['captions']]}
    (OUT / 'captioned-video.json').write_text(json.dumps(subtitles, indent=2) + '\n')
    print(json.dumps({name: round(audio['durationInSeconds'], 3) for name, audio in audios.items()}, indent=2))


if __name__ == '__main__':
    main()
