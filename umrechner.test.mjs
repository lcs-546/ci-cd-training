import test from 'node:test';
import assert from 'node:assert/strict';
import { celsiusZuFahrenheit, fahrenheitZuCelsius } from './umrechner.mjs';

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

test('32 Grad Fahrenheit entsprechen 0 Grad Celsius', () => {
  assert.equal(fahrenheitZuCelsius(32), 0);
});

test('212 Grad Fahrenheit entsprechen 100 Grad Celsius', () => {
  assert.equal(fahrenheitZuCelsius(212), 100);
});

test('Minus 40 Grad Fahrenheit entsprechen minus 40 Grad Celsius', () => {
  assert.equal(fahrenheitZuCelsius(-40), -40);
});