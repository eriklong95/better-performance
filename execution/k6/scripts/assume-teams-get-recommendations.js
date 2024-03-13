import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    first_scenario: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: "5s",
    },
  },
};

export default function () {
  const response = http.post(
    `${__ENV.BETTER_BASEURL}/markets`,
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
