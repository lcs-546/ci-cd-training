// Lokale Vorschau: node server.mjs
// Nur die Website-Dateien werden ausgeliefert; der Server ist an localhost gebunden.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const dateien = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/app.mjs', ['app.mjs', 'text/javascript']],
  ['/umrechner.mjs', ['umrechner.mjs', 'text/javascript']],
]);

const server = createServer(async (anfrage, antwort) => {
  if (anfrage.method !== 'GET' && anfrage.method !== 'HEAD') {
    antwort.writeHead(405, { Allow: 'GET, HEAD' });
    antwort.end();
    return;
  }

  const pfad = new URL(anfrage.url, 'http://127.0.0.1').pathname;
  const datei = dateien.get(pfad);
  if (!datei) {
    antwort.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    antwort.end('Datei nicht gefunden.');
    return;
  }

  try {
    const inhalt = await readFile(new URL(datei[0], import.meta.url));
    antwort.writeHead(200, {
      'Content-Type': `${datei[1]}; charset=utf-8`,
      'Cache-Control': 'no-store',
    });
    antwort.end(anfrage.method === 'HEAD' ? undefined : inhalt);
  } catch (fehler) {
    antwort.writeHead(fehler.code === 'ENOENT' ? 404 : 500, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    antwort.end('Datei konnte nicht geladen werden.');
  }
});

server.on('error', (fehler) => {
  console.error(fehler.code === 'EADDRINUSE'
    ? 'Port 3000 ist bereits belegt. Beende zuerst den dort laufenden Server.'
    : `Vorschauserver konnte nicht starten: ${fehler.message}`);
  process.exitCode = 1;
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Vorschau: http://127.0.0.1:3000');
  console.log('Dieses Fenster offen lassen. Beenden mit Strg + C.');
});
