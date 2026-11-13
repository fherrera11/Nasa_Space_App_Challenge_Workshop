"""Capture the running workshop iPhone app and update its PowerPoint slide."""

import argparse
import os
import posixpath
import shutil
import struct
import subprocess
import tempfile
from pathlib import Path
from xml.dom import minidom
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
DECK = ROOT / "slides/Where-on-Earth-90-Minutes.pptx"
CAPTURE = ROOT / "slides/images/mobile/swift-iceberg.png"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
CAPTION = "IcebergMap • iPhone simulator"


def replace_text(parent, text):
    runs = parent.getElementsByTagNameNS(A, "t")
    if not runs:
        raise ValueError("The selected slide object has no editable text.")
    for run in runs:
        for child in list(run.childNodes):
            run.removeChild(child)
    runs[0].appendChild(parent.ownerDocument.createTextNode(text))


def update_deck(destination, png):
    if png[:16] != b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR" or png[-8:-4] != b"IEND":
        raise ValueError("Choose a complete PNG screenshot.")
    width, height = struct.unpack_from(">II", png, 16)
    if not 0 < width < height:
        raise ValueError("Choose a portrait iPhone screenshot.")

    with ZipFile(DECK) as source:
        matches = [part for part in source.namelist() if part.startswith("ppt/slides/slide")
                   and part.endswith(".xml") and b"Move the iceberg one week" in source.read(part)]
        if len(matches) != 1:
            raise ValueError("Could not identify the workshop’s Swift slide.")
        slide_part = matches[0]
        slide = minidom.parseString(source.read(slide_part))
        rel_part = posixpath.join(posixpath.dirname(slide_part), "_rels", posixpath.basename(slide_part) + ".rels")
        rels = minidom.parseString(source.read(rel_part))
        relations = {e.getAttribute("Id"): e for e in rels.documentElement.childNodes
                     if e.nodeType == e.ELEMENT_NODE}

        picture, = slide.getElementsByTagNameNS(P, "pic")
        image_id = picture.getElementsByTagNameNS(A, "blip")[0].getAttributeNS(R, "embed")
        media_part = "ppt/media/workshopSwiftSimulator.png"
        relations[image_id].setAttribute("Target", "../media/workshopSwiftSimulator.png")
        picture.getElementsByTagNameNS(P, "cNvPr")[0].setAttribute(
            "descr", "Iceberg A-23A, a dated orange point on the workshop’s iPhone map.")
        for crop in list(picture.getElementsByTagNameNS(A, "srcRect")):
            crop.parentNode.removeChild(crop)
        transform = picture.getElementsByTagNameNS(A, "xfrm")[0]
        size = transform.getElementsByTagNameNS(A, "ext")[0]
        origin = transform.getElementsByTagNameNS(A, "off")[0]
        old_width = int(size.getAttribute("cx"))
        new_width = round(int(size.getAttribute("cy")) * width / height)
        origin.setAttribute("x", str(int(origin.getAttribute("x")) + (old_width - new_width) // 2))
        size.setAttribute("cx", str(new_width))

        caption, = [shape for shape in slide.getElementsByTagNameNS(P, "sp")
                    if any(label in shape.toxml() for label in ("Esri Swift sample", CAPTION))]
        replace_text(caption, CAPTION)
        caption.getElementsByTagNameNS(P, "cNvPr")[0].setAttribute("name", CAPTION)
        for click in list(caption.getElementsByTagNameNS(A, "hlinkClick")):
            if click.parentNode.hasAttribute("u"):
                click.parentNode.removeAttribute("u")
            click.parentNode.removeChild(click)
        for rel in list(relations.values()):
            if rel.getAttribute("Target").endswith("/style-graphics-with-symbols/") and rel.getAttribute("Id") not in slide.toxml():
                rel.parentNode.removeChild(rel)

        updated = {slide_part: slide.toxml(encoding="UTF-8"), rel_part: rels.toxml(encoding="UTF-8"),
                   media_part: png}
        with ZipFile(destination, "w") as out:
            for item in source.infolist():
                data = updated.pop(item.filename) if item.filename in updated else source.read(item)
                out.writestr(item, data)
            for name, data in updated.items():
                out.writestr(name, data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    choice = parser.add_mutually_exclusive_group()
    choice.add_argument("--device", default="booted", help="simulator UDID if several devices are booted")
    choice.add_argument("--image", type=Path, help="use an existing portrait simulator PNG")
    args = parser.parse_args()
    if not args.image and not shutil.which("xcrun"):
        parser.exit(1, "Open the app in Simulator on your Mac, or pass --image with your own capture.\n")
    try:
        with tempfile.TemporaryDirectory(dir=DECK.parent) as folder:
            folder = Path(folder)
            capture = folder / "capture.png"
            if args.image:
                shutil.copyfile(args.image, capture)
            else:
                subprocess.run(["xcrun", "simctl", "io", args.device, "screenshot", str(capture)], check=True)
            updated = folder / DECK.name
            update_deck(updated, capture.read_bytes())
            CAPTURE.parent.mkdir(parents=True, exist_ok=True)
            os.replace(updated, DECK)
            os.replace(capture, CAPTURE)
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Could not update the Swift slide. {error}\n")
    print(f"Updated {DECK.name} and saved {CAPTURE.name}. Export the updated deck to PDF in PowerPoint.")


if __name__ == "__main__":
    main()
