#!/usr/bin/env python3
# =============================================================================
# Lunar Blog - social card generator
# =============================================================================
# Writes design/og-image.svg (1200x630): the source for public/og-image.png,
# the default og:image (siteConfig.ogImage). It follows LunarCSS's own
# design/og-image.py, so the two cards match: the same frame, heading, dotted
# rule and numbered list on the left, drawn from the theme's real geometry at
# about 1.6x in the dark theme's colors. On the right is the blog itself: a
# post card, split diagonally between the light and dark themes.
#
# Pixel-snapped for a crisp 1x export, as in the theme's script: straight
# lines are filled rectangles, the few stroked outlines have 2px strokes set
# 1px in from the edge, and there are no <pattern> fills, which Figma drops on
# import. Mixed colors (muted, link tints) are the theme's OKLCH mixes, worked
# out ahead of time. Text widths were measured with the real fonts.
#
# Run from the repo root (plain Python 3, no dependencies):
#   python3 design/og-image.py
# Then export the PNG: tweak in Figma and export at 1x, like the theme's card,
# or render it with headless Chrome and the packaged fonts:
#   sh design/og-image-png.sh
# =============================================================================

import math
BG='#2a2c2f'; FG='#ece8e3'; MUTED='#878285'; ACCENT='#ff5623'
# Link chip tint, color-mix(in oklch, bg 80%, muted), in each theme
TINT_DARK='#3b3c40'; TINT_LIGHT='#d8d2cf'
def n(v): return ('%.2f'%v).rstrip('0').rstrip('.')
def rect(x,y,w,h): return f'M{n(x)} {n(y)}h{n(w)}v{n(h)}h{n(-w)}Z'
def poly(pts): return ' '.join(f'{n(x)},{n(y)}' for x,y in pts)

def clip(poly,a,b,c):
    out=[]
    for i in range(len(poly)):
        P=poly[i]; Q=poly[(i+1)%len(poly)]
        pin=a*P[0]+b*P[1]<=c+1e-9; qin=a*Q[0]+b*Q[1]<=c+1e-9
        if pin: out.append(P)
        if pin!=qin:
            t=(c-a*P[0]-b*P[1])/(a*(Q[0]-P[0])+b*(Q[1]-P[1]))
            out.append((P[0]+t*(Q[0]-P[0]),P[1]+t*(Q[1]-P[1])))
    return out
def stripes(x0,y0,w,h,width=6,period=12):
    # striped mixin, 135deg: diagonal bands `width` thick, one every `period`
    P=period*math.sqrt(2); W=width*math.sqrt(2)
    box=[(x0,y0),(x0+w,y0),(x0+w,y0+h),(x0,y0+h)]
    d=''; k=math.floor((x0+y0)/P)-1
    while k*P < x0+y0+w+h:
        poly=clip(clip(box,-1,-1,-k*P),1,1,k*P+W)
        if len(poly)>=3: d+='M'+'L'.join(f'{n(x)} {n(y)}' for x,y in poly)+'Z'
        k+=1
    return d
def mark(x,baseline,size,bars):
    # Heading mark: slanted bars with cut corners, in em of the heading
    h,sl,bar,gap,cut=0.7*size,0.28*size,0.18*size,0.08*size,0.08*size
    top=baseline-0.35*size-h/2; run=sl*cut/h; out=[]
    for i in range(bars):
        bx=x+i*(bar+gap)
        out.append(poly([(bx+cut,top),(bx+bar,top),(bx+bar+sl-run,top+h-cut),
                         (bx+bar+sl-cut,top+h),(bx+sl,top+h),(bx+run,top+cut)]))
    return out, bars*bar+(bars-1)*gap+sl+0.1*size
def chip(x,baseline,text_w,size,tint,pad=13,cut=10):
    # Link chip: a tint with a cut top-right corner and a 2px accent underline
    top=round(baseline-0.88*size); bot=round(baseline+0.3*size); r=round(x+pad+text_w+pad)
    return (f'<polygon points="{poly([(x,top),(r-cut,top),(r,top+cut),(r,bot),(x,bot)])}" fill="{tint}"/>'
            f'<path d="{rect(x,bot-2,r-x,2)}" fill="{ACCENT}"/>'), r

