import fs from 'fs';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';

async function testCSGText() {
  console.time('Load Font');
  const fontJson = JSON.parse(fs.readFileSync('public/fonts/helvetiker_bold.typeface.json', 'utf8'));
  const loader = new FontLoader();
  const font = loader.parse(fontJson);
  console.timeEnd('Load Font');

  console.time('Create TextGeometry');
  const textGeo = new TextGeometry('PLA BASIC\n220C / 55C', {
    font: font,
    size: 3.5,
    depth: 0.6,
    curveSegments: 2,
    bevelEnabled: false
  });
  textGeo.computeVertexNormals();
  console.timeEnd('Create TextGeometry');
  console.log(`Text vertices: ${textGeo.attributes.position.count}`);

  console.time('Create Card Brush');
  const cardGeo = new THREE.BoxGeometry(60, 40, 2.4);
  const cardBrush = new Brush(cardGeo);
  cardBrush.updateMatrixWorld();
  console.timeEnd('Create Card Brush');

  console.time('Create Text Brush');
  textGeo.translate(-25, 0, 1.2 - 0.4); // deboss top face by 0.4mm
  const textBrush = new Brush(textGeo);
  textBrush.updateMatrixWorld();
  console.timeEnd('Create Text Brush');

  console.time('CSG Subtract');
  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  const resultMesh = evaluator.evaluate(cardBrush, textBrush, SUBTRACTION);
  console.timeEnd('CSG Subtract');

  console.log(`Result vertices: ${resultMesh.geometry.attributes.position.count}`);
  console.log(`Result triangles: ${resultMesh.geometry.index ? resultMesh.geometry.index.count / 3 : resultMesh.geometry.attributes.position.count / 3}`);
}

testCSGText().catch(console.error);
