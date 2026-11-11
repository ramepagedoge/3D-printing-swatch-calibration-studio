import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';

async function testCSGSlice() {
  const fontJson = JSON.parse(fs.readFileSync('public/fonts/helvetiker_bold.typeface.json', 'utf8'));
  const loader = new FontLoader();
  const font = loader.parse(fontJson);

  // Text geometry
  const textGeo = new TextGeometry('BAMBU LAB\nPLA BASIC\n220C / 55C\nSPEED 50', {
    font: font,
    size: 3.2,
    depth: 0.6,
    curveSegments: 2,
    bevelEnabled: false
  });
  textGeo.computeVertexNormals();

  // Card brush
  const cardGeo = new THREE.BoxGeometry(60, 40, 2.4);
  const cardBrush = new Brush(cardGeo);
  cardBrush.updateMatrixWorld();

  // Position text to deboss 0.4mm from top (Z=1.2)
  textGeo.translate(-26, -10, 1.2 - 0.4);
  const textBrush = new Brush(textGeo);
  textBrush.updateMatrixWorld();

  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  const resultMesh = evaluator.evaluate(cardBrush, textBrush, SUBTRACTION);

  // Extract vertices and triangles from resultMesh.geometry
  const geom = resultMesh.geometry.toNonIndexed();
  const pos = geom.attributes.position.array;
  const triCount = pos.length / 9;
  console.log(`Extracted triCount: ${triCount}`);

  let vXml = '';
  let tXml = '';
  for (let i = 0; i < triCount; i++) {
    const v1 = i * 3;
    const v2 = i * 3 + 1;
    const v3 = i * 3 + 2;

    const x1 = pos[v1 * 3], y1 = pos[v1 * 3 + 1], z1 = pos[v1 * 3 + 2];
    const x2 = pos[v2 * 3], y2 = pos[v2 * 3 + 1], z2 = pos[v2 * 3 + 2];
    const x3 = pos[v3 * 3], y3 = pos[v3 * 3 + 1], z3 = pos[v3 * 3 + 2];

    vXml += `     <vertex x="${x1.toFixed(4)}" y="${y1.toFixed(4)}" z="${z1.toFixed(4)}" />\n`;
    vXml += `     <vertex x="${x2.toFixed(4)}" y="${y2.toFixed(4)}" z="${z2.toFixed(4)}" />\n`;
    vXml += `     <vertex x="${x3.toFixed(4)}" y="${y3.toFixed(4)}" z="${z3.toFixed(4)}" />\n`;

    tXml += `     <triangle v1="${v1}" v2="${v2}" v3="${v3}" />\n`;
  }

  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
 <Default Extension="png" ContentType="image/png"/>
 <Default Extension="config" ContentType="text/plain"/>
 <Default Extension="json" ContentType="application/json"/>
 <Default Extension="xml" ContentType="application/xml"/>
</Types>`);

  // 2. _rels/.rels
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/core/2015/02/3dmodel"/>
 <Relationship Target="/Metadata/plate_1.png" Id="rel-2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
 <Relationship Target="/Auxiliaries/.thumbnails/thumbnail_3mf.png" Id="rel-3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
</Relationships>`);

  // 3. 3D/_rels/3dmodel.model.rels
  zip.file('3D/_rels/3dmodel.model.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/Objects/object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`);

  // 4. 3D/Objects/object_1.model
  zip.file('3D/Objects/object_1.model', `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
 <metadata name="BambuStudio:3mfVersion">1</metadata>
 <resources>
  <object id="1" p:UUID="00010000-81cb-4c03-9d28-80fed5dfa1dc" type="model">
   <mesh>
    <vertices>
${vXml}    </vertices>
    <triangles>
${tXml}    </triangles>
   </mesh>
  </object>
 </resources>
</model>`);

  // 5. 3D/3dmodel.model
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
  <item objectid="2" p:UUID="00000002-b1ec-4553-aec9-835e5b724bb4" transform="1 0 0 0 1 0 0 0 1 128 128 1.2" printable="1"/>
 </build>
</model>`);

  // 6. Metadata/cut_information.xml
  zip.file('Metadata/cut_information.xml', `<?xml version="1.0" encoding="utf-8"?>
<objects>
 <object id="1">
  <cut_id id="0" check_sum="1" connectors_cnt="0"/>
 </object>
</objects>`);

  // 7. Metadata/model_settings.config
  zip.file('Metadata/model_settings.config', `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <object id="2">
    <metadata key="name" value="Bambu_Custom_Swatch"/>
    <metadata key="extruder" value="1"/>
    <part id="1" subtype="normal_part" uuid="00010000-b206-40ff-9872-83e8017abed1">
      <metadata key="name" value="Custom_Swatch"/>
      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>
      <metadata key="source_file" value="custom_swatch.stl"/>
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
    <metadata key="plater_name" value="Plate 1 - Swatch"/>
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
    <assemble_item object_id="2" instance_id="0" transform="1 0 0 0 1 0 0 0 1 128 128 1.2" offset="0 0 0" />
  </assemble>
</config>`);

  // 8. Metadata/slice_info.config
  zip.file('Metadata/slice_info.config', `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <header>
    <header_item key="X-BBL-Client-Type" value="slicer"/>
    <header_item key="X-BBL-Client-Version" value="02.07.01.62"/>
  </header>
  <plate>
    <metadata key="index" value="1"/>
  </plate>
</config>`);

  // 9. Load base project_settings.config from dump_good
  const projCfg = JSON.parse(fs.readFileSync('/tmp/dump_good/Metadata/project_settings.config', 'utf8'));
  projCfg['version'] = '02.07.01.62';
  projCfg['nozzle_temperature'] = ['220'];
  projCfg['bed_temperature'] = ['55'];
  projCfg['bridge_speed'] = ['50'];
  projCfg['bridge_flow'] = '0.95';
  projCfg['filament_settings_id'] = ['Bambu PLA Basic @BBL X1C'];

  zip.file('Metadata/project_settings.config', JSON.stringify(projCfg, null, 2));

  // 10. Metadata/filament_sequence.json
  zip.file('Metadata/filament_sequence.json', JSON.stringify({
    plate_1: { nozzle_sequence: [], optimal_assignment: [], sequence: [] }
  }));

  const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  zip.file('Metadata/plate_1.png', dummyPng);
  zip.file('Auxiliaries/.thumbnails/thumbnail_3mf.png', dummyPng);

  const outPath = '/tmp/test_csg_swatch.3mf';
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outPath, content);
  console.log(`Generated CSG 3MF at ${outPath} (${content.length} bytes)`);

  const sliceDir = '/tmp/test_csg_slice_out';
  if (fs.existsSync(sliceDir)) fs.rmSync(sliceDir, { recursive: true, force: true });
  fs.mkdirSync(sliceDir);

  const cmd = `/Applications/BambuStudio.app/Contents/MacOS/BambuStudio --slice 0 --outputdir "${sliceDir}" "${outPath}"`;
  console.log(`Running slice verification: ${cmd}`);
  const stdout = execSync(cmd).toString();
  console.log(`CLI output: ${stdout}`);

  const resJsonPath = path.join(sliceDir, 'result.json');
  if (fs.existsSync(resJsonPath)) {
    const res = JSON.parse(fs.readFileSync(resJsonPath, 'utf-8'));
    console.log(`Result: return_code=${res.return_code}, error_string=${res.error_string}`);
    const plate = res.sliced_plates?.[0];
    console.log(`Plate 0 objects: ${plate?.objects?.length}, estimated time: ${(plate?.total_predication / 60).toFixed(1)} min`);
    if (res.return_code === 0 && plate?.objects?.length > 0) {
      console.log('🎉🎉🎉 BAMBU STUDIO CLI VERIFICATION PASSED WITH REAL CSG GEOMETRY!');
    }
  }
}

testCSGSlice().catch(console.error);
