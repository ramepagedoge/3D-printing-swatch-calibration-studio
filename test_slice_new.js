import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Brush, Evaluator, SUBTRACTION, ADDITION } from 'three-bvh-csg';

const baseProjectSettings = JSON.parse(fs.readFileSync('src/constants/baseProjectSettings.json', 'utf8'));
const fontJson = JSON.parse(fs.readFileSync('public/fonts/helvetiker_bold.typeface.json', 'utf8'));
const loader = new FontLoader();
const font = loader.parse(fontJson);

function createStandardCardShape(w = 85.0, d = 50.0, r = 3.0) {
  const shape = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
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

function createBaseCardBrush(h = 2.4, includeHole = true) {
  const shape = createStandardCardShape(85.0, 50.0, 3.0);
  const baseExtrude = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 16 });
  let cardBrush = new Brush(baseExtrude);
  cardBrush.updateMatrixWorld();

  if (includeHole) {
    const holeGeo = new THREE.CylinderGeometry(2.25, 2.25, h * 2 + 1, 24);
    holeGeo.rotateX(Math.PI / 2);
    holeGeo.translate(-34.5, 16.0, h / 2);
    const holeBrush = new Brush(holeGeo);
    holeBrush.updateMatrixWorld();

    const evaluator = new Evaluator();
    evaluator.useGroups = false;
    cardBrush = evaluator.evaluate(cardBrush, holeBrush, SUBTRACTION);
  }
  return cardBrush;
}

function makeTempTower(params) {
  const h = 2.4;
  let cardBrush = createBaseCardBrush(h, true);
  const evaluator = new Evaluator();
  evaluator.useGroups = false;

  const startTemp = params.tempStart || 220;
  const stepTemp = params.tempStep || 5;
  const numTiers = params.tempTiers || 5;
  const tierH = params.tempTierHeight || 6.0;

  const towerW = 46.0;
  const towerD = 18.0;
  const centerX = 10.0;
  const centerY = 0;

  const towerBase = new THREE.BoxGeometry(towerW, towerD, 1.0);
  towerBase.translate(centerX, centerY, h + 0.5);
  const tbBrush = new Brush(towerBase); tbBrush.updateMatrixWorld();
  cardBrush = evaluator.evaluate(cardBrush, tbBrush, ADDITION);

  for (let t = 0; t < numTiers; t++) {
    const tierBottomZ = h + 1.0 + t * tierH;
    const tempVal = startTemp - t * stepTemp;

    const tierGeo = new THREE.BoxGeometry(towerW, towerD, tierH);
    tierGeo.translate(centerX, centerY, tierBottomZ + tierH / 2);
    const tierBrush = new Brush(tierGeo); tierBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, tierBrush, ADDITION);

    const bridgeCutW = 18.0;
    const bridgeCutH = tierH - 1.6;
    const cutGeo = new THREE.BoxGeometry(bridgeCutW, towerD + 2, bridgeCutH);
    cutGeo.translate(centerX, centerY, tierBottomZ + bridgeCutH / 2);
    const cutBrush = new Brush(cutGeo); cutBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, cutBrush, SUBTRACTION);

    const chamfer = new THREE.BoxGeometry(7.0, towerD + 2, tierH);
    chamfer.rotateY(Math.PI / 4);
    chamfer.translate(centerX - towerW / 2 + 1.5, centerY, tierBottomZ + tierH / 2);
    const chBrush = new Brush(chamfer); chBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, chBrush, SUBTRACTION);

    const pin = new THREE.ConeGeometry(1.2, tierH * 0.8, 16);
    pin.rotateX(Math.PI / 2);
    pin.translate(centerX + towerW / 2 - 4.5, centerY, tierBottomZ + (tierH * 0.8) / 2);
    const pinBrush = new Brush(pin); pinBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, pinBrush, ADDITION);

    const tempText = new TextGeometry(`${tempVal}`, {
      font: font,
      size: 2.2,
      depth: 0.45,
      curveSegments: 2,
      bevelEnabled: false
    });
    tempText.translate(centerX - 8.0, centerY - towerD / 2 + 0.35, tierBottomZ + 1.2);
    const ttBrush = new Brush(tempText); ttBrush.updateMatrixWorld();
    cardBrush = evaluator.evaluate(cardBrush, ttBrush, SUBTRACTION);
  }

  return cardBrush.geometry;
}

