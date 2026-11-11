import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';

async function test3MFGeneration() {
  const zip = new JSZip();

  // Basic box mesh
  // 8 vertices for a 50x30x2mm card
  const w = 50, d = 30, h = 2;
  const vertices = [
    [-w/2, -d/2, 0], [w/2, -d/2, 0], [w/2, d/2, 0], [-w/2, d/2, 0],
    [-w/2, -d/2, h], [w/2, -d/2, h], [w/2, d/2, h], [-w/2, d/2, h],
  ];
  const triangles = [
    [0, 2, 1], [0, 3, 2], // bottom
    [4, 5, 6], [4, 6, 7], // top
    [0, 1, 5], [0, 5, 4], // front
    [2, 3, 7], [2, 7, 6], // back
    [0, 4, 7], [0, 7, 3], // left
    [1, 2, 6], [1, 6, 5], // right
  ];

  let vXml = vertices.map(v => `     <vertex x="${v[0].toFixed(4)}" y="${v[1].toFixed(4)}" z="${v[2].toFixed(4)}" />`).join('\n');
  let tXml = triangles.map(t => `     <triangle v1="${t[0]}" v2="${t[1]}" v3="${t[2]}" />`).join('\n');

  // 1. [Content_Types].xml
  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
 <Default Extension="png" ContentType="image/png"/>
 <Default Extension="config" ContentType="text/plain"/>
 <Default Extension="json" ContentType="application/json"/>
 <Default Extension="xml" ContentType="application/xml"/>
</Types>`;

  // 2. _rels/.rels
  const rootRels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/core/2015/02/3dmodel"/>
 <Relationship Target="/Metadata/plate_1.png" Id="rel-2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
 <Relationship Target="/Auxiliaries/.thumbnails/thumbnail_3mf.png" Id="rel-3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
</Relationships>`;

  // 3. 3D/_rels/3dmodel.model.rels
  const modelRels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/Objects/object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`;

  // 4. 3D/Objects/object_1.model
  const object1Model = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
 <metadata name="BambuStudio:3mfVersion">1</metadata>
 <resources>
  <object id="1" p:UUID="00010000-81cb-4c03-9d28-80fed5dfa1dc" type="model">
   <mesh>
    <vertices>
${vXml}
    </vertices>
    <triangles>
${tXml}
    </triangles>
   </mesh>
  </object>
 </resources>
</model>`;

  // 5. 3D/3dmodel.model
  const model3D = `<?xml version="1.0" encoding="UTF-8"?>
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
</model>`;

  // 6. Metadata/cut_information.xml
  const cutInfo = `<?xml version="1.0" encoding="utf-8"?>
<objects>
 <object id="1">
  <cut_id id="0" check_sum="1" connectors_cnt="0"/>
 </object>
</objects>`;

  // 7. Metadata/model_settings.config
  const modelSettings = `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <object id="2">
    <metadata key="name" value="Bambu_Test_Card"/>
    <metadata key="extruder" value="1"/>
    <part id="1" subtype="normal_part" uuid="00010000-b206-40ff-9872-83e8017abed1">
      <metadata key="name" value="Test_Card"/>
      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>
      <metadata key="source_file" value="test_card.stl"/>
      <metadata key="source_object_id" value="0"/>
      <metadata key="source_volume_id" value="0"/>
      <metadata key="source_offset_x" value="0"/>
      <metadata key="source_offset_y" value="0"/>
      <metadata key="source_offset_z" value="0"/>
      <metadata key="extruder" value="1"/>
      <mesh_stat face_count="${triangles.length}" edges_fixed="0" degenerate_facets="0" facets_removed="0" facets_reversed="0" backwards_edges="0"/>
    </part>
  </object>
  <plate>
    <metadata key="plater_id" value="1"/>
    <metadata key="plater_name" value="Plate 1 - Test Card"/>
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
</config>`;

  // 8. Metadata/slice_info.config
  const sliceInfo = `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <header>
    <header_item key="X-BBL-Client-Type" value="slicer"/>
    <header_item key="X-BBL-Client-Version" value="02.07.01.62"/>
  </header>
  <plate>
    <metadata key="index" value="1"/>
  </plate>
</config>`;

  // 9. Metadata/project_settings.config
  const projectSettings = {
    version: "02.07.01.62",
    printer_settings_id: "Bambu Lab X1 Carbon 0.4 nozzle",
    print_settings_id: "0.20mm Standard @BBL X1C",
    filament_settings_id: ["Bambu PLA Basic @BBL X1C"],
    nozzle_temperature: ["220"],
    nozzle_temperature_initial_layer: ["220"],
    bed_temperature: ["55"],
    bed_temperature_initial_layer: ["55"],
    bridge_speed: ["50"],
    bridge_flow: "0.95",
    flow_ratio: ["0.98"],
    sparse_infill_density: "15%",
    sparse_infill_pattern: "gyroid",
    enable_support: "0"
  };

  // 10. Metadata/filament_sequence.json
  const filSeq = {
    plate_1: {
      nozzle_sequence: [],
      optimal_assignment: [],
      sequence: []
    }
  };

  // 1x1 transparent PNG buffer
  const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

  zip.file('[Content_Types].xml', contentTypes);
  zip.file('_rels/.rels', rootRels);
  zip.file('3D/_rels/3dmodel.model.rels', modelRels);
  zip.file('3D/Objects/object_1.model', object1Model);
  zip.file('3D/3dmodel.model', model3D);
  zip.file('Metadata/cut_information.xml', cutInfo);
  zip.file('Metadata/model_settings.config', modelSettings);
  zip.file('Metadata/slice_info.config', sliceInfo);
  zip.file('Metadata/project_settings.config', JSON.stringify(projectSettings, null, 2));
  zip.file('Metadata/filament_sequence.json', JSON.stringify(filSeq));
  zip.file('Metadata/plate_1.png', dummyPng);
  zip.file('Auxiliaries/.thumbnails/thumbnail_3mf.png', dummyPng);

  const outPath = '/tmp/test_web_swatch.3mf';
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outPath, content);
  console.log(`Generated test 3MF at ${outPath} (${content.length} bytes)`);

  const sliceDir = '/tmp/test_swatch_slice';
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
      console.log('✅ BAMBU STUDIO CLI VERIFICATION PASSED!');
    } else {
      console.error('❌ BAMBU STUDIO CLI VERIFICATION FAILED!');
    }
  } else {
    console.error('❌ result.json not found!');
  }
}

test3MFGeneration().catch(console.error);
