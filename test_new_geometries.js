import fs from 'fs';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Brush, Evaluator, SUBTRACTION, ADDITION } from 'three-bvh-csg';

const fontJson = JSON.parse(fs.readFileSync('public/fonts/helvetiker_bold.typeface.json', 'utf8'));
const loader = new FontLoader();
const font = loader.parse(fontJson);

function createRoundedRectShape(w, d, r) {
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
  return shape;
}

// Test 1: Bridge Card on 85x50mm
console.log('Testing Bridge Card on 85x50mm...');
{
  const w = 85.0, d = 50.0, h = 2.4;
  const baseShape = createRoundedRectShape(w, d, 3.0);
  const baseExtrude = new THREE.ExtrudeGeometry(baseShape, { depth: h, bevelEnabled: false, curveSegments: 16 });
  let cardBrush = new Brush(baseExtrude);
  cardBrush.updateMatrixWorld();

  const evaluator = new Evaluator();
  evaluator.useGroups = false;

  // Hanging hole
  const holeGeo = new THREE.CylinderGeometry(2.25, 2.25, h * 2, 24);
  holeGeo.rotateX(Math.PI / 2);
  holeGeo.translate(-34.5, 16.0, h / 2);
  const holeBrush = new Brush(holeGeo); holeBrush.updateMatrixWorld();
  cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);

  // Bridges along X (spans: 10, 20, 30, 40, 50 mm)
  const spans = [10, 20, 30, 40, 50];
  const rowY = [-16, -8, 0, 8, 16];
  const centerX = 4.0;
  const pillarH = 7.0;

  spans.forEach((span, i) => {
    const y = rowY[i];
    const pillarW = 4.0;
    const pillarD = 4.5;

    // Left and right pillars
    const pLeft = new THREE.BoxGeometry(pillarW, pillarD, pillarH);
    pLeft.translate(centerX - span / 2 - pillarW / 2, y, h + pillarH / 2);
    const pRight = new THREE.BoxGeometry(pillarW, pillarD, pillarH);
    pRight.translate(centerX + span / 2 + pillarW / 2, y, h + pillarH / 2);

    // Bridge rail spanning along X
    const bridge = new THREE.BoxGeometry(span, 3.0, 1.2);
    bridge.translate(centerX, y, h + pillarH - 0.6);

    const plBrush = new Brush(pLeft); plBrush.updateMatrixWorld();
    const prBrush = new Brush(pRight); prBrush.updateMatrixWorld();
    const bBrush = new Brush(bridge); bBrush.updateMatrixWorld();

    cardBrush = evaluator.evaluate(cardBrush, plBrush, ADDITION);
    cardBrush = evaluator.evaluate(cardBrush, prBrush, ADDITION);
    cardBrush = evaluator.evaluate(cardBrush, bBrush, ADDITION);

    // Span label on left pillar
    const lbl = new TextGeometry(`${span}`, {
      font: font,
      size: 1.5,
      depth: 0.35,
      curveSegments: 2,
      bevelEnabled: false
    });
    lbl.translate(centerX - span / 2 - pillarW / 2 - 1.2, y - 0.6, h + pillarH - 0.3);
    const lblBrush = new Brush(lbl); lblBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, lblBrush, SUBTRACTION);
  });

  console.log(`Bridge card triangles: ${cardBrush.geometry.index ? cardBrush.geometry.index.count / 3 : cardBrush.geometry.attributes.position.count / 3}`);
}

