"""Генерира PNG изображения със знамето на България (без външни библиотеки).

    python3 scripts/flag-images.py

Създава public/og-image.png (1200×630) и public/apple-touch-icon.png (180×180).
"""
import struct
import zlib
from pathlib import Path

WHITE, GREEN, RED = (255, 255, 255), (0, 150, 110), (214, 38, 18)


def png(path, width, height):
    third = height / 3
    rows = []
    for y in range(height):
        color = WHITE if y < third else GREEN if y < 2 * third else RED
        rows.append(b"\x00" + bytes(color) * width)
    raw = zlib.compress(b"".join(rows), 9)

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)) + chunk(b"IDAT", raw) + chunk(b"IEND", b"")
    Path(path).write_bytes(data)
    print(path, width, "x", height)


root = Path(__file__).resolve().parent.parent / "public"
png(root / "og-image.png", 1200, 630)
png(root / "apple-touch-icon.png", 180, 180)
