# DeepSwapAI open research and data catalog

[![Verify research archive](https://github.com/YAN555999/deepswapai-open-research/actions/workflows/verify.yml/badge.svg)](https://github.com/YAN555999/deepswapai-open-research/actions/workflows/verify.yml)

This repository is the public, version-pinned mirror of DeepSwapAI's face swap
research data catalog. The canonical human-readable publications remain on
DeepSwapAI. This mirror provides stable machine-readable files, checksums,
citation metadata, and a public correction history.

- Canonical catalog: <https://deepswapai.com/research#catalog>
- Canonical catalog JSON-LD: <https://deepswapai.com/research-catalog.json>
- Canonical catalog CSV: <https://deepswapai.com/research-catalog.csv>
- Input benchmark: <https://deepswapai.com/research>
- Output review protocol: <https://deepswapai.com/face-swap-quality-scorecard>
- Versioned release: <https://github.com/YAN555999/deepswapai-open-research/releases/tag/v1.0.1>
- License: [CC BY 4.0](LICENSE), subject to [NOTICE.md](NOTICE.md)

## Included datasets

| Dataset | Evidence boundary | Canonical record | Mirror |
| --- | --- | --- | --- |
| Controlled Image Input-Readiness Benchmark v1 | Six controlled input variants and decoded-pixel measurements; no face swap output was generated or scored | [Method, data, and limitations](https://deepswapai.com/research) | [JSON](data/input-readiness-v1.json), [CSV](data/input-readiness-v1.csv), [BibTeX](data/input-readiness-v1.bib) |
| Face Swap Output Quality Scorecard v1 | A transparent human-review rubric for one output; not a biometric identity metric, provider ranking, or success-rate benchmark | [Protocol and local tool](https://deepswapai.com/face-swap-quality-scorecard) | [JSON](data/face-swap-output-scorecard-v1.json), [CSV](data/face-swap-output-scorecard-v1.csv), [BibTeX](data/face-swap-output-scorecard-v1.bib) |

The catalog is available as [JSON-LD](catalog/research-catalog-v1.json) and
[CSV](catalog/research-catalog-v1.csv). [datapackage.json](datapackage.json)
provides a machine-readable inventory of every mirrored resource.

## Integrity and releases

[SHA256SUMS](SHA256SUMS) binds each published data file, catalog record,
citation document, notice, data package, and release manifest to exact bytes.
Run the same deterministic check used by GitHub Actions:

```bash
npm test
```

Published release tags are immutable. Corrections receive a new version,
updated checksums, and an explicit history instead of silently rewriting a
published release.

## Interpretation limits

- This is a first-party, publisher-controlled mirror, not an independent audit or endorsement.
- The input-readiness benchmark does not measure final realism, identity accuracy, speed, or provider quality.
- The output scorecard records visible human-review criteria and is not a face-recognition or biometric measurement.
- No customer uploads, account records, identity embeddings, generated customer media, or private production data are included.
- Referenced sample images remain DeepSwapAI-owned and are not relicensed for unrelated reuse.

Read the canonical method and limitations before using a result outside its
stated scope.

## Citation

Use [CITATION.cff](CITATION.cff), the dataset-specific BibTeX record, or cite:

> DeepSwapAI Product Team (2026). *DeepSwapAI Face Swap Research Data Catalog* (Archive Version 1.0.1). <https://deepswapai.com/research#catalog>

When using one dataset, cite its identifier, version, canonical landing page,
and the artifact SHA-256 when exact reproduction matters.

## Corrections and reuse

Open a [data correction issue](https://github.com/YAN555999/deepswapai-open-research/issues/new?template=data-correction.yml)
with the affected file, field, evidence URL, and proposed correction. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the versioning policy.

Attribution must name **DeepSwapAI Product Team**, identify the dataset and
version, and link its canonical record. See [NOTICE.md](NOTICE.md) for the
sample-image and third-party rights boundary.
