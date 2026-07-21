# Contributing

This repository accepts narrowly scoped corrections to data, metadata,
citations, checksums, documentation, and reproducibility checks.

## Report a correction

Use the data correction issue template and include:

1. The affected file and field.
2. The current value.
3. The proposed value.
4. A primary evidence URL or reproducible calculation.
5. Whether the correction changes a published interpretation.

Do not upload customer media, personal data, credentials, face embeddings, or
private production logs.

## Change policy

- Typographical documentation fixes may remain within the current data version.
- Data, formula, evidence-boundary, or interpretation changes require a new version.
- Published release tags are not rewritten.
- Generated catalog files, the manifest, and SHA256SUMS must be rebuilt with
  `npm run build:catalog`.
- `npm test` must pass before a pull request is merged.

The canonical landing page must be updated when a correction changes the
human-readable method or limitation.
