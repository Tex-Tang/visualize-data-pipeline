import { ConsumerNode } from "./ConsumerNode";
import { ExchangeNode } from "./ExchangeNode";
import { QueueNode } from "./QueueNode";

export const nodeTypes = {
  exchange: ExchangeNode,
  queue: QueueNode,
  consumer: ConsumerNode,
};
