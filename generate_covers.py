import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths
INPUT_SCREENSHOT = "/Users/chiawei/.gemini/antigravity/brain/a7182545-d02e-4039-8bfa-0397aad9c43d/washi_studio_screenshot.png"
ARTIFACTS_DIR = "/Users/chiawei/.gemini/antigravity/brain/a7182545-d02e-4039-8bfa-0397aad9c43d"

OUT_4_3_PNG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_4_3.png")
OUT_4_3_JPG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_4_3.jpg")
OUT_3_4_PNG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_3_4.png")
OUT_3_4_JPG = os.path.join(ARTIFACTS_DIR, "makerworld_cover_webstudio_3_4.jpg")

# Typography (Japanese Minimalist Geometric Sans)
AVENIR_TTC = "/System/Library/Fonts/Avenir Next.ttc"
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
ARIAL_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"

# Japanese Washi & Bamboo Matcha Palette
WASHI_BG = (247, 245, 240, 255)        # #F7F5F0
WASHI_SURFACE = (250, 248, 245, 255)   # #FAF8F5
WASHI_CARD = (255, 255, 255, 255)      # #FFFFFF
WASHI_PILL = (239, 236, 230, 255)      # #EFECE6
WASHI_GRID = (229, 223, 211, 165)      # #E5DFD3
WASHI_BORDER = (220, 214, 204, 255)    # #DCD6CC
FRAME_BORDER = (213, 207, 196, 255)    # #D5CFC4
SUMI_INK = (44, 42, 41, 255)           # #2C2A29
SUMI_SUBTLE = (74, 70, 66, 255)        # #4A4642
RIKYU_GREY = (110, 105, 96, 255)       # #6E6960
MUTED_STONE = (120, 115, 106, 255)     # #78736A
MATCHA_GREEN = (61, 107, 82, 255)      # #3D6B52
MATCHA_DARK = (47, 86, 64, 255)        # #2F5640
WARM_IVORY = (250, 248, 245, 255)      # #FAF8F5
WARM_GOLD = (238, 218, 168, 255)       # #EEDAA8


def get_font(weight, size):
    """Load geometric Avenir Next weights with clean fallback."""
    avenir_indices = {"bold": 0, "demibold": 2, "medium": 5, "regular": 7}
    try:
        if os.path.exists(AVENIR_TTC):
            return ImageFont.truetype(AVENIR_TTC, size, index=avenir_indices.get(weight, 7))
    except Exception:
        pass
    fallback = ARIAL_BOLD if weight in ("bold", "demibold") else ARIAL_REGULAR
    try:
        return ImageFont.truetype(fallback, size)
    except Exception:
        return ImageFont.load_default()


