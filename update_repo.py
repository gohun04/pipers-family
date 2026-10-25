"""Update this Homebrew Channel feed from a packaged webOS app."""
import hashlib, io, json, pathlib, shutil, subprocess, sys, tarfile
root = pathlib.Path(__file__).resolve().parent
src = pathlib.Path(sys.argv[1]).resolve()
data = subprocess.check_output(['ar', 'p', str(src), 'data.tar.gz'])
with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as archive:
    entries = [m for m in archive.getmembers() if m.name.endswith('/appinfo.json')]
    if len(entries) != 1:
        raise SystemExit('Expected exactly one appinfo.json')
    meta = json.load(archive.extractfile(entries[0]))
if meta['id'] != 'com.pipers.family':
    raise SystemExit('Wrong application ID')
repo = root / 'repo'
dest = repo / (meta['id'] + '_' + meta['version'] + '_all.ipk')
if src != dest.resolve():
    shutil.copyfile(src, dest)
manifest = json.loads((repo / 'manifest.json').read_text())
manifest.update(version=meta['version'], ipkUrl=dest.name, ipkSize=dest.stat().st_size,
                ipkHash={'sha256': hashlib.sha256(dest.read_bytes()).hexdigest()})
(repo / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Updated feed to', meta['version'], '- commit repo/ to GitHub.')
