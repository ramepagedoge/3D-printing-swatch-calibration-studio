import os
import math
from PIL import Image, ImageDraw, ImageFilter

PUB_DIR = "projects/3D Printing/bambu-swatch-calibration-studio/public"
os.makedirs(PUB_DIR, exist_ok=True)

# 1. Generate crisp vector SVG
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <!-- Brand Gradient: Bambu Green (#00ae42) to Vibrant Cyan (#06b6d4) -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ae42" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="cubeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Modern Squircle Base -->
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#brandGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />

  <!-- 3D Isometric Calibration Cube -->
  <g filter="url(#cubeShadow)">
    <!-- Top Face (Pure White Highlight) -->
    <polygon points="32,15 48,24.24 32,33.48 16,24.24" fill="#ffffff" fill-opacity="0.98" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" />
    
    <!-- Left Face (Soft Mint Facet) -->
    <polygon points="16,24.24 32,33.48 32,49 16,39.76" fill="#e6fffa" fill-opacity="0.80" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" />
    
    <!-- Right Face (Vibrant Cyan Facet) -->
    <polygon points="32,33.48 48,24.24 48,39.76 32,49" fill="#cffafe" fill-opacity="0.60" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" />
    
    <!-- Inner Seams -->
    <line x1="32" y1="33.48" x2="32" y2="49" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  </g>
</svg>"""

svg_path = os.path.join(PUB_DIR, "favicon.svg")
with open(svg_path, "w") as f:
    f.write(svg_content)
print("Saved SVG:", svg_path)

# 2. Render High-Resolution Master 512x512 with PIL
def render_master(size=512):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = int(size * 0.04)
    r = int(size * 0.23)
    
    # Gradient Squircle (Bambu Green #00ae42 to Cyan #06b6d4)
    mask = Image.new("L", (size, size), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=255)
    
    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for y in range(pad, size - pad):
        t = (y - pad) / (size - 2 * pad)
        # Interpolate (0, 174, 66) -> (6, 182, 212)
        rc = int(0 * (1 - t) + 6 * t)
        gc = int(174 * (1 - t) + 182 * t)
        bc = int(66 * (1 - t) + 212 * t)
        g_draw.line([(pad, y), (size - pad, y)], fill=(rc, gc, bc, 255))
    
    grad.putalpha(mask)
    img.paste(grad, (0, 0), grad)
    
    # Outer crisp rim
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, outline=(255, 255, 255, 90), width=int(size * 0.024))
    
    # 3D Isometric Calibration Cube
    cx, cy = size // 2, size // 2 + int(size * 0.015)
    s = size * 0.28
    
    # Drop shadow for cube
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    # Cube silhouette
    cube_poly = [
        (cx, cy - s),
        (cx + s * math.cos(math.radians(30)), cy - s * math.sin(math.radians(30))),
        (cx + s * math.cos(math.radians(30)), cy + s - s * math.sin(math.radians(30))),
        (cx, cy + s),
        (cx - s * math.cos(math.radians(30)), cy + s - s * math.sin(math.radians(30))),
        (cx - s * math.cos(math.radians(30)), cy - s * math.sin(math.radians(30)))
    ]
    s_draw.polygon(cube_poly, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(int(size * 0.035)))
    img.paste(shadow, (0, int(size * 0.035)), shadow)
    
    # Re-acquire draw
    draw = ImageDraw.Draw(img)
    
    # Faces:
    top_pts = [
        (cx, cy - s),
        (cx + s * math.cos(math.radians(30)), cy - s * math.sin(math.radians(30))),
        (cx, cy),
        (cx - s * math.cos(math.radians(30)), cy - s * math.sin(math.radians(30)))
    ]
    draw.polygon(top_pts, fill=(255, 255, 255, 250))
    
    left_pts = [
        (cx - s * math.cos(math.radians(30)), cy - s * math.sin(math.radians(30))),
        (cx, cy),
        (cx, cy + s),
        (cx - s * math.cos(math.radians(30)), cy + s - s * math.sin(math.radians(30)))
    ]
    draw.polygon(left_pts, fill=(230, 255, 250, 205))
    
    right_pts = [
        (cx, cy),
        (cx + s * math.cos(math.radians(30)), cy - s * math.sin(math.radians(30))),
        (cx + s * math.cos(math.radians(30)), cy + s - s * math.sin(math.radians(30))),
        (cx, cy + s)
    ]
    draw.polygon(right_pts, fill=(207, 250, 254, 155))
    
    # Crisp white seams
    lw = max(2, int(size * 0.022))
    draw.line([top_pts[0], top_pts[1], top_pts[2], top_pts[3], top_pts[0]], fill=(255, 255, 255, 255), width=lw)
    draw.line([left_pts[0], left_pts[3], left_pts[2]], fill=(255, 255, 255, 255), width=lw)
    draw.line([right_pts[1], right_pts[2], right_pts[3]], fill=(255, 255, 255, 255), width=lw)
    draw.line([(cx, cy), (cx, cy + s)], fill=(255, 255, 255, 255), width=lw)
    
    return img

master = render_master(512)

# Save apple-touch-icon.png (180x180)
apple_icon = master.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save(os.path.join(PUB_DIR, "apple-touch-icon.png"))
print("Saved apple-touch-icon.png")

# Save favicon-32x32.png
fav32 = master.resize((32, 32), Image.Resampling.LANCZOS)
fav32.save(os.path.join(PUB_DIR, "favicon-32x32.png"))
print("Saved favicon-32x32.png")

# Save favicon-16x16.png
fav16 = master.resize((16, 16), Image.Resampling.LANCZOS)
fav16.save(os.path.join(PUB_DIR, "favicon-16x16.png"))
print("Saved favicon-16x16.png")

# Save multi-resolution favicon.ico (16, 32, 48)
fav48 = master.resize((48, 48), Image.Resampling.LANCZOS)
fav48.save(
    os.path.join(PUB_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)
print("Saved favicon.ico")
