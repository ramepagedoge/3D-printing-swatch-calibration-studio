import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths
INPUT_SCREENSHOT = "/Users/chiawei/.gemini/antigravity/brain/a7182545-d02e-4039-8bfa-0397aad9c43d/.user_uploaded/media_1794385240925_24992e2f.jpg"
ARTIFACTS_DIR = "/Users/chiawei/.gemini/antigravity/brain/a7182545-d02e-4039-8bfa-0397aad9c43d"

OUT_4_3_PNG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_4_3.png")
OUT_4_3_JPG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_4_3.jpg")
OUT_3_4_PNG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_3_4.png")
OUT_3_4_JPG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_3_4.jpg")

# Fonts
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_star(draw, cx, cy, r=7, fill=(255, 255, 255, 255)):
    """Draws a clean 5-pointed vector star without font dependencies"""
    points = []
    for i in range(10):
        radius = r if i % 2 == 0 else r * 0.44
        angle = i * math.pi / 5 - math.pi / 2
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=fill)

def draw_bolt(draw, cx, cy, h=14, fill=(255, 255, 255, 255)):
    """Draws a crisp lightning bolt vector icon"""
    w = h * 0.55
    pts = [
        (cx + w*0.1, cy - h*0.5),
        (cx - w*0.5, cy + h*0.05),
        (cx - w*0.05, cy + h*0.05),
        (cx - w*0.2, cy + h*0.5),
        (cx + w*0.5, cy - h*0.05),
        (cx + w*0.05, cy - h*0.05),
    ]
    draw.polygon(pts, fill=fill)

def draw_window_mockup(base_img, x, y, width, height, screenshot, url_text="ramepagedoge.github.io/3D-printing-swatch-calibration-studio"):
    """Draws a sleek macOS/dark studio window mockup containing the screenshot"""
    title_bar_height = 38
    
    # 1. Subtle drop shadow & back-glow
    shadow_pad = 32
    shadow_img = Image.new("RGBA", (width + shadow_pad * 2, height + shadow_pad * 2), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    # Outer green ambient halo
    shadow_draw.rounded_rectangle([shadow_pad - 8, shadow_pad - 8, width + shadow_pad + 8, height + shadow_pad + 8], radius=28, fill=(0, 174, 66, 40))
    # Deep dark shadow
    shadow_draw.rounded_rectangle([shadow_pad, shadow_pad, width + shadow_pad, height + shadow_pad], radius=20, fill=(0, 0, 0, 210))
    shadow_blur = shadow_img.filter(ImageFilter.GaussianBlur(22))
    base_img.paste(shadow_blur, (x - shadow_pad, y - shadow_pad), shadow_blur)

    # 2. Window container
    win_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    win_draw = ImageDraw.Draw(win_img)

    # Window frame & border
    win_draw.rounded_rectangle([0, 0, width, height], radius=16, fill=(18, 22, 28, 255), outline=(56, 62, 70, 255), width=2)
    
    # Title bar background
    win_draw.rounded_rectangle([0, 0, width, title_bar_height + 16], radius=16, fill=(28, 33, 40, 255))
    win_draw.rectangle([0, 16, width, title_bar_height], fill=(28, 33, 40, 255))
    win_draw.line([(0, title_bar_height), (width, title_bar_height)], fill=(48, 54, 61, 255), width=1)

    # Mac window buttons (red, yellow, green)
    btn_y = title_bar_height // 2
    win_draw.ellipse([20, btn_y - 6, 32, btn_y + 6], fill=(255, 95, 87, 255))
    win_draw.ellipse([40, btn_y - 6, 52, btn_y + 6], fill=(255, 189, 46, 255))
    win_draw.ellipse([60, btn_y - 6, 72, btn_y + 6], fill=(39, 201, 63, 255))

    # URL / Status pill
    pill_w = min(540, width - 200)
    pill_h = 24
    pill_x = (width - pill_w) // 2
    pill_y = (title_bar_height - pill_h) // 2
    win_draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=12, fill=(13, 17, 23, 220), outline=(48, 54, 61, 200), width=1)
    
    # Live status green dot indicator
    dot_x = pill_x + 18
    dot_y = pill_y + pill_h // 2
    win_draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=(0, 215, 85, 255))
    win_draw.ellipse([dot_x - 6, dot_y - 6, dot_x + 6, dot_y + 6], outline=(0, 215, 85, 100), width=1)
    
    font_url = get_font(FONT_REGULAR, 12)
    display_url = "https://" + url_text
    win_draw.text((pill_x + 32, pill_y + 4), display_url, fill=(160, 175, 190, 255), font=font_url)

    # 3. Fit Screenshot into content area
    content_w = width - 4
    content_h = height - title_bar_height - 2
    sc_resized = screenshot.resize((content_w, content_h), Image.Resampling.LANCZOS)
    win_img.paste(sc_resized, (2, title_bar_height))

    # Rounded clip mask
    mask = Image.new("L", (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, width, height], radius=16, fill=255)
    
    base_img.paste(win_img, (x, y), mask)

