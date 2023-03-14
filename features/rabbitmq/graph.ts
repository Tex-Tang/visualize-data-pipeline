import { groupBy, keyBy, unionBy } from "lodash";
import { Edge, Node } from "reactflow";
import { listBindings, listConsumers, listExchanges, listQueues } from "./api";
import { BindingNodeData, ConsumerNodeData, ExchangeNodeData, QueueNodeData } from "./types";

export type Patterns = RegExp[];

function getPatternName(pattern: RegExp) {
  return pattern.source;
}

export async function listExchangeNodes(): Promise<Node<ExchangeNodeData>[]> {
  const rmqExchanges = await listExchanges();
  return rmqExchanges
    .filter((exchange) => exchange.name !== "")
    .map((exchange) => ({
      id: exchange.name,
      type: "exchange",
      data: {
        id: exchange.name,
        name: exchange.name,
        type: exchange.type,
      },
      position: { x: 0, y: 0 },
    }));
}

export async function listConsumerNodes(patterns: Patterns): Promise<{
  nodes: Node<ConsumerNodeData>[];
  edges: Edge[];
}> {
  const rmqConsumers = await listConsumers().then((consumers) =>
    consumers.map((consumer) => {
      const pattern = patterns.find((pattern) => pattern.test(consumer.queue.name));
      return {
        ...consumer,
        queue: {
          ...consumer.queue,
          name: pattern ? getPatternName(pattern) : consumer.queue.name,
        },
      };
    })
  );

  const nodes: Node<ConsumerNodeData>[] = [];
  const edges: Edge[] = [];

  Object.entries(groupBy(rmqConsumers, "queue.name")).forEach(([queueName, consumers]) => {
    if (consumers.length <= 3) {
      nodes.push(
        ...consumers.map((consumer) => ({
          id: consumer.consumer_tag,
          type: "consumer",
          data: {
            id: consumer.consumer_tag,
            user: consumer.channel_details.user,
            consumerTag: consumer.consumer_tag,
            count: 1,
            activeCount: consumer.active ? 1 : 0,
          },
          position: { x: 0, y: 0 },
        }))
      );

      edges.push(
        ...consumers.map((consumer) => ({
          id: `${consumer.consumer_tag}-${queueName}`,
          source: queueName,
          target: consumer.consumer_tag,
        }))
      );
    } else {
      const count = consumers.length;
      const activeCount = consumers.filter((consumer) => consumer.active).length;
      const id = `${queueName}-consumers`;
      nodes.push({
        id,
        type: "consumer",
        data: {
          id,
          user: consumers.find((consumer) => consumer.channel_details.user)?.channel_details.user || "",
          consumerTag: consumers[0].consumer_tag,
          count,
          activeCount,
        },
        position: { x: 0, y: 0 },
      });

      edges.push({
        id: `${id}-${queueName}`,
        source: queueName,
        target: id,
      });
    }
  });

  return { nodes, edges };
}

export async function listQueueNodes(patterns: Patterns): Promise<Node<QueueNodeData>[]> {
  const rmqQueues = await listQueues().then((queues) =>
    queues.map((queue) => {
      const pattern = patterns.find((pattern) => pattern.test(queue.name));
      return {
        ...queue,
        name: pattern ? getPatternName(pattern) : queue.name,
      };
    })
  );

  return Object.entries(groupBy(rmqQueues, "name")).flatMap(([queueName, queues]) => ({
    id: queueName,
    type: "queue",
    data: {
      id: queueName,
      name: queueName,
      type: queues[0].type,
      stats: {
        publish: queues.reduce((acc, queue) => acc + (queue.message_stats?.publish_details?.rate || 0), 0),
        ack: queues.reduce((acc, queue) => acc + (queue.message_stats?.ack_details?.rate || 0), 0),
      },
      consumer: {
        count: queues.reduce((acc, queue) => acc + queue.consumers, 0),
        capacity: queues.reduce((acc, queue) => (acc + (queue.consumer_capacity || 1)) / 2, 1),
      },
    },
    position: { x: 0, y: 0 },
  }));
}

export async function listEdges(patterns: Patterns): Promise<Edge<BindingNodeData>[]> {
  const bindings = await listBindings().then((bindings) =>
    bindings
      .filter((binding) => binding.source !== "")
      .map((binding) => {
        const sourcePattern = patterns.find((pattern) => pattern.test(binding.source));
        const destPattern = patterns.find((pattern) => pattern.test(binding.destination));

        const sourceName = sourcePattern ? getPatternName(sourcePattern) : binding.source;
        const destName = destPattern ? getPatternName(destPattern) : binding.destination;

        return {
          ...binding,
          id: `${sourceName}-${destName}`,
          source: sourceName,
          destination: destName,
        };
      })
  );

  return Object.entries(groupBy(bindings, "id")).flatMap(([id, bindings]) => ({
    id: id,
    source: bindings[0].source,
    target: bindings[0].destination,
    type: "binding",
    data: {
      id: id,
      source: bindings[0].source,
      destination: bindings[0].destination,
      routingKeys: bindings.map((binding) => binding.routing_key),
    },
  }));
}

export function combineNodes(existingNodes: Node[], nodes: Node[]) {
  const existingNodesMap = keyBy(existingNodes, "id");
  const nodesMap = keyBy(nodes, "id");
  const nonOverlappingNodes = existingNodes.filter((node) => !nodesMap[node.id]);

  return [
    ...nonOverlappingNodes,
    ...nodes.map((node) => {
      const existingNode = existingNodesMap[node.id];
      if (existingNode) {
        return {
          ...existingNode,
          data: node.data,
        };
      }
      return node;
    }),
  ];
}

export function combineEdges(existingEdges: Edge[], edges: Edge[]) {
  return unionBy(edges, existingEdges, "id");
}

export async function getGraph(existingNodes?: Node[], existingEdges?: Edge[], pattern?: RegExp) {
  const patterns = pattern ? [pattern] : [];
  const exchangeNodes = await listExchangeNodes();
  const { nodes: consumerNodes, edges: consumerEdges } = await listConsumerNodes(patterns);
  const queueNodes = await listQueueNodes(patterns);
  const edgeNodes = await listEdges(patterns);

  const nodes = combineNodes(existingNodes || [], [...exchangeNodes, ...consumerNodes, ...queueNodes]);
  const edges = combineEdges(existingEdges || [], [...edgeNodes, ...consumerEdges]);

  return { nodes, edges };
}
