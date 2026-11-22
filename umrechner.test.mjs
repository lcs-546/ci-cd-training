import test from 'node:test';
import assert from 'node:assert/strict';
import { celsiusZuFahrenheit } from './umrechner.mjs';

test('0 Grad Celsius entsprechen 32 Grad Fahrenheit', () => {
  assert.equal(celsiusZuFahrenheit(0), 32);
});

test('100 Grad Celsius entsprechen 212 Grad Fahrenheit', () => {
  assert.equal(celsiusZuFahrenheit(100), 212);
});

test('Bei minus 40 Grad stimmen beide Skalen ueberein', () => {
  assert.equal(celsiusZuFahrenheit(-40), -40);
});

test('Auch Temperaturen mit Nachkommastellen werden umgerechnet', () => {
  assert.equal(celsiusZuFahrenheit(37.5), 99.5);
});
