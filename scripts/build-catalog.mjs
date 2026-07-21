import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const repository = 'https://github.com/YAN555999/deepswapai-open-research';
const catalogId = 'https://deepswapai.com/research#catalog';
const license = 'https://creativecommons.org/licenses/by/4.0/';

const specs = [
  {
    json: 'data/input-readiness-v1.json',
    csv: 'data/input-readiness-v1.csv',
    bib: 'data/input-readiness-v1.bib',
    canonical: 'https://deepswapai.com/research',
    jsonUrl: 'https://deepswapai.com/assets/readiness-benchmark/input-readiness-v1.json',
    csvUrl: 'https://deepswapai.com/assets/readiness-benchmark/input-readiness-v1.csv',
    bibUrl: 'https://deepswapai.com/assets/readiness-benchmark/input-readiness-v1.bib',
    evidenceBoundary: 'Input-image measurements only; no face swap output was generated or scored.',
  },
  {
    json: 'data/face-swap-output-scorecard-v1.json',
    csv: 'data/face-swap-output-scorecard-v1.csv',
    bib: 'data/face-swap-output-scorecard-v1.bib',
    canonical: 'https://deepswapai.com/face-swap-quality-scorecard',
    jsonUrl: 'https://deepswapai.com/assets/quality-scorecard/face-swap-output-scorecard-v1.json',
    csvUrl: 'https://deepswapai.com/assets/quality-scorecard/face-swap-output-scorecard-v1.csv',
    bibUrl: 'https://deepswapai.com/assets/quality-scorecard/face-swap-output-scorecard-v1.bib',
    evidenceBoundary: 'Structured human review of one output; not a biometric identity metric, provider ranking, or success-rate benchmark.',
  },
];

