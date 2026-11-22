# Erste Pipeline mit GitHub Actions

Ein kleines Lernprojekt: Celsius in Fahrenheit umrechnen und das Ergebnis
automatisch testen. Die Tests laufen auf deinem Windows-PC und später auch
bei GitHub auf einem Linux-Runner.

Die erste Pipeline behandelt **Continuous Integration (CI)**. Ein Deployment
(CD) ist eine spätere Erweiterung; diese Pipeline veröffentlicht keine Anwendung.

## 1. Werkzeuge unter Windows vorbereiten

- [Git für Windows](https://git-scm.com/install/windows): speichert die Projektgeschichte.
- [Node.js LTS](https://nodejs.org/en/download): führt JavaScript und die Tests aus.
  Die Pipeline verwendet Node.js 26. Das Beispiel funktioniert auch mit Node.js 24.
- [Visual Studio Code](https://code.visualstudio.com/docs/setup/windows): Editor für die Dateien.
- Ein kostenloses GitHub-Konto für das spätere Hochladen.

Nach der Installation eine neue PowerShell öffnen und prüfen:

```powershell
git --version
node --version
```

Beide Befehle müssen eine Versionsnummer liefern. Anschließend diesen
Projektordner in VS Code über **Datei → Ordner öffnen** auswählen.
Mit **Terminal → Neues Terminal** eine PowerShell im Projektordner öffnen.

## 2. Programm und Tests lokal ausführen

```powershell
node demo.mjs
node --test
```

Erwartet: `20 °C = 68 °F` und vier erfolgreiche Tests, kein fehlgeschlagener Test.

Die Dateien haben jeweils eine Aufgabe:

| Datei | Aufgabe |
| --- | --- |
| `umrechner.mjs` | Enthält die Formel `celsius * 9 / 5 + 32`. |
| `demo.mjs` | Ruft die Funktion mit 20 Grad Celsius auf und zeigt das Ergebnis. |
| `umrechner.test.mjs` | Vergleicht tatsächliche Ergebnisse mit vier bekannten Sollwerten. |
| `.github/workflows/ci.yml` | Beschreibt den automatischen Ablauf bei GitHub. |

`assert.equal(tatsaechlich, erwartet)` lässt einen Test fehlschlagen,
wenn die Werte verschieden sind. `node --test` findet die Testdatei automatisch.
Die Endung `.mjs` kennzeichnet JavaScript-Module, die `import` und `export` verwenden.
Der Test-Runner ist in Node.js enthalten; zusätzliche Pakete sind nicht erforderlich.

## 3. Ein lokales Git-Repository anlegen

Die Befehle in der PowerShell im Projektordner ausführen. Die Werte
`DEIN_ANZEIGENAME` und `DEINE_COMMIT_EMAIL` zuerst durch eigene Angaben ersetzen.
Die von GitHub angezeigte noreply-Adresse findest du unter
[Settings → Emails](https://github.com/settings/emails).
Diese Git-Einstellungen gelten nur für dieses Projekt.

```powershell
git init -b main
git config user.name "DEIN_ANZEIGENAME"
git config user.email "DEINE_COMMIT_EMAIL"
git status
git add .
git commit -m "Temperaturumrechner mit Tests und CI anlegen"
```

`git add` merkt die Dateien für den nächsten gespeicherten Stand vor.
`git commit` speichert diesen Stand lokal; damit ist noch nichts hochgeladen.

## 4. Ein öffentliches Übungsrepository erstellen und hochladen

1. Bei GitHub anmelden und [ein neues Repository](https://github.com/new) anlegen.
2. Als Namen beispielsweise `ci-cd-training` wählen.
3. **Public** auswählen. Damit sind Code und Projektgeschichte öffentlich sichtbar.
4. README, .gitignore und Lizenz bei GitHub nicht hinzufügen: Der erste Stand kommt vom PC.
5. **Create repository** anklicken und die angezeigte HTTPS-Adresse kopieren.

Dann `DEIN_BENUTZERNAME` in der folgenden Adresse ersetzen; bei einem anderen
Repositorynamen auch `ci-cd-training` anpassen:

```powershell
git remote add origin https://github.com/DEIN_BENUTZERNAME/ci-cd-training.git
git push -u origin main
```

Git für Windows kann über den Git Credential Manager eine Browseranmeldung
öffnen. Dort mit deinem GitHub-Konto anmelden. Die Verbindung eines GitHub-Kontos
mit einem anderen Programm ersetzt diese lokale Git-Anmeldung nicht automatisch.
Wenn stattdessen eine unerwartete Passwort- oder Fehlermeldung erscheint,
den Wortlaut prüfen lassen. Das normale GitHub-Passwort funktioniert nicht als
Passwort für Git-Zugriffe über HTTPS.

## 5. Die erste Pipeline ansehen und verstehen

Im Repository den Tab **Actions** öffnen und den Lauf **Meine erste CI-Pipeline**
auswählen. Im Job **Temperaturumrechner testen** die drei Schritte öffnen:

1. **Projekt herunterladen:** `actions/checkout` holt den Code auf den Runner.
2. **Node.js vorbereiten:** `actions/setup-node` stellt Node.js 26 bereit.
3. **Automatische Tests ausfuehren:** `node --test` prüft denselben Code wie lokal.

Ein grüner Lauf bedeutet, dass alle konfigurierten Schritte erfolgreich waren.
Die Pipeline selbst wird erst nach dem Hochladen von GitHub ausgeführt.

Die wichtigsten Einstellungen in `ci.yml`:

| Einstellung | Bedeutung |
| --- | --- |
| `on: push` | Nach jedem Push automatisch starten. |
| `pull_request` | Auch Änderungsvorschläge zum Zweig `main` prüfen. |
| `workflow_dispatch` | Zusätzlich über **Run workflow** manuell starten. |
| `runs-on: ubuntu-latest` | Einen von GitHub bereitgestellten Linux-Runner nutzen. |
| `permissions: contents: read` | Der Workflow benötigt nur Lesezugriff auf den Code. |
| `timeout-minutes: 5` | Einen unerwartet langen Job nach fünf Minuten abbrechen. |
| `uses` | Einen fertigen Automatisierungsbaustein verwenden. |
| `run` | Einen Befehl ausführen. |

Einrückungen sind in YAML Teil der Struktur. Beim Bearbeiten Leerzeichen verwenden.
Eine fehlgeschlagene Prüfung führt hier zu einem roten Lauf; sie verhindert
allein noch keine späteren Commits oder das Zusammenführen eines Pull Requests.

## 6. Einen Fehler erkennen und reparieren

Erst durchführen, wenn der erste GitHub-Lauf erfolgreich war.

1. In `umrechner.mjs` absichtlich `+ 32` durch `+ 30` ersetzen und speichern.
2. Mit `node --test` die Fehler lokal ansehen: Alle vier Tests müssen fehlschlagen.
3. Den absichtlichen Fehler hochladen, um einen roten Lauf kennenzulernen:

```powershell
git add umrechner.mjs
git commit -m "Absichtlichen Rechenfehler zum Lernen einbauen"
git push
```

4. Unter **Actions** den Fehler im Testschritt ansehen. Die Meldung zeigt
   den tatsächlichen und den erwarteten Wert.
5. Die Formel wieder auf `+ 32` korrigieren und speichern.
6. `node --test` ausführen. Sobald alle vier Tests erfolgreich sind:

```powershell
git add umrechner.mjs
git commit -m "Umrechnungsformel korrigieren"
git push
```

Der nächste Lauf soll wieder grün sein. Eine anschließende Übung wäre ein
eigener Entwicklungszweig mit Pull Request; später folgt das Deployment.

## Kostenloser Umfang und Dokumentation

Für dieses öffentliche Lernrepository nutzt die Pipeline einen kostenlosen
Standard-Runner und speichert keine zusätzlichen Build-Artefakte oder Caches.
Kostenpflichtige größere Runner sind für die Übung nicht erforderlich.

- [GitHub Actions: Grundlagen](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [GitHub Actions: Abrechnung](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- [Checkout-Action](https://github.com/actions/checkout)
- [Setup-Node-Action](https://github.com/actions/setup-node)
- [GitHub: Neues Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)

Die Action-Versionen und Installationshinweise wurden am 22. November 2026 geprüft.