o=[]; a=o.append
a(f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Lunar Blog social card, matching LunarCSS's: theme geometry at about
       1.6x, dark theme colors, pixel-snapped for a crisp 1x export. No
       <pattern> fills, so Figma imports every stripe and dot as a vector.
       Fonts: Space Grotesk, Space Mono. -->
  <defs>
    <clipPath id="light-half"><polygon points="600,0 968,0 808,630 600,630"/></clipPath>
    <clipPath id="dark-half"><polygon points="968,0 1200,0 1200,630 808,630"/></clipPath>
  </defs>

  <rect id="background" width="1200" height="630" fill="{BG}"/>
''')

# Fieldset: sides and bottom, no top (the legend is the top). The legend's
# stripes resume 10px after the text, as on the theme's card.
L,R,T,B=56,1144,52,586
a(f'''  <g id="fieldset">
    <path id="fieldset-border" d="{rect(L,T,2,B-T)}{rect(R-2,T,2,B-T)}{rect(L,B-2,R-L,2)}" fill="{MUTED}"/>
    <g id="legend">
      <path id="legend-lead" d="{stripes(L+2,T,19,30)}" fill="{MUTED}"/>
      <text x="90" y="{T+21}" font-family="Space Mono" font-weight="700" font-size="20" letter-spacing="0.5" fill="{MUTED}">CLASSLESS ASTRO BLOG</text>
      <path id="legend-rest" d="{stripes(355,T,R-2-355,30)}" fill="{MUTED}"/>
    </g>
  </g>
''')

# h1 with its one-bar mark, exactly as on the theme's card
x0=88; top,h=134,62; bar,sl,cut=16,25,7
run=sl*cut/h
pts=[(x0+cut,top),(x0+bar,top),(x0+bar+sl-run,top+h-cut),(x0+bar+sl-cut,top+h),(x0+sl,top+h),(x0+run,top+cut)]
a(f'''  <g id="h1">
    <polygon id="h1-mark" points="{poly(pts)}" fill="{MUTED}"/>
    <text x="138" y="196" font-family="Space Grotesk" font-weight="700" font-size="88" letter-spacing="-2" fill="{FG}">Lunar Blog</text>
  </g>
''')

# Paragraph with its left bracket (hangs 13px left of the text)
bx=75; pt,pb=236,318
a(f'''  <g id="paragraph">
    <path id="p-bracket" d="{rect(bx,pt,2,pb-pt)}{rect(bx,pt,13,2)}{rect(bx,pb-2,13,2)}" fill="{MUTED}"/>
    <text font-family="Space Grotesk" font-size="24" fill="{FG}">
      <tspan x="{x0}" y="264">A classless Astro blog: write Markdown,</tspan>
      <tspan x="{x0}" y="303">get plain HTML styled by LunarCSS.</tspan>
    </text>
  </g>
''')

# Dotted hr: 3px dots on a 6px grid
d=''
for j in range(4):
    for i in range(78):
        cx=x0+6*i+2.5; cy=338+6*j+2.5
        d+=f'M{n(cx-1.5)} {n(cy)}a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0'
a(f'  <path id="hr" d="{d}" fill="{MUTED}"/>\n')

# Ordered list
items=['Markdown and MDX posts, tags and RSS','Light and dark from the system setting','No JavaScript, no third-party requests','One config file to make it yours']
a('  <g id="ordered-list">\n')
for i,t in enumerate(items):
    y=402+i*44
    a(f'''    <text x="146" y="{y}" text-anchor="end" font-family="Space Mono" font-size="18" fill="{MUTED}">{i+1:02d} /</text>
    <text x="152" y="{y}" font-family="Space Grotesk" font-size="22" fill="{FG}">{t}</text>
''')
a('  </g>\n')

# ---------------- Right column: a post card, light | dark ----------------
# The card mixin at about 1.6x: 26px padding and corner cuts (top-right and
# bottom-left), a 2px border drawn as the outer shape with the fill inset on
# top, the header's dashes (2 / 44 / 30 / 10 %), and the footer's striped band
# (6px stripes, one every 12px: the mixin's gap is the whole period, so the
# footer's 4px-every-8px becomes 6-every-12, like the legend) running border
# to border.
CX,CW,CT=624,488,164; CR=CX+CW; PAD,BW,CUT=26,2,26
TB=CT+54                 # title baseline (h3, 30px bold)
DASH=TB+22               # header dashes, 6px tall
P1,P2=CT+141,CT+175      # description lines (22px)
BAND=CT+222              # footer band, 26px tall
FB=BAND+26+13+18         # footer text baseline (18px)
CB=FB+6+PAD              # card bottom

def card(bg,fg,border,tint):
    ci=CUT-BW*0.5858
    outer=[(CX,CT),(CR-CUT,CT),(CR,CT+CUT),(CR,CB),(CX+CUT,CB),(CX,CB-CUT)]
    inner=[(CX+BW,CT+BW),(CR-BW-ci,CT+BW),(CR-BW,CT+BW+ci),(CR-BW,CB-BW),(CX+BW+ci,CB-BW),(CX+BW,CB-BW-ci)]
    s=f'<polygon points="{poly(outer)}" fill="{border}"/><polygon points="{poly(inner)}" fill="{bg}"/>'
    # Header: the h3's three-bar mark, then the title as a link chip
    bars,mw=mark(CX+PAD,TB,30,3)
    s+=''.join(f'<polygon points="{b}" fill="{MUTED}"/>' for b in bars)
    tx=CX+PAD+round(mw)
    c,_=chip(tx,TB,364,30,tint); s+=c
    s+=f'<text x="{tx+13}" y="{TB}" font-family="Space Grotesk" font-weight="700" font-size="30" fill="{fg}">Every Markdown element</text>'
    iw=CW-2*BW; dx=CX+BW
    s+='<path d="'+''.join(rect(dx+round(iw*a0),DASH,round(iw*(a1-a0)),6) for a0,a1 in ((0,.02),(.04,.48),(.56,.86),(.9,1)))+f'" fill="{MUTED}"/>'
    # Description, with the paragraph's bracket hanging left of the text
    px=CX+PAD
    s+=f'<path d="{rect(px-13,P1-23,2,P2-P1+34)}{rect(px-13,P1-23,13,2)}{rect(px-13,P2+9,13,2)}" fill="{MUTED}"/>'
    s+=(f'<text font-family="Space Grotesk" font-size="22" fill="{fg}">'
        f'<tspan x="{px}" y="{P1}">A reference post with every element</tspan>'
        f'<tspan x="{px}" y="{P2}">Markdown can produce, in one place.</tspan></text>')
    # Footer: the striped band, then the date and the tags as link chips
    s+=f'<path d="{stripes(dx,BAND,iw,26,width=6,period=12)}" fill="{MUTED}"/>'
    s+=f'<text x="{px}" y="{FB}" font-family="Space Grotesk" font-size="18" fill="{fg}">September 30, 2026 ·</text>'
    x=px+189
    c,x=chip(x,FB,90,18,tint); s+=c+f'<text x="{x-13-90}" y="{FB}" font-family="Space Grotesk" font-size="18" fill="{fg}">markdown</text>'
    s+=f'<text x="{x}" y="{FB}" font-family="Space Grotesk" font-size="18" fill="{fg}">,</text>'
    x+=9
    c,x=chip(x,FB,85,18,tint); s+=c+f'<text x="{x-13-85}" y="{FB}" font-family="Space Grotesk" font-size="18" fill="{fg}">reference</text>'
    return s

a(f'''  <g id="post-card">
    <g id="post-card-light" clip-path="url(#light-half)">{card(FG,BG,BG,TINT_LIGHT)}</g>
    <g id="post-card-dark" clip-path="url(#dark-half)">{card(BG,FG,FG,TINT_DARK)}</g>
  </g>

  <text id="url" x="{R}" y="614" text-anchor="end" font-family="Space Mono" font-size="16" letter-spacing="0.4" fill="{MUTED}">nikolaiwu.github.io/lunar-blog</text>
</svg>
''')
open("design/og-image.svg", "w").write(''.join(o))
