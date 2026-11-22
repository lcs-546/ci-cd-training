import { mkdir, copyFile } from 'node:fs/promises';

const dateien = [
  'index.html',
  'styles.css',
  'app.mjs',
  'umrechner.mjs',
];

const zielordner = new URL('./dist/', import.meta.url);

await mkdir(zielordner, { recursive: true });

for (const datei of dateien) {
  const quelle = new URL(datei, import.meta.url);
  const ziel = new URL(datei, zielordner);

  await copyFile(quelle, ziel);
  console.log(`Kopiert: ${datei}`);
}

console.log(`Build erfolgreich: ${dateien.length} Dateien in dist/`);