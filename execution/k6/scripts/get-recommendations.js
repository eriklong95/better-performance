import http from "k6/http";
import { check, sleep } from "k6";

export function setup() {
  http.post(`${__ENV.BETTER_BASEURL}/teams`, JSON.stringify({ id: "FC Copenhagen" }), {
    headers: { "Content-Type": "application/json" },
  });
  http.post(`${__ENV.BETTER_BASEURL}/teams`, JSON.stringify({ id: "AGF" }), {
    headers: { "Content-Type": "application/json" },
  });
  http.post(`${__ENV.BETTER_BASEURL}/teams`, JSON.stringify({ id: "Brondby" }), {
    headers: { "Content-Type": "application/json" },
  });
  http.post(`${__ENV.BETTER_BASEURL}/teams`, JSON.stringify({ id: "Midtjylland" }), {
    headers: { "Content-Type": "application/json" },
  });
}

export default function () {
  const response = http.post(
    `${__ENV.BETTER_BASE_URL}/markets`,
    JSON.stringify({ datetime: "2020-01-01T00:00:00Z" }),
    { headers: { "Content-Type": "application/json" } }
  );

  sleep(1);

  const responseBody = response.json();
  const marketId = responseBody.uuid;
  check(response, {
    "status is 200": (r) => r.status == 200,
  });
  check(marketId, {
    "market ID is not empty": (i) => i.length > 0,
  });

  http.get(`${__ENV.BETTER_BASEURL}/markets/${marketId}/recommendations`, {
    headers: { Accept: "application/json" },
  });

  sleep(1);
}
