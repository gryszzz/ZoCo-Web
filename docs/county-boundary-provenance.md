# ZoCo county outline source and accuracy

The homepage uses **U.S. Census Bureau 2026 TIGERweb State_County county geometry**, January 1, 2026 vintage, to depict Sussex County (GEOID `34037`) and Passaic County (GEOID `34031`).

- Official source: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/11
- Query: `GEOID IN ('34031','34037')`; WGS 84 GeoJSON geometry.
- Coordinates were projected locally for screen display with `x=longitude*cos(41.1°)`, `y=-latitude`, preserving a uniform x/y drawing scale.
- Original source polygon rings: Sussex 2623 vertices, Passaic 6025 vertices.
- Geometry simplified with a **0.58-screen-pixel** Ramer–Douglas–Peucker tolerance to 96 vertices (Sussex) and 159 vertices (Passaic); output fixed SVG viewBox `610 × 490`.
- Both visual pins are verified to fall inside their corresponding polygon but **do not mark the business address**.
- The county paths themselves link to local service pages. Town mentions are examples, **not guarantees of individual job eligibility**.

These generalized visual boundaries are for orientation only; they are not parcel-level or legally surveyed boundaries. Call or text ZoCo to confirm travel and availability.
