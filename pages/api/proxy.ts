import { Exchange } from "@/types/rabbitmq";
import type { NextApiRequest, NextApiResponse } from "next";

export type ProxyRequest = {
  url: string;
  options: RequestInit;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Exchange[] | any>) {
  if (req.method === "POST") {
    const { url, options } = JSON.parse(req.body) as ProxyRequest;
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({
        url,
        options,
        error: error.message,
      });
    }
  }
  return res.status(405).end();
}
