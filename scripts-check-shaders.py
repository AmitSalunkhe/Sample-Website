"""
Guard against the precision-mismatch bug.

Three.js prepends `precision highp float` to every vertex shader. If a fragment
shader declares a lower precision and the two share a uniform, the program fails
to LINK and the mesh renders nothing at all, with no console error in production.
That silently blanked both sites once. Run this before shipping shader changes.
"""
import os, re, sys

bad = []
for root in ("luxe-jewellery/src", "lumiere-studio/src"):
    for dp, _, fs in os.walk(root):
        for f in fs:
            if not f.endswith((".tsx", ".ts")):
                continue
            p = os.path.join(dp, f)
            s = open(p, encoding="utf-8").read()
            if "gl_FragColor" not in s:
                continue
            frag_precision = re.search(r"precision\s+(\w+)\s+float", s)
            if frag_precision and frag_precision.group(1) != "highp":
                # collect uniforms declared twice: once per shader stage
                names = re.findall(r"uniform\s+\w+\s+(u\w+)", s)
                shared = {n for n in names if names.count(n) > 1}
                bad.append((p, frag_precision.group(1), sorted(shared)))

if bad:
    for p, prec, shared in bad:
        print(f"FAIL {p}: fragment is {prec}, shares uniforms {shared} with the vertex shader")
    sys.exit(1)
print("shader precision OK")
