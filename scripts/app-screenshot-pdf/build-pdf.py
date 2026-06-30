"""Build a screenshot-only PDF from captured ERP screenshots."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent
SCREENSHOTS_DIR = ROOT / "output" / "screenshots"
MANIFEST_PATH = ROOT / "output" / "manifest.json"
OUTPUT_PDF = ROOT.parent.parent / "docs" / "Beauty-Salon-ERP-Application-Screenshots.pdf"

PAGE_WIDTH, PAGE_HEIGHT = landscape(letter)


def draw_fitted_image(c: canvas.Canvas, img_path: Path) -> None:
    with Image.open(img_path) as img:
        iw, ih = img.size

    scale = min(PAGE_WIDTH / iw, PAGE_HEIGHT / ih)
    nw = iw * scale
    nh = ih * scale
    x = (PAGE_WIDTH - nw) / 2
    y = (PAGE_HEIGHT - nh) / 2

    c.drawImage(ImageReader(str(img_path)), x, y, nw, nh, preserveAspectRatio=True, anchor="c")


def main() -> None:
    if not MANIFEST_PATH.exists():
        raise SystemExit(f"Missing manifest: {MANIFEST_PATH}. Run capture first.")

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if not manifest:
        raise SystemExit("Manifest is empty.")

    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUTPUT_PDF), pagesize=landscape(letter))

    for entry in manifest:
        img_path = SCREENSHOTS_DIR / entry["file"]
        if not img_path.exists():
            continue
        draw_fitted_image(c, img_path)
        c.showPage()

    c.save()
    print(f"PDF created: {OUTPUT_PDF}")
    print(f"Pages: {len(manifest)}")


if __name__ == "__main__":
    main()
