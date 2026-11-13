"""Build the student ZIP from this workshop using only the Python standard library."""

import os
import tempfile
from fnmatch import fnmatch
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist/Earth-Event-Lab-starter.zip"
FOLDERS = ("application", "sample-data", "mobile", "tutorial/first-pin", "tests", "slides/images/mobile")
FILES = (".gitignore", ".gitattributes", "package.json", "tutorial/README.md",
         "scripts/update_ios_screenshot.py", "scripts/package_workshop.py",
         "slides/Where-on-Earth-90-Minutes.pptx", "slides/Where-on-Earth-90-Minutes.pdf")
SKIP_DIRS = {".git", "node_modules", ".expo", ".gradle", ".kotlin", ".idea", "build", "dist",
             "DerivedData", "xcuserdata", "__pycache__", "__MACOSX"}
SKIP_FILES = ("~$*", "._*", ".env", ".env.*", ".DS_Store", "Thumbs.db", "desktop.ini",
              "local.properties", "Local.xcconfig", "*.xcuserstate", "*.iml", "*.pyc",
              "*.jks", "*.keystore", "*.p12", "*.mobileprovision")
STUDENT_README = """# Earth Event Lab

## Start here

Extract the whole ZIP. In a terminal, open the extracted folder that contains this README.
Run `python3 -m http.server 8000 --bind 127.0.0.1` on macOS or Linux, or
`py -m http.server 8000 --bind 127.0.0.1` on Windows.
Open [your first pin](http://localhost:8000/tutorial/first-pin/) and
[the map with the class data](http://localhost:8000/application/?data=sample) in two tabs.

Follow the [student tutorial](tutorial/README.md#90-minute-workshop).
The [90-minute PowerPoint](slides/Where-on-Earth-90-Minutes.pptx),
[slide PDF](slides/Where-on-Earth-90-Minutes.pdf) and [mobile project guides](mobile/README.md)
are included. On a Mac, follow the [iPhone simulator walkthrough](mobile/ios-iceberg/README.md).
"""


def project_files():
    paths = [ROOT / name for name in FILES]
    for folder in FOLDERS:
        for directory, dirs, files in os.walk(ROOT / folder):
            dirs[:] = [name for name in dirs if name not in SKIP_DIRS]
            for name in files:
                if any(fnmatch(name, pattern) for pattern in SKIP_FILES):
                    continue
                path = Path(directory) / name
                if not path.is_symlink():
                    paths.append(path)
    return sorted(paths, key=lambda path: path.relative_to(ROOT).as_posix())


def add_file(archive, name, data):
    info = ZipInfo("Earth-Event-Lab/" + name)
    info.create_system = 3
    mode = 0o100755 if name == "mobile/android-iceberg/gradlew" else 0o100644
    info.external_attr = mode << 16
    archive.writestr(info, data, compress_type=ZIP_DEFLATED, compresslevel=6)


def main():
    OUTPUT.parent.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=OUTPUT.parent) as directory:
        candidate = Path(directory) / OUTPUT.name
        with ZipFile(candidate, "w") as archive:
            add_file(archive, "README.md", STUDENT_README.encode("utf-8"))
            for path in project_files():
                add_file(archive, path.relative_to(ROOT).as_posix(), path.read_bytes())
        with ZipFile(candidate) as archive:
            bad = archive.testzip()
            if bad:
                raise ValueError(f"Unreadable file in the student archive: {bad}")
            count = len(archive.namelist())
        os.replace(candidate, OUTPUT)
    print(f"Packed {count} files in {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size / 1_000_000:.1f} MB).")


if __name__ == "__main__":
    main()
