import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Brush, Evaluator, SUBTRACTION, ADDITION } from 'three-bvh-csg';
import { healMesh } from './meshHealer.js';

let cachedFont = null;

export async function loadDefaultFont() {
  if (cachedFont) return cachedFont;
  const res = await fetch('/fonts/helvetiker_bold.typeface.json');
  const json = await res.json();
  const loader = new FontLoader();
  cachedFont = loader.parse(json);
  return cachedFont;
}

/**
 * Safely merges multiple geometries by normalizing attributes to position-only to avoid attribute mismatch
 */
export function safeMergeGeometries(geos) {
  if (!geos || geos.length === 0) return null;
  const normalized = geos.filter(Boolean).map(g => {
    const nonIndexed = g.toNonIndexed();
    const clean = new THREE.BufferGeometry();
    clean.setAttribute('position', nonIndexed.attributes.position);
    return clean;
  });
  const merged = BufferGeometryUtils.mergeGeometries(normalized, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

/**
 * Creates standard 85.0 x 50.0 mm rounded rectangle card shape
 */
export function createStandardCardShape(w = 85.0, d = 50.0, r = 3.0, includeHole = false, holePos = { x: -34.5, y: 16.0 }, holeR = 2.25) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + d - r);
  shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  shape.lineTo(x + r, y + d);
  shape.quadraticCurveTo(x, y + d, x, y + d - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  if (includeHole) {
    const holePath = new THREE.Path();
    holePath.absarc(holePos.x, holePos.y, holeR, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }

  return shape;
}

/**
 * Creates the standard base card brush with optional Ø4.5mm hanging hole.
 * Uses CSG cylinder subtraction for hanging hole to avoid ear-clipping sliver triangles.
 */
export function createBaseCardBrush(h = 2.4, includeHole = true, holePos = { x: -34.5, y: 16.0 }, holeR = 2.25) {
  const shape = createStandardCardShape(85.0, 50.0, 3.0, false);
  const baseExtrude = new THREE.ExtrudeGeometry(shape, {
    depth: h,
    bevelEnabled: false,
    curveSegments: 24
  });

  let cardBrush = new Brush(baseExtrude);
  cardBrush.updateMatrixWorld();

  if (includeHole) {
    const holeGeo = new THREE.CylinderGeometry(holeR, holeR, h * 2, 32);
    holeGeo.rotateX(Math.PI / 2);
    holeGeo.translate(holePos.x, holePos.y, h / 2);
    const holeBrush = new Brush(holeGeo);
    holeBrush.updateMatrixWorld();
    const evaluator = new Evaluator();
    evaluator.useGroups = false;
    evaluator.useCDTClipping = true;
    cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);
  }

  return cardBrush;
}

/**
 * 1. Pro Swatch Card with Rich Online-inspired Features
 * 5-step translucency with relief icons, line width ribs, hole gauge, optical steps, specs badge
 */
export function generateSwatchCard(params, font) {
  const h = 2.4;
  let cardBrush = createBaseCardBrush(h, params.includeHole !== false);

  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  evaluator.useCDTClipping = true;

  const winGeos = [];
  const addGeos = [];
  const holeGeos = [];
  const winLabelGeos = [];
  const badgeGeos = [];
  const gaugeGeos = [];

  // 1. Top Row: 5 Translucent Stepped Windows (0.2, 0.4, 0.6, 0.8, 1.0mm)
  const steps = params.translucentSteps || [0.2, 0.4, 0.6, 0.8, 1.0];
  const winW = 8.5;
  const winD = 12.0;
  const startX = -13.5;
  const spacingX = 10.8;
  const winY = 15.5;

  const debossDepth = 0.45;
  const textZ = h - debossDepth;
  const textDepth = 0.8;

  steps.forEach((t, i) => {
    const cutoutH = Math.max(0.2, h - t);
    const winGeo = new THREE.BoxGeometry(winW, winD, cutoutH * 2);
    winGeo.translate(startX + i * spacingX, winY, t + cutoutH);
    winGeos.push(winGeo.toNonIndexed());

    // Relief circle inside window to test lithophane/backlight contrast
    const reliefR = 2.2;
    const reliefH = 0.2;
    const relGeo = new THREE.CylinderGeometry(reliefR, reliefR, reliefH, 16);
    relGeo.rotateX(Math.PI / 2);
    relGeo.translate(startX + i * spacingX, winY, t + reliefH / 2);
    addGeos.push(relGeo.toNonIndexed());

    // Engraved thickness label underneath window (0.45mm debossed, enlarged to 2.2mm)
    const lbl = new TextGeometry(`${Number(t).toFixed(1)}`, {
      font: font, size: 2.2, depth: textDepth, curveSegments: 1, bevelEnabled: false
    });
    lbl.computeBoundingBox();
    const lw = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(startX + i * spacingX - lw / 2, winY - 8.6, textZ);
    winLabelGeos.push(lbl.toNonIndexed());
  });

  // 2. Left Column: Specs Badge (Engraved 0.45mm, maximized font sizes)
  const brand = (params.brand || 'BAMBU LAB').toUpperCase();
  const material = (params.material || 'PLA BASIC').toUpperCase();
  const tempStr = `${params.nozzleTemp || 220}C / ${params.bedTemp || 55}C`;
  const speedStr = `${params.bridgeSpeed || 50}mm/s | ${params.flowRatio || 0.98}`;

  const textLines = [
    { text: brand, size: 3.2, x: -39.0, y: 5.0 },
    { text: material, size: 2.8, x: -39.0, y: 0.8 },
    { text: tempStr, size: 2.2, x: -39.0, y: -4.0 },
    { text: speedStr, size: 2.2, x: -39.0, y: -8.5 }
  ];
  textLines.forEach(l => {
    const tGeo = new TextGeometry(l.text, { font: font, size: l.size, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    tGeo.translate(l.x, l.y, textZ);
    badgeGeos.push(tGeo.toNonIndexed());
  });

  // 3. Center: Line Width & Slot Resolution Gauge
  const ribX = -12.0;
  const ribWidths = [0.25, 0.45, 0.65, 0.85];
  ribWidths.forEach((rw, idx) => {
    const rx = ribX + idx * 3.5;
    const rib = new THREE.BoxGeometry(rw, 12.0, 0.4);
    rib.translate(rx, -4.0, h + 0.2);
    addGeos.push(rib.toNonIndexed());
  });
  const ribLbl = new TextGeometry("RIBS 0.2-0.8", { font: font, size: 1.8, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  ribLbl.computeBoundingBox();
  const rw = ribLbl.boundingBox.max.x - ribLbl.boundingBox.min.x;
  ribLbl.translate(-6.5 - rw / 2, -13.0, textZ);
  gaugeGeos.push(ribLbl.toNonIndexed());

  // 4. Center-Right: Hole Shrinkage Gauge (Ø2.0, Ø3.0, Ø4.0mm)
  const holes = [2.0, 3.0, 4.0];
  const holeX = 6.0;
  holes.forEach((d, idx) => {
    const hx = holeX + idx * 7.0;
    const hGeo = new THREE.CylinderGeometry(d / 2, d / 2, h * 2, 24);
    hGeo.rotateX(Math.PI / 2);
    hGeo.translate(hx, -4.0, h / 2);
    holeGeos.push(hGeo.toNonIndexed());

    const dLbl = new TextGeometry(`D${d}`, { font: font, size: 1.9, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    dLbl.computeBoundingBox();
    const dw = dLbl.boundingBox.max.x - dLbl.boundingBox.min.x;
    dLbl.translate(hx - dw / 2, -13.0, textZ);
    gaugeGeos.push(dLbl.toNonIndexed());
  });

  // 5. Right: Optical Specular Steps
  const stepLevels = [0.4, 0.8, 1.2, 1.6];
  const stepStartX = 28.5;
  stepLevels.forEach((lvl, idx) => {
    const sx = stepStartX + idx * 3.0;
    const sGeo = new THREE.BoxGeometry(2.8, 14.0, lvl);
    sGeo.translate(sx, -4.0, h + lvl / 2);
    addGeos.push(sGeo.toNonIndexed());
  });

  // Bottom footer title - enlarged to 2.5mm and horizontally centered
  const botTxt = new TextGeometry("SWATCH 85x50", { font: font, size: 2.5, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  botTxt.computeBoundingBox();
  const bw = botTxt.boundingBox.max.x - botTxt.boundingBox.min.x;
  botTxt.translate(-bw / 2, -21.5, textZ);
  gaugeGeos.push(botTxt.toNonIndexed());

  evaluator.useCDTClipping = true;

  // Step 1: Subtract stepped windows
  if (winGeos.length > 0) {
    const winBrush = new Brush(BufferGeometryUtils.mergeGeometries(winGeos, false));
    winBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, winBrush, SUBTRACTION);
  }

  // Step 2: Subtract hole test gauges
  if (holeGeos.length > 0) {
    const holeBrush = new Brush(BufferGeometryUtils.mergeGeometries(holeGeos, false));
    holeBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);
  }

  // Step 3: Subtract engraved text markings in 3 focused passes for numerical stability
  if (badgeGeos.length > 0) {
    const badgeBrush = new Brush(BufferGeometryUtils.mergeGeometries(badgeGeos, false));
    badgeBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, badgeBrush, SUBTRACTION);
  }
  if (winLabelGeos.length > 0) {
    const winLblBrush = new Brush(BufferGeometryUtils.mergeGeometries(winLabelGeos, false));
    winLblBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, winLblBrush, SUBTRACTION);
  }
  if (gaugeGeos.length > 0) {
    const gaugeBrush = new Brush(BufferGeometryUtils.mergeGeometries(gaugeGeos, false));
    gaugeBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, gaugeBrush, SUBTRACTION);
  }

  // Step 4: Additive features (relief circles, ribs, optical steps) merged into single mesh
  let finalGeo = safeMergeGeometries([cardBrush.geometry, ...addGeos]);
  finalGeo = healMesh(finalGeo);

  const swatchName = `${params.brand || 'Bambu'}_${params.material || 'PLA'}_Swatch`.replace(/\s+/g, '_');
  finalGeo.userData = {
    presetId: 'swatch',
    parts: [
      {
        name: swatchName,
        geometry: finalGeo,
        meta: {}
      }
    ]
  };

  return finalGeo;
}

/**
 * 2. Bridge Calibration Card with Dual-track (Narrow/Wide), Through-windows & Droop Steps
 * FIXED: Adjacent rows separated by 2.5mm air gap, never connecting or fusing!
 */
export function generateBridgeCard(params, font) {
  const h = 2.4;
  let cardBrush = createBaseCardBrush(h, params.includeHole !== false);

  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  evaluator.useCDTClipping = true;

  const minSpan = params.bridgeMinSpan || 10;
  const maxSpan = params.bridgeMaxSpan || 50;
  const spans = [
    minSpan,
    Math.round(minSpan + (maxSpan - minSpan) * 0.25),
    Math.round(minSpan + (maxSpan - minSpan) * 0.50),
    Math.round(minSpan + (maxSpan - minSpan) * 0.75),
    maxSpan
  ];

  // Center-to-center pitch = 8.5mm
  const rowY = [-17.0, -8.5, 0.0, 8.5, 17.0];
  const centerX = 3.0;
  const pillarH = params.bridgePillarHeight || 7.0;
  const pillarW = 3.5;
  const wNarrow = 1.6;
  const wGap = 1.2;
  const wWide = 3.2;
  const stationD = wNarrow + wGap + wWide; // 6.0mm! (Leaving 2.5mm air gap between adjacent pillars!)

  const addGeos = [];
  const subGeos = [];
  const textGeos = [];
  const debossDepth = 0.45;
  const textZ = h - debossDepth;
  const textDepth = 0.8;

  spans.forEach((span, i) => {
    const y = rowY[i];

    // Left and right support pillars
    const pLeft = new THREE.BoxGeometry(pillarW, stationD, pillarH);
    pLeft.translate(centerX - span / 2 - pillarW / 2, y, h + pillarH / 2);
    addGeos.push(pLeft.toNonIndexed());

    const pRight = new THREE.BoxGeometry(pillarW, stationD, pillarH);
    pRight.translate(centerX + span / 2 + pillarW / 2, y, h + pillarH / 2);
    addGeos.push(pRight.toNonIndexed());

    // Dual Bridge rails: Narrow & Wide
    const bNarrow = new THREE.BoxGeometry(span, wNarrow, 1.2);
    bNarrow.translate(centerX, y - stationD / 2 + wNarrow / 2, h + pillarH - 0.6);
    addGeos.push(bNarrow.toNonIndexed());

    const bWide = new THREE.BoxGeometry(span, wWide, 1.2);
    bWide.translate(centerX, y + stationD / 2 - wWide / 2, h + pillarH - 0.6);
    addGeos.push(bWide.toNonIndexed());

    // Through-plate light inspection cutout under bridge
    const windowCutout = new THREE.BoxGeometry(span - 2.0, stationD - 0.8, h * 2);
    windowCutout.translate(centerX, y, h / 2);
    subGeos.push(windowCutout.toNonIndexed());

    // Engraved Span label on card base to left of pillar - enlarged to 2.2mm
    const lbl = new TextGeometry(`${span}`, { font: font, size: 2.2, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    lbl.computeBoundingBox();
    const lw = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(centerX - span / 2 - pillarW - lw - 1.2, y - 0.9, textZ);
    textGeos.push(lbl.toNonIndexed());
  });

  // Droop reference steps on left side (1mm, 2mm, 3mm, 4mm, 5mm) - enlarged to 2.2mm
  for (let s = 1; s <= 5; s++) {
    const sy = -16.0 + (s - 1) * 6.5;
    const step = new THREE.BoxGeometry(3.0, 4.0, s);
    step.translate(-35.0, sy, h + s / 2);
    addGeos.push(step.toNonIndexed());

    const slbl = new TextGeometry(`${s}`, { font: font, size: 2.2, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    slbl.computeBoundingBox();
    const sw = slbl.boundingBox.max.x - slbl.boundingBox.min.x;
    slbl.translate(-39.5, sy - 0.9, textZ);
    textGeos.push(slbl.toNonIndexed());
  }

  // Parameter Banner - horizontally centered at X = 0 (Engraved 0.45mm, enlarged to 2.4mm)
  const banner = `SPEED: ${params.bridgeSpeed || 50}mm/s | FLOW: ${params.bridgeFlow || 0.95}`;
  const bannerText = new TextGeometry(banner, { font: font, size: 2.4, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  bannerText.computeBoundingBox();
  const bannerCenterX = (bannerText.boundingBox.max.x + bannerText.boundingBox.min.x) / 2;
  bannerText.translate(-bannerCenterX, -22.2, textZ);
  textGeos.push(bannerText.toNonIndexed());

  // Cut light inspection windows under bridges with CDT
  evaluator.useCDTClipping = true;
  if (subGeos.length > 0) {
    const mergedSub = BufferGeometryUtils.mergeGeometries(subGeos, false);
    const subBrush = new Brush(mergedSub); subBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, subBrush, SUBTRACTION);
  }

  // Subtract all engraved text markings
  if (textGeos.length > 0) {
    const textBrush = new Brush(BufferGeometryUtils.mergeGeometries(textGeos, false));
    textBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, textBrush, SUBTRACTION);
  }

  // Merge base card with all pillars, bridge rails, and droop steps (100% manifold, 0 open edges)
  let finalGeo = safeMergeGeometries([cardBrush.geometry, ...addGeos]);
  finalGeo = healMesh(finalGeo);

  finalGeo.userData = {
    presetId: 'bridge',
    parts: [
      {
        name: 'Bridge_Calibration_Card',
        geometry: finalGeo,
        meta: {}
      }
    ]
  };

  return finalGeo;
}

/**
 * 3. Ironing Calibration Card: Shifted Left, Zero Boundary Spill, F% Centered on Left, S(mm) to the Left of 0.1
 */
export function generateIroningCard(params, font) {
  const h = 2.4;
  let cardBrush = createBaseCardBrush(h, params.includeHole !== false);

  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  evaluator.useCDTClipping = true;

  const minSpacing = params.ironingMinSpacing || 0.10;
  const maxSpacing = params.ironingMaxSpacing || 0.20;
  const colSpacings = [];
  for (let c = 0; c < 5; c++) {
    colSpacings.push(Number((minSpacing + (maxSpacing - minSpacing) * (c / 4)).toFixed(2)));
  }

  const minFlow = params.ironingMinFlow || 10;
  const maxFlow = params.ironingMaxFlow || 25;
  const rowFlows = [];
  for (let r = 0; r < 4; r++) {
    rowFlows.push(Math.round(minFlow + (maxFlow - minFlow) * (r / 3)));
  }

  // Large blocks safely inside card boundaries (-42.5 to +42.5mm)
  const blockW = 10.5;
  const blockD = 7.5;
  const blockH = 0.8;

  const startX = -18.0;
  const pitchX = 12.0;
  const startY = -16.5;
  const pitchY = 9.0;

  const textGeos = [];
  const debossDepth = 0.45;
  const textZ = h - debossDepth;
  const textDepth = 0.8;

  // S(mm) positioned cleanly between top-left hole and 0.10 label - enlarged to 1.85mm
  const sLabel = new TextGeometry("S(mm)", { font: font, size: 1.85, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  sLabel.computeBoundingBox();
  const sw = sLabel.boundingBox.max.x - sLabel.boundingBox.min.x;
  sLabel.translate(-27.5 - sw / 2, 17.5, textZ);
  textGeos.push(sLabel.toNonIndexed());

  // Column Spacing numbers - enlarged to 2.2mm and centered above columns
  colSpacings.forEach((sp, c) => {
    const bx = startX + c * pitchX;
    const lbl = new TextGeometry(`${sp}`, { font: font, size: 2.2, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    lbl.computeBoundingBox();
    const lw = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(bx - lw / 2, 17.5, textZ);
    textGeos.push(lbl.toNonIndexed());
  });

  // F% placed on left, vertically centered between 20% (row 2) and 15% (row 1) - enlarged to 2.6mm
  const fMidY = (startY + 1 * pitchY + startY + 2 * pitchY) / 2; // -3.0mm
  const fLabel = new TextGeometry("F%", { font: font, size: 2.6, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  fLabel.computeBoundingBox();
  const fw = fLabel.boundingBox.max.x - fLabel.boundingBox.min.x;
  fLabel.translate(-38.8, fMidY - 1.2, textZ);
  textGeos.push(fLabel.toNonIndexed());

  // Row Flow numbers - enlarged to 2.2mm and cleanly aligned to left of pads (pad starts at -23.25mm)
  rowFlows.forEach((fl, r) => {
    const by = startY + r * pitchY;
    const lbl = new TextGeometry(`${fl}%`, { font: font, size: 2.2, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    lbl.computeBoundingBox();
    const lw = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(-25.2 - lw, by - 0.9, textZ);
    textGeos.push(lbl.toNonIndexed());
  });

  // Subtract all engraved text markings directly from Base_Plate
  if (textGeos.length > 0) {
    const textBrush = new Brush(BufferGeometryUtils.mergeGeometries(textGeos, false));
    textBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, textBrush, SUBTRACTION);
  }

  const basePlateGeo = healMesh(cardBrush.geometry);
  basePlateGeo.computeVertexNormals();

  const parts = [
    {
      name: "Base_Plate",
      geometry: basePlateGeo,
      meta: {}
    }
  ];
  const padGeos = [];

  // Add 20 test pads
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const bx = startX + c * pitchX;
      const by = startY + r * pitchY;
      const padGeo = new THREE.BoxGeometry(blockW, blockD, blockH);
      padGeo.translate(bx, by, h + blockH / 2);

      const flow = rowFlows[r];
      const spacing = colSpacings[c];

      parts.push({
        name: `r${r+1}-c${c+1} [F:${flow}% S:${spacing}mm]`,
        geometry: padGeo,
        meta: {
          ironing_type: "top",
          ironing_flow: `${flow}%`,
          ironing_spacing: String(spacing),
          ironing_speed: "30",
          top_surface_pattern: "monotonicline"
        }
      });
      padGeos.push(padGeo);
    }
  }

  const previewGeo = safeMergeGeometries([basePlateGeo, ...padGeos]);

  previewGeo.userData = {
    presetId: 'ironing',
    parts
  };

  return previewGeo;
}

/**
 * 4. Standalone Vertical 4x4 Fuzzy Skin Matrix Card
 * Standalone vertical card (no support feet), 4 rows (Thickness) x 4 columns (Distance) = 16 patches
 * All debossed text correctly cut into the front face (Y in [-1.2, -0.8]).
 */
export function generateFuzzySkinCard(params, font) {
  const cardW = 85.0;
  const cardH = 50.0;
  const cardThick = 2.4;
  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  evaluator.useCDTClipping = true;

  // Main vertical card body: X in [-42.5, 42.5], Y in [-1.2, 1.2], Z in [0, 50]
  const cardShape = new THREE.Shape();
  const r = 3.0;
  const x0 = -cardW / 2, z0 = 0;
  cardShape.moveTo(x0 + r, z0);
  cardShape.lineTo(x0 + cardW - r, z0);
  cardShape.quadraticCurveTo(x0 + cardW, z0, x0 + cardW, z0 + r);
  cardShape.lineTo(x0 + cardW, z0 + cardH - r);
  cardShape.quadraticCurveTo(x0 + cardW, z0 + cardH, x0 + cardW - r, z0 + cardH);
  cardShape.lineTo(x0 + r, z0 + cardH);
  cardShape.quadraticCurveTo(x0, z0 + cardH, x0, z0 + cardH - r);
  cardShape.lineTo(x0, z0 + r);
  cardShape.quadraticCurveTo(x0, z0, x0 + r, z0);

  const extrudeGeo = new THREE.ExtrudeGeometry(cardShape, { depth: cardThick, bevelEnabled: false, curveSegments: 24 });
  extrudeGeo.translate(0, 0, -cardThick / 2);
  extrudeGeo.rotateX(Math.PI / 2);
  let cardBrush = new Brush(extrudeGeo); cardBrush.updateMatrixWorld();

  // Hanging hole Ø4.5mm (subtracted via CSG cylinder to prevent ear-clipping sliver triangles)
  if (params.includeHole !== false) {
    const holeGeo = new THREE.CylinderGeometry(2.25, 2.25, cardThick * 2, 32);
    holeGeo.rotateX(Math.PI / 2);
    holeGeo.translate(-34.5, 0, 40.0);
    const holeBrush = new Brush(holeGeo);
    holeBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);
  }

  // 4 Rows (Thickness) x 4 Cols (Point Distance) = 16 Raised Patches on Front Vertical Face
  const minThick = params.fuzzyMinThickness || 0.1;
  const maxThick = params.fuzzyMaxThickness || 0.4;
  const thicknesses = [];
  for (let r = 0; r < 4; r++) {
    thicknesses.push(Number((minThick + (maxThick - minThick) * (r / 3)).toFixed(2)));
  }

  const minDistance = params.fuzzyMinDistance || 0.2;
  const maxDistance = params.fuzzyMaxDistance || 0.8;
  const distances = [];
  for (let c = 0; c < 4; c++) {
    distances.push(Number((minDistance + (maxDistance - minDistance) * (c / 3)).toFixed(2)));
  }

  const patchW = 11.5;
  const patchH = 7.2;
  const patchExtrude = 1.0;
  const startX = -16.0;
  const pitchX = 13.5;
  const startZ = 4.0;
  const pitchZ = 9.0;

  const frontTextGeos = [];
  const debossDepth = 0.45;
  const textDepth = 0.8;

  // Helper to engrave debossed text 0.45mm into the front vertical face (Y in [-1.2, -0.75])
  const prepFrontText = (geo) => {
    geo.rotateX(Math.PI / 2);
    geo.translate(0, -cardThick / 2 + debossDepth, 0);
    frontTextGeos.push(geo.toNonIndexed());
  };

  // Column labels on card front face (centered above each column) - enlarged to 2.4mm
  distances.forEach((d, c) => {
    const px = startX + c * pitchX;
    const str = d.toFixed(2);
    const lbl = new TextGeometry(str, { font: font, size: 2.4, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    lbl.computeBoundingBox();
    const w = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(px - w / 2, 41.5, 0);
    prepFrontText(lbl);
  });

  // Row labels on card front face (aligned to left of rows) - enlarged to 2.4mm
  thicknesses.forEach((th, r) => {
    const pz = startZ + r * pitchZ;
    const str = `T${th.toFixed(1)}`;
    const lbl = new TextGeometry(str, { font: font, size: 2.4, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    lbl.computeBoundingBox();
    const w = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(startX - 6.5 - w, pz + 2.0, 0);
    prepFrontText(lbl);
  });

  // D(mm) indicator above row labels - enlarged to 2.2mm
  const dLabel = new TextGeometry("D(mm)", { font: font, size: 2.2, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  dLabel.computeBoundingBox();
  const dw = dLabel.boundingBox.max.x - dLabel.boundingBox.min.x;
  dLabel.translate(startX - 6.5 - dw, 41.5, 0);
  prepFrontText(dLabel);

  // Top title banner - enlarged to 2.8mm and centered
  const title = new TextGeometry("FUZZY 4x4 MATRIX", { font: font, size: 2.8, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  title.computeBoundingBox();
  const tw = title.boundingBox.max.x - title.boundingBox.min.x;
  title.translate(-tw / 2, 46.0, 0);
  prepFrontText(title);

  // Subtract all engraved front text markings (100% crisp slicing in Bambu Studio)
  if (frontTextGeos.length > 0) {
    const textBrush = new Brush(BufferGeometryUtils.mergeGeometries(frontTextGeos, false));
    textBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, textBrush, SUBTRACTION);
  }

  const basePlateGeo = healMesh(cardBrush.geometry);
  basePlateGeo.computeVertexNormals();

  const parts = [
    {
      name: "Base_Plate",
      geometry: basePlateGeo,
      meta: {}
    }
  ];
  const patchGeos = [];

  // 16 Raised Patches on Front Vertical Face
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const px = startX + c * pitchX;
      const pz = startZ + r * pitchZ;
      const pGeo = new THREE.BoxGeometry(patchW, patchExtrude, patchH);
      pGeo.translate(px, -cardThick / 2 - patchExtrude / 2, pz + patchH / 2);

      const dist = distances[c];
      const th = thicknesses[r];

      parts.push({
        name: `r${r+1}-c${c+1} [D:${dist.toFixed(2)}mm T:${th.toFixed(1)}mm]`,
        geometry: pGeo,
        meta: {
          fuzzy_skin: "all",
          fuzzy_skin_noise_type: "classic",
          fuzzy_skin_point_distance: String(dist),
          fuzzy_skin_thickness: String(th)
        }
      });
      patchGeos.push(pGeo);
    }
  }

  const previewGeo = safeMergeGeometries([basePlateGeo, ...patchGeos]);

  previewGeo.userData = {
    presetId: 'fuzzy',
    parts
  };

  return previewGeo;
}

/**
 * 5. Tolerance Clearance Matrix Gauge: 4 Rows of Diameters x 5 Columns of Clearances
 * TOLERANCE title rotated 90 degrees vertically along left edge to free space.
 * Max font size: 2.2mm for true ⌀ row labels, 2.0mm for clearances.
 */
export function generateToleranceCard(params, font) {
  const h = 4.8;
  let cardBrush = createBaseCardBrush(h, params.includeHole !== false);

  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  evaluator.useCDTClipping = true;

  const clearances = params.clearances || [0.10, 0.15, 0.20, 0.25, 0.30];
  const diameters = [
    params.toleranceDia1 || 3.0,
    params.toleranceDia2 || 4.5,
    params.toleranceDia3 || 6.0,
    params.toleranceDia4 || 7.5
  ];

  const startX = -10.5;
  const pitchX = 11.5;
  const rowY = [-14.0, -4.5, 5.0, 14.5]; // 4 rows
  const floorH = 1.2;
  const grooveDepth = h - floorH; // 3.6mm

  const holeGeos = [];
  const textGeos = [];
  const debossDepth = 0.45;
  const textZ = h - debossDepth;
  const textDepth = 0.8;
  const pins = [];

  diameters.forEach((dia, r) => {
    const pinR = dia / 2;
    const y = rowY[r];

    clearances.forEach((c, i) => {
      const x = startX + i * pitchX;
      const outerR = pinR + c;

      // 1. Hole cutout in base plate (batched)
      const cylHole = new THREE.CylinderGeometry(outerR, outerR, grooveDepth + 0.2, 32);
      cylHole.rotateX(Math.PI / 2);
      cylHole.translate(x, y, floorH + (grooveDepth + 0.2) / 2);
      holeGeos.push(cylHole.toNonIndexed());

      // 2. Central Pin + Coin Slot Twist Grip (batched)
      const cylPin = new THREE.CylinderGeometry(pinR, pinR, grooveDepth, 32);
      cylPin.rotateX(Math.PI / 2);
      cylPin.translate(x, y, floorH + grooveDepth / 2);

      const slotW = Math.min(dia * 0.85, 4.2);
      const coinGrip = new THREE.BoxGeometry(slotW, 1.4, 0.9);
      coinGrip.translate(x, y, h + 0.35);

      const pinGeo = BufferGeometryUtils.mergeGeometries([cylPin.toNonIndexed(), coinGrip.toNonIndexed()], false);
      pins.push({
        name: `Station_r${r+1}-c${i+1} [Dia:${Number(dia).toFixed(1)} Gap:${Number(c).toFixed(2)}mm]`,
        geometry: pinGeo,
        meta: {}
      });
    });

    // Row Label with D (Diameter) symbol - enlarged to 2.8mm (Engraved 0.45mm)
    const diaLbl = new TextGeometry(`D${Number(dia).toFixed(1)}`, { font: font, size: 2.8, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    diaLbl.computeBoundingBox();
    const lw = diaLbl.boundingBox.max.x - diaLbl.boundingBox.min.x;
    diaLbl.translate(-16.0 - lw, y - 1.1, textZ);
    textGeos.push(diaLbl.toNonIndexed());
  });

  // Column Clearance Labels along bottom - enlarged to 2.6mm and centered (Engraved 0.45mm)
  clearances.forEach((c, i) => {
    const x = startX + i * pitchX;
    const lbl = new TextGeometry(`${Number(c).toFixed(2)}`, { font: font, size: 2.6, depth: textDepth, curveSegments: 1, bevelEnabled: false });
    lbl.computeBoundingBox();
    const cw = lbl.boundingBox.max.x - lbl.boundingBox.min.x;
    lbl.translate(x - cw / 2, -21.8, textZ);
    textGeos.push(lbl.toNonIndexed());
  });

  // GAP indicator label - enlarged to 2.4mm (Engraved 0.45mm)
  const clrLbl = new TextGeometry("GAP", { font: font, size: 2.4, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  clrLbl.computeBoundingBox();
  const gw = clrLbl.boundingBox.max.x - clrLbl.boundingBox.min.x;
  clrLbl.translate(-16.0 - gw, -21.8, textZ);
  textGeos.push(clrLbl.toNonIndexed());

  // Title "TOLERANCE" rotated 90 degrees vertically along the far left edge - enlarged to 3.6mm (Engraved 0.45mm)
  const title = new TextGeometry("TOLERANCE", { font: font, size: 3.6, depth: textDepth, curveSegments: 1, bevelEnabled: false });
  title.rotateZ(Math.PI / 2);
  title.computeBoundingBox();
  const titleH = title.boundingBox.max.y - title.boundingBox.min.y;
  title.translate(-38.8, -titleH / 2 - 4.0, textZ);
  textGeos.push(title.toNonIndexed());

  // Cut pin sockets with CDT clipping
  evaluator.useCDTClipping = true;
  const mergedHolesGeo = BufferGeometryUtils.mergeGeometries(holeGeos, false);
  const holesBrush = new Brush(mergedHolesGeo); holesBrush.updateMatrixWorld();
  cardBrush = evaluator.evaluate(cardBrush, holesBrush, SUBTRACTION);

  // Subtract all engraved text markings directly from base plate
  if (textGeos.length > 0) {
    const textBrush = new Brush(BufferGeometryUtils.mergeGeometries(textGeos, false));
    textBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, textBrush, SUBTRACTION);
  }

  const basePlateGeo = healMesh(cardBrush.geometry);
  basePlateGeo.computeVertexNormals();
  const parts = [
    {
      name: "Base_Plate",
      geometry: basePlateGeo,
      meta: {}
    },
    ...pins
  ];

  const previewGeo = safeMergeGeometries([basePlateGeo, ...pins.map(p => p.geometry)]);

  previewGeo.userData = {
    presetId: 'tolerance',
    parts
  };

  return previewGeo;
}

/**
 * Universal Generator Dispatcher (5 Standard Test Card Presets)
 */
export async function generateTestModelGeometry(presetId, params) {
  const font = await loadDefaultFont();
  switch (presetId) {
    case 'swatch':
      return generateSwatchCard(params, font);
    case 'bridge':
      return generateBridgeCard(params, font);
    case 'ironing':
      return generateIroningCard(params, font);
    case 'fuzzy':
      return generateFuzzySkinCard(params, font);
    case 'tolerance':
      return generateToleranceCard(params, font);
    default:
      return generateSwatchCard(params, font);
  }
}
