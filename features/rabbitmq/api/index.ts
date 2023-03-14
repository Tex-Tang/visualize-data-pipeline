import { RMQBinding, RMQConsumer, RMQExchange, RMQQueue } from "../types";

async function request(url: string): Promise<any> {
  const host = JSON.parse(localStorage.getItem("host") || "");
  const username = JSON.parse(localStorage.getItem("username") || "");
  const password = JSON.parse(localStorage.getItem("password") || "");

  const response = await fetch("/api/proxy", {
    method: "POST",
    body: JSON.stringify({
      url: `${host}${url}`,
      options: {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      },
    }),
  });
  const data = await response.json();
  return data;
}

export async function listExchanges() {
  return request("/api/exchanges") as Promise<RMQExchange[]>;
}

export async function listQueues() {
  return request("/api/queues") as Promise<RMQQueue[]>;
}

export async function listBindings() {
  return request("/api/bindings") as Promise<RMQBinding[]>;
}

export async function listConsumers() {
  return request("/api/consumers") as Promise<RMQConsumer[]>;
}