def draw_centered_text(draw, cx, y, text, font, fill):
    """Draw horizontally centered text and return its width and height."""
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((cx - w // 2, y - bbox[1]), text, fill=fill, font=font)
    return w, h


def draw_star(draw, cx, cy, r=6, fill=WARM_GOLD):
    """Draw a clean 5-pointed vector star."""
    points = []
    for i in range(10):
        radius = r if i % 2 == 0 else r * 0.44
        angle = i * math.pi / 5 - math.pi / 2
        points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    draw.polygon(points, fill=fill)


def draw_bolt(draw, cx, cy, h=14, fill=WARM_IVORY):
    """Draw a crisp lightning bolt icon."""
    w = h * 0.55
    pts = [
        (cx + w * 0.1, cy - h * 0.5),
        (cx - w * 0.5, cy + h * 0.05),
        (cx - w * 0.05, cy + h * 0.05),
        (cx - w * 0.2, cy + h * 0.5),
        (cx + w * 0.5, cy - h * 0.05),
        (cx + w * 0.05, cy - h * 0.05),
    ]
    draw.polygon(pts, fill=fill)


def create_washi_canvas(w, h, glow_cy):
    """Create warm Washi paper background with soft bamboo-sage wash and drafting grid."""
    img = Image.new("RGBA", (w, h), WASHI_BG)

    glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([w // 2 - 540, glow_cy - 360, w // 2 + 540, glow_cy + 360], fill=(61, 107, 82, 20))
    glow_draw.ellipse([w // 2 - 320, glow_cy - 220, w // 2 + 320, glow_cy + 220], fill=(61, 107, 82, 24))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(100))
    img = Image.alpha_composite(img, glow_layer)

    grid_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, w, 80):
        grid_draw.line([(x, 0), (x, h)], fill=WASHI_GRID, width=1)
    for y in range(0, h, 80):
        grid_draw.line([(0, y), (w, y)], fill=WASHI_GRID, width=1)
    return Image.alpha_composite(img, grid_layer)


def draw_top_badge(draw, w, y, text, font_size=14, h=34):
    """Draw the centered Bamboo Matcha pill badge with star accents."""
    font = get_font("bold", font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x = 64
    pw = tw + pad_x
    bx = (w - pw) // 2

    draw.rounded_rectangle([bx, y, bx + pw, y + h], radius=h // 2, fill=MATCHA_GREEN, outline=MATCHA_DARK, width=2)
    draw_star(draw, bx + 18, y + h // 2, r=5, fill=WARM_GOLD)
    draw_star(draw, bx + pw - 18, y + h // 2, r=5, fill=WARM_GOLD)
    draw.text((bx + pad_x // 2, y + (h - th) // 2 - bbox[1]), text, fill=WARM_IVORY, font=font)


def draw_callout_pill(draw, x, y, text, icon_kind="star", primary=True, font_size=14):
    """Draw a Japanese minimalist callout badge and return its bounding width."""
    font = get_font("demibold", font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pill_h = 32
    left_icon_space = 30
    right_pad = 16
    pill_w = left_icon_space + tw + right_pad

    fill = MATCHA_GREEN if primary else WASHI_SURFACE
    outline = WASHI_SURFACE if primary else MATCHA_GREEN
    outline_w = 2 if primary else 2
    text_fill = WARM_IVORY if primary else SUMI_INK
    icon_fill = WARM_GOLD if primary else MATCHA_GREEN

    # Subtle elevation border shadow
    draw.rounded_rectangle([x + 1, y + 3, x + pill_w + 1, y + pill_h + 3], radius=pill_h // 2, fill=(44, 42, 41, 28))
    draw.rounded_rectangle([x, y, x + pill_w, y + pill_h], radius=pill_h // 2, fill=fill, outline=outline, width=outline_w)

    icx = x + 17
    icy = y + pill_h // 2
    if icon_kind == "bolt":
        draw_bolt(draw, icx, icy, h=13, fill=WARM_IVORY if primary else MATCHA_GREEN)
    else:
        draw_star(draw, icx, icy, r=5, fill=icon_fill)

    draw.text((x + left_icon_space, y + (pill_h - th) // 2 - bbox[1]), text, fill=text_fill, font=font)
    return pill_w


def draw_window_mockup(base_img, x, y, width, screenshot, url_text="ramepagedoge.github.io/3D-printing-swatch-calibration-studio"):
    """Draw a warm Washi macOS browser frame preserving exact screenshot aspect ratio."""
    title_bar_height = 38
    content_w = width - 4
    content_h = round(content_w * screenshot.height / screenshot.width)
    height = title_bar_height + content_h + 2

    # 1. Soft charcoal & sage elevation shadow
    shadow_pad = 36
    shadow_img = Image.new("RGBA", (width + shadow_pad * 2, height + shadow_pad * 2), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    shadow_draw.rounded_rectangle(
        [shadow_pad - 6, shadow_pad - 4, width + shadow_pad + 6, height + shadow_pad + 8],
        radius=22,
        fill=(61, 107, 82, 22),
    )
    shadow_draw.rounded_rectangle(
        [shadow_pad, shadow_pad + 6, width + shadow_pad, height + shadow_pad + 10],
        radius=18,
        fill=(44, 42, 41, 64),
    )
    shadow_blur = shadow_img.filter(ImageFilter.GaussianBlur(20))
    base_img.paste(shadow_blur, (x - shadow_pad, y - shadow_pad), shadow_blur)

    # 2. Warm Washi window container
    win_img = Image.new("RGBA", (width, height), WASHI_SURFACE)
    win_draw = ImageDraw.Draw(win_img)

    # Title bar
    win_draw.rectangle([0, 0, width, title_bar_height], fill=WASHI_SURFACE)
    win_draw.line([(0, title_bar_height), (width, title_bar_height)], fill=WASHI_BORDER, width=1)

    # Softened Mac traffic light dots
    btn_y = title_bar_height // 2
    win_draw.ellipse([18, btn_y - 6, 30, btn_y + 6], fill=(230, 114, 102, 255))
    win_draw.ellipse([38, btn_y - 6, 50, btn_y + 6], fill=(232, 186, 86, 255))
    win_draw.ellipse([58, btn_y - 6, 70, btn_y + 6], fill=(110, 174, 126, 255))

    # URL / Status pill
    pill_w = min(540, width - 220)
    pill_h = 24
    pill_x = (width - pill_w) // 2
    pill_y = (title_bar_height - pill_h) // 2
    win_draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=12,
        fill=WASHI_PILL,
        outline=WASHI_BORDER,
        width=1,
    )

    dot_x = pill_x + 16
    dot_y = pill_y + pill_h // 2
    win_draw.ellipse([dot_x - 6, dot_y - 6, dot_x + 6, dot_y + 6], outline=(61, 107, 82, 85), width=1)
    win_draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=MATCHA_GREEN)

    font_url = get_font("medium", 12)
    display_url = "https://" + url_text
    ub = win_draw.textbbox((0, 0), display_url, font=font_url)
    win_draw.text((pill_x + 30, pill_y + (pill_h - (ub[3] - ub[1])) // 2 - ub[1]), display_url, fill=SUMI_SUBTLE, font=font_url)

    # 3. Aspect-ratio-exact studio screenshot
    sc_resized = screenshot.resize((content_w, content_h), Image.Resampling.LANCZOS)
    win_img.paste(sc_resized, (2, title_bar_height))

    # Crisp frame border drawn inside clipped bounds
    win_draw.rounded_rectangle([1, 1, width - 2, height - 2], radius=16, outline=FRAME_BORDER, width=2)

    mask = Image.new("L", (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, width, height], radius=16, fill=255)
    base_img.paste(win_img, (x, y), mask)
    return width, height, title_bar_height


def create_4_3_cover(screenshot):
    W, H = 1600, 1200
    img = create_washi_canvas(W, H, glow_cy=600)
    draw = ImageDraw.Draw(img)

    # Top header
    draw_top_badge(draw, W, 34, "OFFICIAL PARAMETRIC WEB CUSTOMIZER  |  100% FREE & OPEN SOURCE", font_size=14, h=32)

    font_title = get_font("bold", 48)
    draw_centered_text(draw, W // 2, 78, "Bambu Swatch & Calibration Studio", font_title, SUMI_INK)

    font_sub = get_font("medium", 19)
    draw_centered_text(
        draw,
        W // 2,
        138,
        "Interactive 3D Customizer  |  5-in-1 Test Cards (150% Scale)  |  1-Click Bambu 3MF Export",
        font_sub,
        RIKYU_GREY,
    )

    # Browser window mockup
    win_w = 1320
    win_x = (W - win_w) // 2
    win_y = 180
    _, _, title_bar_h = draw_window_mockup(img, win_x, win_y, win_w, screenshot)

    # Floating callouts placed cleanly inside open sky area below Top/Iso/Front/Side buttons
    call_y = win_y + title_bar_h + 118
    p1_w = draw_callout_pill(draw, win_x + 28, call_y, "Parametric 3D Customizer", icon_kind="star", primary=True, font_size=14)
    draw_callout_pill(draw, win_x + 28 + p1_w + 14, call_y, "1-Click Slicer 3MF Export", icon_kind="bolt", primary=False, font_size=14)

    # Bottom 5-in-1 Feature Bar
    features = [
        ("01", "Translucency (0.2~1.0mm)"),
        ("02", "Dual-Track Bridging"),
        ("03", "Ironing Quality Matrix"),
        ("04", "Vertical Fuzzy Skin"),
        ("05", "Precision Tolerance"),
    ]
    bar_y = 1082
    card_w = 266
    card_h = 52
    gap = 16
    total_w = len(features) * card_w + (len(features) - 1) * gap
    start_x = (W - total_w) // 2

    font_num = get_font("bold", 13)
    font_label = get_font("demibold", 14)

    for i, (num, name) in enumerate(features):
        fx = start_x + i * (card_w + gap)
        fy = bar_y
        draw.rounded_rectangle([fx, fy, fx + card_w, fy + card_h], radius=10, fill=WASHI_CARD, outline=WASHI_BORDER, width=1)
        draw.rounded_rectangle([fx + 10, fy + 11, fx + 38, fy + card_h - 11], radius=6, fill=MATCHA_GREEN)
        nb = draw.textbbox((0, 0), num, font=font_num)
        draw.text((fx + 24 - (nb[2] - nb[0]) // 2, fy + (card_h - (nb[3] - nb[1])) // 2 - nb[1]), num, fill=WARM_IVORY, font=font_num)
        lb = draw.textbbox((0, 0), name, font=font_label)
        draw.text((fx + 48, fy + (card_h - (lb[3] - lb[1])) // 2 - lb[1]), name, fill=SUMI_INK, font=font_label)

    # Footer
    font_foot = get_font("regular", 14)
    draw_centered_text(
        draw,
        W // 2,
        1156,
        "Designed for Bambu Studio & OrcaSlicer  |  128 × 75 mm Standard Cards  |  Like & Boost on MakerWorld",
        font_foot,
        MUTED_STONE,
    )

    img.convert("RGB").save(OUT_4_3_PNG)
    img.convert("RGB").save(OUT_4_3_JPG, quality=95)
    print("4:3 cover saved to:", OUT_4_3_PNG)


def create_3_4_cover(screenshot):
    W, H = 1200, 1600
    img = create_washi_canvas(W, H, glow_cy=700)
    draw = ImageDraw.Draw(img)

    # Top header
    draw_top_badge(draw, W, 46, "OFFICIAL PARAMETRIC WEB CUSTOMIZER", font_size=15, h=34)

    font_title = get_font("bold", 52)
    draw_centered_text(draw, W // 2, 98, "BAMBU SWATCH &", font_title, SUMI_INK)
    draw_centered_text(draw, W // 2, 158, "CALIBRATION STUDIO", font_title, MATCHA_GREEN)

    font_sub = get_font("medium", 21)
    draw_centered_text(draw, W // 2, 228, "5-in-1 Parametric Test Cards  |  Direct 3MF Export", font_sub, RIKYU_GREY)

    # Feature tags strip
    tags = ["1-Click 3MF Export", "Slicer Pre-Configured", "128×75mm Standard", "100% Free & Open"]
    font_tag = get_font("demibold", 13)
    tag_w = 232
    tag_gap = 12
    total_tags_w = len(tags) * tag_w + (len(tags) - 1) * tag_gap
    tag_x = (W - total_tags_w) // 2
    ty = 272
    for i, tag in enumerate(tags):
        tx = tag_x + i * (tag_w + tag_gap)
        draw.rounded_rectangle([tx, ty, tx + tag_w, ty + 30], radius=15, fill=WASHI_CARD, outline=WASHI_BORDER, width=1)
        tb = draw.textbbox((0, 0), tag, font=font_tag)
        draw.text((tx + (tag_w - (tb[2] - tb[0])) // 2, ty + (30 - (tb[3] - tb[1])) // 2 - tb[1]), tag, fill=SUMI_SUBTLE, font=font_tag)

    # Browser window mockup
    win_w = 1040
    win_x = (W - win_w) // 2
    win_y = 324
    _, _, title_bar_h = draw_window_mockup(img, win_x, win_y, win_w, screenshot)

    # Floating callouts placed cleanly inside open viewport sky area above the 256x256 bed
    call_y = win_y + title_bar_h + 92
    p1_w = draw_callout_pill(draw, win_x + 22, call_y, "Live 3D Web Customizer", icon_kind="star", primary=True, font_size=13)
    draw_callout_pill(draw, win_x + 22 + p1_w + 12, call_y, "1-Click Bambu 3MF Export", icon_kind="bolt", primary=False, font_size=13)

    # Bottom 5-in-1 Cards Showcase Grid
    grid_y = 1060
    font_section = get_font("bold", 21)
    draw_centered_text(draw, W // 2, grid_y, "INCLUDED 5-IN-1 CALIBRATION SUITE", font_section, SUMI_INK)

    card_items = [
        ("01", "Translucent Swatch", "5-step 0.2~1.0mm optical thickness"),
        ("02", "Dual-Track Bridge", "10~50mm span droop & speed testing"),
        ("03", "Ironing Matrix", "4×5 flow vs line spacing top finish"),
        ("04", "Vertical Fuzzy Skin", "4×4 tactile thickness & noise types"),
        ("05", "Precision Tolerance", "4 pin diameters × 5 through-hole clearances"),
    ]

    item_w = 485
    item_h = 72
    left_x = (W - (item_w * 2 + 25)) // 2
    right_x = left_x + item_w + 25

    font_item_num = get_font("bold", 16)
    font_item_title = get_font("demibold", 15)
    font_item_desc = get_font("regular", 13)

    positions = [
        (left_x, grid_y + 42),
        (right_x, grid_y + 42),
        (left_x, grid_y + 126),
        (right_x, grid_y + 126),
        ((W - item_w) // 2, grid_y + 210),
    ]

    for i, (num, name, desc) in enumerate(card_items):
        cx, cy = positions[i]
        draw.rounded_rectangle([cx, cy, cx + item_w, cy + item_h], radius=12, fill=WASHI_CARD, outline=WASHI_BORDER, width=1)
        draw.rounded_rectangle([cx + 12, cy + 12, cx + 52, cy + item_h - 12], radius=8, fill=MATCHA_GREEN)
        nb = draw.textbbox((0, 0), num, font=font_item_num)
        draw.text((cx + 32 - (nb[2] - nb[0]) // 2, cy + (item_h - (nb[3] - nb[1])) // 2 - nb[1]), num, fill=WARM_IVORY, font=font_item_num)
        draw.text((cx + 66, cy + 14), name, fill=SUMI_INK, font=font_item_title)
        draw.text((cx + 66, cy + 40), desc, fill=MUTED_STONE, font=font_item_desc)

    # Bottom footer & CTA
    bot_y = 1448
    draw.line([(80, bot_y), (W - 80, bot_y)], fill=WASHI_BORDER, width=1)

    font_bot_strong = get_font("demibold", 16)
    font_bot_sub = get_font("regular", 15)

    draw_centered_text(
        draw,
        W // 2,
        bot_y + 22,
        "Try Online: ramepagedoge.github.io/3D-printing-swatch-calibration-studio",
        font_bot_strong,
        MATCHA_GREEN,
    )
    draw_centered_text(
        draw,
        W // 2,
        bot_y + 56,
        "Like & Boost this model on MakerWorld to support open-source 3D tools!",
        font_bot_sub,
        RIKYU_GREY,
    )

    img.convert("RGB").save(OUT_3_4_PNG)
    img.convert("RGB").save(OUT_3_4_JPG, quality=95)
    print("3:4 cover saved to:", OUT_3_4_PNG)


if __name__ == "__main__":
    screenshot = Image.open(INPUT_SCREENSHOT).convert("RGBA")
    create_4_3_cover(screenshot)
    create_3_4_cover(screenshot)
