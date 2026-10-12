# ZoCo service-area county boundary provenance

This site illustrates Sussex and Passaic County outlines for general service-area orientation. It does **not** establish legal boundary lines, contractor service guarantees, parcel extents or travel eligibility. Visitors should contact Henry to confirm service.

## Geometry source and processing

- Source GeoJSON: https://github.com/Camreyn/civicresultmaps/blob/main/data/nj-counties.geojson
- New Jersey geographic boundary reference: https://maps.nj.gov/arcgis/rest/services/Framework/Government_Boundaries/MapServer/1
- Selected the `GEOID` features `34037` (Sussex) and `34031` (Passaic).
- Original polygons contained 2,623 (Sussex) and 6,025 (Passaic) vertices.
- Used geographic coordinates projected to an equirectangular local display using `x = (lon - minLon) * cos(41.1°)`, `y = maxLat - lat`.
- Uniform display scale (827.6467494528383), chart canvas `610 × 490`, x/y padding about 29/23 px.
- Simplified with Ramer–Douglas–Peucker at 0.7 rendered pixels, resulting in 84 Sussex and 139 Passaic vertices; closed SVG shapes.
- Pin and label locations are presentation coordinates within their associated counties; do not represent addresses or business headquarters.

The map is rendered from fixed local SVG paths with no live GIS dependency.
