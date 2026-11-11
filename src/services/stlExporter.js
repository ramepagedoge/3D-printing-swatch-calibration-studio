/**
 * Exports a Three.js BufferGeometry to a Binary STL Blob
 */
export function exportToSTL(geometry) {
  const nonIndexed = geometry.toNonIndexed();
  const pos = nonIndexed.attributes.position.array;
  const triCount = pos.length / 9;

  // Binary STL header: 80 bytes header + 4 bytes triCount + 50 bytes per triangle
  const bufferLength = 84 + triCount * 50;
  const buffer = new ArrayBuffer(bufferLength);
  const dataView = new DataView(buffer);

  // 80 bytes header (leave as zeroes)
  // Triangle count at offset 80
  dataView.setUint32(80, triCount, true);

  let offset = 84;
  for (let i = 0; i < triCount; i++) {
    const v1 = i * 3;
    const v2 = i * 3 + 1;
    const v3 = i * 3 + 2;

    const ax = pos[v1 * 3], ay = pos[v1 * 3 + 1], az = pos[v1 * 3 + 2];
    const bx = pos[v2 * 3], by = pos[v2 * 3 + 1], bz = pos[v2 * 3 + 2];
    const cx = pos[v3 * 3], cy = pos[v3 * 3 + 1], cz = pos[v3 * 3 + 2];

    // Compute Face Normal
    const abx = bx - ax, aby = by - ay, abz = bz - az;
    const acx = cx - ax, acy = cy - ay, acz = cz - az;
    let nx = aby * acz - abz * acy;
    let ny = abz * acx - abx * acz;
    let nz = abx * acy - aby * acx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (len > 0) {
      nx /= len;
      ny /= len;
      nz /= len;
    }

    // Normal
    dataView.setFloat32(offset, nx, true); offset += 4;
    dataView.setFloat32(offset, ny, true); offset += 4;
    dataView.setFloat32(offset, nz, true); offset += 4;

    // Vertex 1
    dataView.setFloat32(offset, ax, true); offset += 4;
    dataView.setFloat32(offset, ay, true); offset += 4;
    dataView.setFloat32(offset, az, true); offset += 4;

    // Vertex 2
    dataView.setFloat32(offset, bx, true); offset += 4;
    dataView.setFloat32(offset, by, true); offset += 4;
    dataView.setFloat32(offset, bz, true); offset += 4;

    // Vertex 3
    dataView.setFloat32(offset, cx, true); offset += 4;
    dataView.setFloat32(offset, cy, true); offset += 4;
    dataView.setFloat32(offset, cz, true); offset += 4;

    // 2 bytes attribute byte count
    dataView.setUint16(offset, 0, true); offset += 2;
  }

  return new Blob([buffer], { type: 'application/octet-stream' });
}