async function verifyGeo(name, geometry) {
  const zip = new JSZip();
  const nonIndexed = geometry.toNonIndexed();
  const pos = nonIndexed.attributes.position.array;
  const triCount = pos.length / 9;

  let vXml = '', tXml = '';
  for (let i = 0; i < triCount; i++) {
    const v1 = i * 3, v2 = i * 3 + 1, v3 = i * 3 + 2;
    vXml += `     <vertex x="${pos[v1*3].toFixed(4)}" y="${pos[v1*3+1].toFixed(4)}" z="${pos[v1*3+2].toFixed(4)}" />\n`;
    vXml += `     <vertex x="${pos[v2*3].toFixed(4)}" y="${pos[v2*3+1].toFixed(4)}" z="${pos[v2*3+2].toFixed(4)}" />\n`;
    vXml += `     <vertex x="${pos[v3*3].toFixed(4)}" y="${pos[v3*3+1].toFixed(4)}" z="${pos[v3*3+2].toFixed(4)}" />\n`;
    tXml += `     <triangle v1="${v1}" v2="${v2}" v3="${v3}" />\n`;
  }

  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
 <Default Extension="png" ContentType="image/png"/>
 <Default Extension="config" ContentType="text/plain"/>
 <Default Extension="json" ContentType="application/json"/>
 <Default Extension="xml" ContentType="application/xml"/>
</Types>`);

  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/core/2015/02/3dmodel"/>
 <Relationship Target="/Metadata/plate_1.png" Id="rel-2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
 <Relationship Target="/Auxiliaries/.thumbnails/thumbnail_3mf.png" Id="rel-3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
</Relationships>`);

  zip.file('3D/_rels/3dmodel.model.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/Objects/object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`);

  zip.file('3D/Objects/object_1.model', `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
 <metadata name="BambuStudio:3mfVersion">1</metadata>
 <resources>
  <object id="1" p:UUID="00010000-81cb-4c03-9d28-80fed5dfa1dc" type="model">
   <mesh><vertices>\n${vXml}    </vertices><triangles>\n${tXml}    </triangles></mesh>
  </object>
 </resources>
</model>`);

  zip.file('3D/3dmodel.model', `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
 <metadata name="Application">BambuStudio-02.07.01.62</metadata>
 <metadata name="BambuStudio:3mfVersion">1</metadata>
 <resources>
  <object id="2" p:UUID="00000001-61cb-4c03-9d28-80fed5dfa1dc" type="model">
   <components>
    <component p:path="/3D/Objects/object_1.model" objectid="1" p:UUID="00010000-b206-40ff-9872-83e8017abed1" transform="1 0 0 0 1 0 0 0 1 0 0 0"/>
   </components>
  </object>
 </resources>
 <build p:UUID="2c7c17d8-22b5-4d84-8835-1976022ea369">
  <item objectid="2" p:UUID="00000002-b1ec-4553-aec9-835e5b724bb4" transform="1 0 0 0 1 0 0 0 1 128 128 0" printable="1"/>
 </build>
</model>`);

  zip.file('Metadata/cut_information.xml', `<?xml version="1.0" encoding="utf-8"?>
<objects><object id="1"><cut_id id="0" check_sum="1" connectors_cnt="0"/></object></objects>`);

  zip.file('Metadata/model_settings.config', `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <object id="2">
    <metadata key="name" value="${name}"/>
    <metadata key="extruder" value="1"/>
    <part id="1" subtype="normal_part" uuid="00010000-b206-40ff-9872-83e8017abed1">
      <metadata key="name" value="${name}_Part"/>
      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>
      <metadata key="source_file" value="${name}.stl"/>
      <metadata key="source_object_id" value="0"/>
      <metadata key="source_volume_id" value="0"/>
      <metadata key="source_offset_x" value="0"/>
      <metadata key="source_offset_y" value="0"/>
      <metadata key="source_offset_z" value="0"/>
      <metadata key="extruder" value="1"/>
      <mesh_stat face_count="${triCount}" edges_fixed="0" degenerate_facets="0" facets_removed="0" facets_reversed="0" backwards_edges="0"/>
    </part>
  </object>
  <plate>
    <metadata key="plater_id" value="1"/>
    <metadata key="plater_name" value="Plate 1 - ${name}"/>
    <metadata key="locked" value="false"/>
    <metadata key="thumbnail_file" value="Metadata/plate_1.png"/>
    <metadata key="filament_maps" value="1 1 1 1"/>
    <model_instance>
      <metadata key="object_id" value="2"/>
      <metadata key="instance_id" value="0"/>
      <metadata key="identify_id" value="1"/>
    </model_instance>
  </plate>
  <assemble>
    <assemble_item object_id="2" instance_id="0" transform="1 0 0 0 1 0 0 0 1 128 128 0" offset="0 0 0" />
  </assemble>
</config>`);

  zip.file('Metadata/slice_info.config', `<?xml version="1.0" encoding="UTF-8"?>
<config><header><header_item key="X-BBL-Client-Type" value="slicer"/><header_item key="X-BBL-Client-Version" value="02.07.01.62"/></header><plate><metadata key="index" value="1"/></plate></config>`);

  const projCfg = { ...baseProjectSettings };
  projCfg['version'] = '02.07.01.62';
  zip.file('Metadata/project_settings.config', JSON.stringify(projCfg, null, 2));
  zip.file('Metadata/filament_sequence.json', JSON.stringify({ plate_1: { nozzle_sequence: [], optimal_assignment: [], sequence: [] } }));
  const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  zip.file('Metadata/plate_1.png', dummyPng);
  zip.file('Auxiliaries/.thumbnails/thumbnail_3mf.png', dummyPng);

  const outPath = `/tmp/test_single_${name}.3mf`;
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outPath, buf);

  const sliceDir = `/tmp/slice_test_${name}`;
  if (fs.existsSync(sliceDir)) fs.rmSync(sliceDir, { recursive: true, force: true });
  fs.mkdirSync(sliceDir);

  const cmd = `/Applications/BambuStudio.app/Contents/MacOS/BambuStudio --slice 0 --outputdir "${sliceDir}" "${outPath}"`;
  execSync(cmd, { stdio: 'pipe' });
  const res = JSON.parse(fs.readFileSync(path.join(sliceDir, 'result.json'), 'utf8'));
  console.log(`Verified ${name}: return_code=${res.return_code}, objects=${res.sliced_plates[0].objects.length}, time=${(res.sliced_plates[0].total_predication/60).toFixed(1)}m`);
}

const geo = makeTempTower({ tempStart: 220, tempStep: 5, tempTiers: 5, tempTierHeight: 6.0 });
verifyGeo('temp_tower', geo).catch(console.error);
