import http from 'k6/http';
import { check } from 'k6';

export function setup() {
  http.post(`${__ENV.BETTER_BASE_URL}/teams`, JSON.stringify({ id: 'Brondby' }), {
    headers: { 'Content-Type': 'application/json' }
  });
  http.post(`${__ENV.BETTER_BASE_URL}/teams`, JSON.stringify({ id: 'Midtjylland' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export default function () {
  const response = http.post(
    `${__ENV.BETTER_BASE_URL}/markets`,
    JSON.stringify({ datetime: '2020-01-01T00:00:00Z' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const market = response.json();
  const firstGame = market.events[0];
  check(firstGame, {
    'filtering works': (m) => m.homeTeam === 'Brondby' && m.awayTeam === 'Midtjylland'
  });
}