// Test 2: Ironing 4x5 Matrix on 85x50mm
console.log('Testing Ironing 4x5 Matrix on 85x50mm...');
{
  const w = 85.0, d = 50.0, h = 2.4;
  const baseShape = createRoundedRectShape(w, d, 3.0);
  const baseExtrude = new THREE.ExtrudeGeometry(baseShape, { depth: h, bevelEnabled: false, curveSegments: 16 });
  let cardBrush = new Brush(baseExtrude);
  cardBrush.updateMatrixWorld();

  const evaluator = new Evaluator();
  evaluator.useGroups = false;

  // Hanging hole
  const holeGeo = new THREE.CylinderGeometry(2.25, 2.25, h * 2, 24);
  holeGeo.rotateX(Math.PI / 2);
  holeGeo.translate(-34.5, 16.0, h / 2);
  const holeBrush = new Brush(holeGeo); holeBrush.updateMatrixWorld();
  cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);

  // 4 rows (Flow: 10, 15, 20, 25%) x 5 cols (Spacing: 0.10, 0.12, 0.15, 0.18, 0.20)
  const rows = [10, 15, 20, 25];
  const cols = [0.10, 0.12, 0.15, 0.18, 0.20];
  const blockW = 9.5;
  const blockD = 6.5;
  const blockH = 0.8;

  const startX = -15.0;
  const spacingX = 11.0;
  const startY = -16.0;
  const spacingY = 8.5;

  // Add 20 test pads
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const bx = startX + c * spacingX;
      const by = startY + r * spacingY;
      const padGeo = new THREE.BoxGeometry(blockW, blockD, blockH);
      padGeo.translate(bx, by, h + blockH / 2);
      const padBrush = new Brush(padGeo); padBrush.updateMatrixWorld();
      cardBrush = evaluator.evaluate(cardBrush, padBrush, ADDITION);
    }
  }

  console.log(`Ironing 4x5 card triangles: ${cardBrush.geometry.index ? cardBrush.geometry.index.count / 3 : cardBrush.geometry.attributes.position.count / 3}`);
}

// Test 3: Tolerance Card on 85x50mm with Vertical Cylinders (Z-axis)
console.log('Testing Tolerance Card with Vertical Cylinders...');
{
  const w = 85.0, d = 50.0, h = 4.8;
  const baseShape = createRoundedRectShape(w, d, 3.0);
  const baseExtrude = new THREE.ExtrudeGeometry(baseShape, { depth: h, bevelEnabled: false, curveSegments: 16 });
  let cardBrush = new Brush(baseExtrude);
  cardBrush.updateMatrixWorld();

  const evaluator = new Evaluator();
  evaluator.useGroups = false;

  // Hanging hole
  const holeGeo = new THREE.CylinderGeometry(2.25, 2.25, h * 2, 24);
  holeGeo.rotateX(Math.PI / 2);
  holeGeo.translate(-34.5, 16.0, h / 2);
  const holeBrush = new Brush(holeGeo); holeBrush.updateMatrixWorld();
  cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);

  const clearances = [0.10, 0.15, 0.20, 0.25, 0.30];
  const startX = -18.0;
  const pitch = 13.5;
  const pinRadius = 3.5;
  const floorH = 1.2;
  const grooveDepth = h - floorH; // 3.6mm

  clearances.forEach((c, i) => {
    const x = startX + i * pitch;
    const outerR = pinRadius + c;

    // 1. Hole cutout - properly rotated along Z!
    const cylHole = new THREE.CylinderGeometry(outerR, outerR, grooveDepth + 0.2, 32);
    cylHole.rotateX(Math.PI / 2);
    cylHole.translate(x, 0, floorH + (grooveDepth + 0.2) / 2);
    const chBrush = new Brush(cylHole); chBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, chBrush, SUBTRACTION);

    // 2. Central Pin attached to floor - properly rotated along Z!
    const cylPin = new THREE.CylinderGeometry(pinRadius, pinRadius, grooveDepth, 32);
    cylPin.rotateX(Math.PI / 2);
    cylPin.translate(x, 0, floorH + grooveDepth / 2);
    const cpBrush = new Brush(cylPin); cpBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, cpBrush, ADDITION);

    // 3. Coin slot on pin top
    const coinGrip = new THREE.BoxGeometry(4.5, 1.4, 1.0);
    coinGrip.translate(x, 0, h + 0.4); // 0.2mm overlap into pin
    const cgBrush = new Brush(coinGrip); cgBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, cgBrush, ADDITION);

    // 4. Label below hole
    const lbl = new TextGeometry(`${c.toFixed(2)}`, {
      font: font,
      size: 1.5,
      depth: 0.35,
      curveSegments: 2,
      bevelEnabled: false
    });
    lbl.translate(x - 3.2, -12.0, h - 0.35);
    const lblBrush = new Brush(lbl); lblBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, lblBrush, SUBTRACTION);
  });

  console.log(`Tolerance card triangles: ${cardBrush.geometry.index ? cardBrush.geometry.index.count / 3 : cardBrush.geometry.attributes.position.count / 3}`);
}

console.log('All 3 geometry tests passed in JS!');
