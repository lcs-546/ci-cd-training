// Eine kleine Funktion, deren Verhalten wir automatisch pruefen koennen.
export function celsiusZuFahrenheit(celsius) {
  return celsius * 9 / 5 + 30;
}

export function fahrenheitZuCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}