def create_4_3_cover():
    W, H = 1600, 1200
    img = Image.new("RGBA", (W, H), (10, 13, 17, 255))
    draw = ImageDraw.Draw(img)

    # Soft ambient radial glow
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([W//2 - 550, 180, W//2 + 550, 1020], fill=(0, 174, 66, 35))
    glow_draw.ellipse([W//2 - 320, 260, W//2 + 320, 920], fill=(0, 174, 66, 50))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
    img.paste(glow_layer, (0, 0), glow_layer)

    # Precision technical grid
    for x in range(0, W, 80):
        draw.line([(x, 0), (x, H)], fill=(22, 27, 34, 110), width=1)
    for y in range(0, H, 80):
        draw.line([(0, y), (W, y)], fill=(22, 27, 34, 110), width=1)

    # --- TOP HEADER SECTION ---
    # 1. Badge Pill
    badge_text = "OFFICIAL PARAMETRIC WEB CUSTOMIZER  |  100% FREE & OPEN SOURCE"
    font_badge = get_font(FONT_BOLD, 14)
    bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    bw = bbox[2] - bbox[0]
    bx = (W - bw - 60) // 2
    by = 40
    draw.rounded_rectangle([bx, by, bx + bw + 60, by + 34], radius=17, fill=(0, 85, 30, 230), outline=(0, 174, 66, 255), width=2)
    # Left and right star accents
    draw_star(draw, bx + 18, by + 17, r=5, fill=(0, 215, 85, 255))
    draw_star(draw, bx + bw + 42, by + 17, r=5, fill=(0, 215, 85, 255))
    draw.text((bx + 30, by + 8), badge_text, fill=(240, 255, 244, 255), font=font_badge)

    # 2. Main Title
    font_title = get_font(FONT_BOLD, 50)
    title_text = "Bambu Swatch & Calibration Studio"
    bbox_t = draw.textbbox((0, 0), title_text, font=font_title)
    tw = bbox_t[2] - bbox_t[0]
    tx = (W - tw) // 2
    ty = 88
    draw.text((tx + 2, ty + 2), title_text, fill=(0, 0, 0, 200), font=font_title)
    draw.text((tx, ty), title_text, fill=(255, 255, 255, 255), font=font_title)

    # 3. Subtitle
    font_sub = get_font(FONT_REGULAR, 20)
    sub_text = "Interactive 3D Customizer  |  5-in-1 Test Cards (150% Scale)  |  1-Click Bambu 3MF Export"
    bbox_s = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = bbox_s[2] - bbox_s[0]
    draw.text(((W - sw) // 2, 154), sub_text, fill=(160, 175, 190, 255), font=font_sub)

    # --- CENTER: BROWSER WINDOW MOCKUP ---
    screenshot = Image.open(INPUT_SCREENSHOT).convert("RGBA")
    win_w = 1320
    content_h = int(win_w / (1024 / 652)) # 840
    title_bar_h = 38
    win_h = content_h + title_bar_h # 878
    win_x = (W - win_w) // 2
    win_y = 196
    draw_window_mockup(img, win_x, win_y, win_w, win_h, screenshot)

    # Floating Callout: Slicer 3MF Export highlight
    font_chip = get_font(FONT_BOLD, 15)
    chip_text = "1-Click Slicer 3MF Export"
    bbox_c = draw.textbbox((0, 0), chip_text, font=font_chip)
    cw = bbox_c[2] - bbox_c[0]
    cx = win_x + win_w - cw - 70
    cy = win_y + 55
    # Glowing pill
    draw.rounded_rectangle([cx - 30, cy - 8, cx + cw + 16, cy + 30], radius=16, fill=(0, 174, 66, 245), outline=(255, 255, 255, 220), width=2)
    draw_bolt(draw, cx - 14, cy + 11, h=15, fill=(255, 255, 255, 255))
    draw.text((cx + 2, cy), chip_text, fill=(255, 255, 255, 255), font=font_chip)

    # Floating Callout 2: On empty grid on the left
    chip2_text = "Parametric 3D Customizer"
    bbox_c2 = draw.textbbox((0, 0), chip2_text, font=font_chip)
    cw2 = bbox_c2[2] - bbox_c2[0]
    c2x = win_x + 50
    c2y = win_y + 90
    draw.rounded_rectangle([c2x - 30, c2y - 8, c2x + cw2 + 16, c2y + 30], radius=16, fill=(20, 26, 34, 235), outline=(0, 215, 85, 240), width=2)
    draw_star(draw, c2x - 14, c2y + 11, r=6, fill=(0, 215, 85, 255))
    draw.text((c2x + 2, c2y), chip2_text, fill=(240, 250, 245, 255), font=font_chip)

    # --- BOTTOM FEATURE BAR ---
    features = [
        ("01", "Translucency (0.2~1.0mm)"),
        ("02", "Dual-Track Bridging"),
        ("03", "Ironing Quality Matrix"),
        ("04", "Vertical Fuzzy Skin"),
        ("05", "Precision Tolerance")
    ]
    bar_y = 1092
    num_items = len(features)
    card_w = 265
    gap = 18
    total_w = num_items * card_w + (num_items - 1) * gap
    start_x = (W - total_w) // 2

    font_feat_num = get_font(FONT_BOLD, 13)
    font_feat_title = get_font(FONT_BOLD, 14)

    for i, (num, name) in enumerate(features):
        fx = start_x + i * (card_w + gap)
        fy = bar_y
        draw.rounded_rectangle([fx, fy, fx + card_w, fy + 52], radius=12, fill=(20, 25, 32, 240), outline=(48, 54, 61, 240), width=1)
        # Left green accent pill
        draw.rounded_rectangle([fx + 10, fy + 12, fx + 36, fy + 40], radius=6, fill=(0, 174, 66, 255))
        draw.text((fx + 14, fy + 19), num, fill=(255, 255, 255, 255), font=font_feat_num)
        # Title
        draw.text((fx + 44, fy + 17), name, fill=(230, 237, 243, 255), font=font_feat_title)

    # Footer
    font_foot = get_font(FONT_REGULAR, 14)
    foot_text = "Designed for Bambu Studio & OrcaSlicer  |  128 x 75 mm Standard Cards  |  Like & Boost on MakerWorld"
    bbox_f = draw.textbbox((0, 0), foot_text, font=font_foot)
    fw = bbox_f[2] - bbox_f[0]
    draw.text(((W - fw)//2, 1162), foot_text, fill=(139, 148, 158, 255), font=font_foot)

    # Save PNG and JPG
    img.convert("RGB").save(OUT_4_3_PNG)
    img.convert("RGB").save(OUT_4_3_JPG, quality=95)
    print("4:3 cover saved to:", OUT_4_3_PNG)

def create_3_4_cover():
    W, H = 1200, 1600
    img = Image.new("RGBA", (W, H), (10, 13, 17, 255))
    draw = ImageDraw.Draw(img)

    # Soft ambient radial glow
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([W//2 - 450, 360, W//2 + 450, 1160], fill=(0, 174, 66, 40))
    glow_draw.ellipse([W//2 - 260, 440, W//2 + 260, 1020], fill=(0, 174, 66, 55))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(90))
    img.paste(glow_layer, (0, 0), glow_layer)

    # Technical grid lines
    for x in range(0, W, 80):
        draw.line([(x, 0), (x, H)], fill=(22, 27, 34, 110), width=1)
    for y in range(0, H, 80):
        draw.line([(0, y), (W, y)], fill=(22, 27, 34, 110), width=1)

    # --- TOP HEADER SECTION ---
    # 1. Badge Pill
    badge_text = "OFFICIAL PARAMETRIC WEB CUSTOMIZER"
    font_badge = get_font(FONT_BOLD, 15)
    bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    bw = bbox[2] - bbox[0]
    bx = (W - bw - 60) // 2
    by = 48
    draw.rounded_rectangle([bx, by, bx + bw + 60, by + 34], radius=17, fill=(0, 85, 30, 230), outline=(0, 174, 66, 255), width=2)
    draw_star(draw, bx + 18, by + 17, r=5, fill=(0, 215, 85, 255))
    draw_star(draw, bx + bw + 42, by + 17, r=5, fill=(0, 215, 85, 255))
    draw.text((bx + 30, by + 7), badge_text, fill=(240, 255, 244, 255), font=font_badge)

    # 2. Main Title (Two lines for portrait impact)
    font_title = get_font(FONT_BOLD, 54)
    line1 = "BAMBU SWATCH &"
    line2 = "CALIBRATION STUDIO"
    
    bbox1 = draw.textbbox((0, 0), line1, font=font_title)
    bbox2 = draw.textbbox((0, 0), line2, font=font_title)
    w1 = bbox1[2] - bbox1[0]
    w2 = bbox2[2] - bbox2[0]
    
    draw.text(((W - w1)//2 + 2, 104), line1, fill=(0, 0, 0, 200), font=font_title)
    draw.text(((W - w1)//2, 102), line1, fill=(255, 255, 255, 255), font=font_title)
    
    draw.text(((W - w2)//2 + 2, 166), line2, fill=(0, 0, 0, 200), font=font_title)
    draw.text(((W - w2)//2, 164), line2, fill=(0, 215, 85, 255), font=font_title)

    # 3. Subtitle
    font_sub = get_font(FONT_REGULAR, 21)
    sub_text = "5-in-1 Parametric Test Cards  |  Direct 3MF Export"
    bbox_s = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = bbox_s[2] - bbox_s[0]
    draw.text(((W - sw)//2, 232), sub_text, fill=(160, 175, 190, 255), font=font_sub)

    # Feature tags strip
    tags = ["[ 1-Click 3MF Export ]", "[ Slicer Pre-Configured ]", "[ 128x75mm Standard ]", "[ 100% Free ]"]
    font_tag = get_font(FONT_BOLD, 13)
    tag_w = 230
    tag_gap = 12
    total_tags_w = len(tags) * tag_w + (len(tags) - 1) * tag_gap
    tag_x = (W - total_tags_w) // 2
    for i, tag in enumerate(tags):
        tx = tag_x + i * (tag_w + tag_gap)
        ty = 274
        draw.rounded_rectangle([tx, ty, tx + tag_w, ty + 30], radius=15, fill=(20, 25, 32, 240), outline=(48, 54, 61, 255), width=1)
        tb = draw.textbbox((0, 0), tag, font=font_tag)
        tw = tb[2] - tb[0]
        draw.text((tx + (tag_w - tw)//2, ty + 6), tag, fill=(210, 225, 240, 255), font=font_tag)

    # --- CENTER: BROWSER WINDOW MOCKUP ---
    screenshot = Image.open(INPUT_SCREENSHOT).convert("RGBA")
    win_w = 1040
    content_h = int(win_w / (1024 / 652)) # 662
    title_bar_h = 38
    win_h = content_h + title_bar_h # 700
    win_x = (W - win_w) // 2
    win_y = 328
    draw_window_mockup(img, win_x, win_y, win_w, win_h, screenshot)

    # Floating Callout Badges on the empty dark grid of the 3D viewport (left side)
    font_chip = get_font(FONT_BOLD, 14)
    
    # Badge 1: Live 3D Web Customizer
    b1_text = "Live 3D Web Customizer"
    b1_w = draw.textbbox((0, 0), b1_text, font=font_chip)[2] - draw.textbbox((0, 0), b1_text, font=font_chip)[0]
    b1_x = win_x + 40
    b1_y = win_y + 80
    draw.rounded_rectangle([b1_x - 26, b1_y - 7, b1_x + b1_w + 14, b1_y + 27], radius=15, fill=(0, 85, 30, 240), outline=(0, 215, 85, 255), width=2)
    draw_star(draw, b1_x - 12, b1_y + 10, r=5, fill=(0, 215, 85, 255))
    draw.text((b1_x + 4, b1_y), b1_text, fill=(255, 255, 255, 255), font=font_chip)

    # Badge 2: 1-Click 3MF Export
    b2_text = "1-Click Bambu 3MF Export"
    b2_w = draw.textbbox((0, 0), b2_text, font=font_chip)[2] - draw.textbbox((0, 0), b2_text, font=font_chip)[0]
    b2_x = win_x + 40
    b2_y = win_y + 124
    draw.rounded_rectangle([b2_x - 26, b2_y - 7, b2_x + b2_w + 14, b2_y + 27], radius=15, fill=(20, 26, 34, 240), outline=(255, 255, 255, 200), width=2)
    draw_bolt(draw, b2_x - 12, b2_y + 10, h=13, fill=(255, 255, 255, 255))
    draw.text((b2_x + 4, b2_y), b2_text, fill=(255, 255, 255, 255), font=font_chip)

    # --- BOTTOM SECTION: 5-IN-1 CARDS SHOWCASE GRID ---
    grid_y = 1062
    font_section = get_font(FONT_BOLD, 22)
    sec_title = "INCLUDED 5-IN-1 CALIBRATION SUITE"
    bbox_sec = draw.textbbox((0, 0), sec_title, font=font_section)
    draw.text(((W - (bbox_sec[2] - bbox_sec[0]))//2, grid_y), sec_title, fill=(255, 255, 255, 255), font=font_section)

    card_items = [
        ("01", "Translucent Swatch", "5-step 0.2~1.0mm optical thickness"),
        ("02", "Dual-Track Bridge", "15~55mm span droop & speed testing"),
        ("03", "Ironing Matrix", "4x5 flow vs line spacing top finish"),
        ("04", "Vertical Fuzzy Skin", "4x4 tactile thickness & point distance"),
        ("05", "Precision Tolerance", "4 pin diameters x 5 clearance levels")
    ]

    item_w = 485
    item_h = 70
    left_x = (W - (item_w * 2 + 25)) // 2
    right_x = left_x + item_w + 25

    font_item_num = get_font(FONT_BOLD, 16)
    font_item_title = get_font(FONT_BOLD, 15)
    font_item_desc = get_font(FONT_REGULAR, 13)

    positions = [
        (left_x, grid_y + 40),
        (right_x, grid_y + 40),
        (left_x, grid_y + 122),
        (right_x, grid_y + 122),
        ((W - item_w)//2, grid_y + 204)
    ]

    for i, (num, name, desc) in enumerate(card_items):
        cx, cy = positions[i]
        draw.rounded_rectangle([cx, cy, cx + item_w, cy + item_h], radius=14, fill=(20, 25, 32, 240), outline=(48, 54, 61, 240), width=1)
        # Green icon block
        draw.rounded_rectangle([cx + 12, cy + 12, cx + 50, cy + item_h - 12], radius=8, fill=(0, 174, 66, 255))
        draw.text((cx + 18, cy + 24), num, fill=(255, 255, 255, 255), font=font_item_num)
        # Texts
        draw.text((cx + 62, cy + 13), name, fill=(240, 246, 252, 255), font=font_item_title)
        draw.text((cx + 62, cy + 38), desc, fill=(139, 148, 158, 255), font=font_item_desc)

    # Bottom footer & call to action
    bot_y = 1445
    draw.line([(80, bot_y), (W - 80, bot_y)], fill=(48, 54, 61, 150), width=1)
    
    font_bot_strong = get_font(FONT_BOLD, 16)
    font_bot_sub = get_font(FONT_REGULAR, 15)
    
    b_text1 = "Try Online: ramepagedoge.github.io/3D-printing-swatch-calibration-studio"
    b_text2 = "Like & Boost this model on MakerWorld to support open-source 3D tools!"
    
    b1_w = draw.textbbox((0, 0), b_text1, font=font_bot_strong)[2] - draw.textbbox((0, 0), b_text1, font=font_bot_strong)[0]
    b2_w = draw.textbbox((0, 0), b_text2, font=font_bot_sub)[2] - draw.textbbox((0, 0), b_text2, font=font_bot_sub)[0]
    
    draw.text(((W - b1_w)//2, bot_y + 20), b_text1, fill=(0, 215, 85, 255), font=font_bot_strong)
    draw.text(((W - b2_w)//2, bot_y + 54), b_text2, fill=(160, 175, 190, 255), font=font_bot_sub)

    # Save PNG and JPG
    img.convert("RGB").save(OUT_3_4_PNG)
    img.convert("RGB").save(OUT_3_4_JPG, quality=95)
    print("3:4 cover saved to:", OUT_3_4_PNG)

if __name__ == "__main__":
    create_4_3_cover()
    create_3_4_cover()
