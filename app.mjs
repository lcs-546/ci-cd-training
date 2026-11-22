import {
  celsiusZuFahrenheit,
  fahrenheitZuCelsius,
} from './umrechner.mjs';

const formular = document.querySelector('#umrechner-form');
const eingabe = document.querySelector('#temperatur');
const ausgabe = document.querySelector('#ergebnis');

const zahlenformat = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 2,
});

formular.addEventListener('submit', (ereignis) => {
  ereignis.preventDefault();

  const temperatur = eingabe.valueAsNumber;

  if (!Number.isFinite(temperatur)) {
    ausgabe.textContent = 'Bitte gib eine gültige Zahl ein.';
    return;
  }

  const richtung = new FormData(formular).get('richtung');
  const nachFahrenheit = richtung === 'c-f';

  const ergebnis = nachFahrenheit
    ? celsiusZuFahrenheit(temperatur)
    : fahrenheitZuCelsius(temperatur);

  if (!Number.isFinite(ergebnis)) {
    ausgabe.textContent = 'Die Zahl ist für die Berechnung zu groß.';
    return;
  }

  const von = nachFahrenheit ? '°C' : '°F';
  const nach = nachFahrenheit ? '°F' : '°C';

  ausgabe.textContent =
    `${zahlenformat.format(temperatur)} ${von} = ` +
    `${zahlenformat.format(ergebnis)} ${nach}`;
});