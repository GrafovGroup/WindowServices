"""Rebuild the editable SVG reconstruction of owner-selected concept 1.
Requires fonttools 4.60.2; the normal website build needs no Python packages.
Original reference and licensed font sources are retained under assets/.
"""
from pathlib import Path
from html import escape
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/brand'
OUT.mkdir(parents=True, exist_ok=True)
FONT = ROOT / 'assets/fonts/manrope/Manrope-wght.ttf'
NAVY, BLUE = '#00244C', '#0094E4'
fonts = {}

def font(weight):
    if weight not in fonts:
        fonts[weight] = instantiateVariableFont(TTFont(FONT), {'wght': weight}, inplace=True)
    return fonts[weight]

def lettering(text, x, baseline, width, color=NAVY, weight=800, tracking=0, suffix_blue=False):
    f = font(weight)
    glyphs, cmap = f.getGlyphSet(), f.getBestCmap()
    advances = [f['hmtx'][cmap[ord(c)]][0] for c in text]
    scale = width / (sum(advances) + tracking * max(0, len(text) - 1))
    position, paths = 0, []
    for i, char in enumerate(text):
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
        glyphs[name].draw(pen)
        fill = BLUE if suffix_blue and i >= len(text) - 3 else color
        paths.append(f'<path fill="{fill}" transform="translate({position} 0)" d="{pen.getCommands()}"/>')
        position += advances[i] + tracking
    return f'<g aria-label="{escape(text)}" transform="translate({x} {baseline}) scale({scale:.7f} {-scale:.7f})">{"".join(paths)}</g>'

# Panel boundaries and arch traced from the recovered first concept, not invented from prose.
left = ['40,37 62.8,22.2 62.8,46.7 40,56', '40,58 62.8,48.7 62.8,68.9 40,71',
        '65.2,20.7 94,2 94,34 65.2,45.7', '65.2,47.7 94,36 94,66 65.2,68.7']
right = ['101,0 122,15.1 122,44.3 101,35', '101,37 122,46.3 122,70.9 101,67',
         '124,16.6 144,31 144,54 124,45.2', '124,47.2 144,56 144,75 124,71.3']

def emblem(x=0, y=0, scale=1, mono=None):
    panels = ''.join(f'<polygon fill="{mono or NAVY}" points="{p}"/>' for p in left)
    panels += ''.join(f'<polygon fill="{mono or BLUE}" points="{p}"/>' for p in right)
    panels += f'<path fill="{mono or NAVY}" d="M0 94 Q84 48 170 94 Q84 60 0 94Z"/>'
    return f'<g transform="translate({x} {y}) scale({scale})">{panels}</g>'

def svg(name, width, height, content):
    text = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img"><title>WindowServices.ca</title><desc>Editable vector reconstruction of owner-selected architectural concept 1. Original reference retained in source; typography standardized in Manrope.</desc>{content}</svg>\n'
    (OUT / name).write_text(text)

for variant, mono in [('', None), ('-white', '#FFFFFF'), ('-mono', NAVY)]:
    color = mono or NAVY
    mark = emblem(8, 16, .83, mono)
    mark += lettering('WindowServices.ca', 165, 72, 425, color, suffix_blue=mono is None)
    svg(f'logo-horizontal{variant}.svg', 600, 110, mark)
    for lang, descriptor in [('en', 'WINDOW CLEANING • REPAIR • INSTALLATION'), ('fr', 'NETTOYAGE • RÉPARATION • INSTALLATION DE FENÊTRES')]:
        mark = emblem(140, 16, 1.88, mono)
        mark += lettering('WindowServices.ca', 20, 258, 560, color, suffix_blue=mono is None)
        mark += lettering(descriptor, 33, 297, 534, color, weight=700, tracking=130)
        svg(f'logo-stacked-{lang}{variant}.svg', 600, 330, mark)
    svg(f'logo-emblem{variant}.svg', 190, 114, emblem(10, 10, 1, mono))

# A clear light tile keeps the raster favicon readable on both light and dark tabs.
icon = '<rect x="2" y="2" width="188" height="188" rx="32" fill="#FFFFFF"/>' + emblem(10, 43, 1)
svg('icon-source.svg', 192, 192, icon)
(ROOT / 'public/favicon.svg').write_text((OUT / 'icon-source.svg').read_text())

for lang in ['en', 'fr']:
    card = '<rect width="1200" height="630" fill="#00244C"/><path d="M760 0H1200V630H1000Z" fill="#073763"/><path d="M990 0H1030V630H990Z" fill="#0094E4" opacity=".3"/>'
    card += emblem(62, 52, .9, '#FFFFFF')
    card += lettering('WindowServices.ca', 242, 117, 648, '#FFFFFF')
    lines = ['Window cleaning,', 'repair & installation.'] if lang == 'en' else ['Nettoyage, réparation', 'et installation de fenêtres.']
    for i, line in enumerate(lines):
        card += lettering(line, 65, 330 + 100 * i, 940 if lang == 'fr' else 930, '#FFFFFF', weight=700)
    footer = 'COMMERCIAL & RESIDENTIAL' if lang == 'en' else 'COMMERCIAL ET RÉSIDENTIEL'
    card += lettering(footer, 67, 552, 470, '#FFFFFF', weight=700, tracking=140)
    svg(f'social-card-{lang}.svg', 1200, 630, card)
print('Generated option 1 vector variants, icon source and bilingual social cards.')