function bytes(relativePath) {
  return fs.readFileSync(path.join(root, relativePath));
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function quoteCsv(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function dataFile(relativePath, mediaType) {
  const body = bytes(relativePath);
  return {
    path: relativePath,
    bytes: body.length,
    sha256: sha256(body),
    mediaType,
  };
}

const records = specs.map((spec) => {
  const document = JSON.parse(bytes(spec.json));
  if (document.identifier !== document.id || document.version !== '1.0.0') {
    throw new Error(`Unexpected dataset identity in ${spec.json}`);
  }
  if (document.license !== license || document.isAccessibleForFree !== true) {
    throw new Error(`Missing open-data contract in ${spec.json}`);
  }
  return { ...spec, document };
});

const catalog = {
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  '@id': catalogId,
  name: 'DeepSwapAI face swap research data catalog',
  description: 'Versioned input-readiness measurements and a separate structured output-review protocol with explicit evidence boundaries.',
  url: catalogId,
  sameAs: repository,
  version: '1.0.0',
  datePublished: '2026-07-22',
  dateModified: '2026-07-22',
  license,
  isAccessibleForFree: true,
  publisher: {
    '@type': 'Organization',
    '@id': 'https://deepswapai.com/#organization',
    name: 'DeepSwapAI',
    url: 'https://deepswapai.com/',
  },
  dataset: records.map(({ document, ...spec }) => ({
    '@type': 'Dataset',
    '@id': `${spec.canonical}#dataset`,
    identifier: document.identifier,
    name: document.title,
    alternateName: document.alternateName,
    description: document.description,
    version: document.version,
    datePublished: document.datePublished,
    dateModified: document.dateModified,
    url: spec.canonical,
    sameAs: `${repository}/blob/main/${spec.json}`,
    license,
    isAccessibleForFree: true,
    includedInDataCatalog: { '@id': catalogId },
    creator: { '@id': 'https://deepswapai.com/#organization' },
    publisher: { '@id': 'https://deepswapai.com/#organization' },
    citation: spec.bibUrl,
    abstract: spec.evidenceBoundary,
    distribution: [
      {
        '@type': 'DataDownload',
        name: `${document.title} JSON`,
        encodingFormat: 'application/json',
        contentSize: `${dataFile(spec.json, 'application/json').bytes} bytes`,
        contentUrl: spec.jsonUrl,
        sameAs: `${repository}/blob/main/${spec.json}`,
      },
      {
        '@type': 'DataDownload',
        name: `${document.title} CSV`,
        encodingFormat: 'text/csv',
        contentSize: `${dataFile(spec.csv, 'text/csv').bytes} bytes`,
        contentUrl: spec.csvUrl,
        sameAs: `${repository}/blob/main/${spec.csv}`,
      },
    ],
  })),
};

const catalogJson = `${JSON.stringify(catalog, null, 2)}\n`;
const catalogColumns = [
  'identifier',
  'title',
  'version',
  'datePublished',
  'dateModified',
  'canonicalUrl',
  'jsonUrl',
  'csvUrl',
  'citationUrl',
  'license',
  'evidenceBoundary',
];
const catalogRows = records.map(({ document, ...spec }) => [
  document.identifier,
  document.title,
  document.version,
  document.datePublished,
  document.dateModified,
  spec.canonical,
  spec.jsonUrl,
  spec.csvUrl,
  spec.bibUrl,
  license,
  spec.evidenceBoundary,
]);
const catalogCsv = `${[catalogColumns, ...catalogRows].map((row) => row.map(quoteCsv).join(',')).join('\n')}\n`;

const resourceMediaTypes = new Map([
  ['.json', 'application/json'],
  ['.csv', 'text/csv'],
  ['.bib', 'application/x-bibtex'],
]);
const dataPaths = specs.flatMap(({ json, csv, bib }) => [json, csv, bib]);
const resources = dataPaths.map((relativePath) => {
  const metadata = dataFile(relativePath, resourceMediaTypes.get(path.extname(relativePath)));
  return {
    name: path.basename(relativePath, path.extname(relativePath)),
    path: relativePath,
    profile: 'data-resource',
    format: path.extname(relativePath).slice(1),
    mediatype: metadata.mediaType,
    bytes: metadata.bytes,
    hash: `sha256:${metadata.sha256}`,
  };
});
const dataPackage = {
  profile: 'data-package',
  name: 'deepswapai-face-swap-research-catalog',
  title: 'DeepSwapAI Face Swap Research Data Catalog',
  id: catalogId,
  version: '1.0.0',
  homepage: catalogId,
  repository,
  created: '2026-07-22',
  licenses: [{ name: 'CC-BY-4.0', path: license, title: 'Creative Commons Attribution 4.0 International' }],
  resources,
};
const dataPackageJson = `${JSON.stringify(dataPackage, null, 2)}\n`;

const generated = new Map([
  ['catalog/research-catalog-v1.json', catalogJson],
  ['catalog/research-catalog-v1.csv', catalogCsv],
  ['datapackage.json', dataPackageJson],
]);
const fixedArtifacts = [
  ...dataPaths,
  'CITATION.cff',
  'LICENSE',
  'NOTICE.md',
];
const artifactInputs = new Map(fixedArtifacts.map((relativePath) => [relativePath, bytes(relativePath)]));
for (const [relativePath, value] of generated) artifactInputs.set(relativePath, Buffer.from(value));

const manifest = {
  schemaVersion: '1.0',
  id: 'deepswapai-open-research-v1.0.0',
  version: '1.0.0',
  datePublished: '2026-07-22',
  canonicalCatalog: catalogId,
  repository,
  publisher: 'DeepSwapAI Product Team',
  evidenceBoundary: 'First-party publisher mirror; not an independent audit, certification, biometric benchmark, or provider leaderboard.',
  artifacts: [...artifactInputs.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([relativePath, value]) => ({
    path: relativePath,
    bytes: value.length,
    sha256: sha256(value),
  })),
};
const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
generated.set('manifest-v1.0.0.json', manifestJson);

const checksumInputs = new Map(artifactInputs);
checksumInputs.set('manifest-v1.0.0.json', Buffer.from(manifestJson));
const checksumFile = `${[...checksumInputs.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([relativePath, value]) => `${sha256(value)}  ${relativePath}`)
  .join('\n')}\n`;
generated.set('SHA256SUMS', checksumFile);

for (const [relativePath, expected] of generated) {
  const absolutePath = path.join(root, relativePath);
  if (checkOnly) {
    if (!fs.existsSync(absolutePath) || fs.readFileSync(absolutePath, 'utf8') !== expected) {
      throw new Error(`${relativePath} is missing or stale; run npm run build:catalog`);
    }
  } else {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, expected);
  }
}

console.log(`${checkOnly ? 'Verified' : 'Generated'} ${records.length} datasets and ${checksumInputs.size} checksummed artifacts.`);
