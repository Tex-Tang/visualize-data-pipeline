export enum ExchangeType {
  DIRECT = "direct",
  FANOUT = "fanout",
  TOPIC = "topic",
  HEADERS = "headers",
}

export type Exchange = {
  auto_delete: boolean;
  durable: boolean;
  internal: boolean;
  message_stats?: {
    publish_in: number;
    publish_in_details: {
      rate: number;
    };
    publish_out: number;
    publish_out_details: {
      rate: number;
    };
  };
  name: string;
  type: ExchangeType;
  vhost: string;
};

export type Queue = {
  arguments: Record<string, unknown>;
  auto_delete: boolean;
  backing_queue_status: {
    avg_ack_egress_rate: number;
    avg_ack_ingress_rate: number;
    avg_egress_rate: number;
    avg_ingress_rate: number;
    delta: [string, string, number, number, string];
    len: number;
    mirror_seen: number;
    mirror_senders: number;
    mode: string;
    next_deliver_seq_id: number;
    next_seq_id: number;
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    target_ram_count: string;
    version: number;
  };
  consumer_capacity: number;
  consumer_utilisation: number;
  consumers: number;
  durable: boolean;
  effective_policy_definition: {
    "ha-mode": string;
    "ha-params": number;
    "ha-sync-mode": string;
    "queue-master-locator": string;
    "queue-mode": string;
  };
  exclusive: boolean;
  exclusive_consumer_tag: null;
  garbage_collection: {
    fullsweep_after: number;
    max_heap_size: number;
    min_bin_vheap_size: number;
    min_heap_size: number;
    minor_gcs: number;
  };
  head_message_timestamp: null;
  idle_since: string;
  memory: number;
  message_bytes: number;
  message_bytes_paged_out: number;
  message_bytes_persistent: number;

  message_bytes_ram: number;
  message_bytes_ready: number;
  message_bytes_unacknowledged: number;
  message_stats: {
    ack: number;
    ack_details: {
      rate: number;
    };
    deliver: number;
    deliver_details: {
      rate: number;
    };
    deliver_get: number;
    deliver_get_details: {
      rate: number;
    };
    deliver_no_ack: number;
    deliver_no_ack_details: {
      rate: number;
    };
    get: number;
    get_details: {
      rate: number;
    };
    get_empty: number;
    get_empty_details: {
      rate: number;
    };
    get_no_ack: number;
    get_no_ack_details: {
      rate: number;
    };
    publish: number;
    publish_details: {
      rate: number;
    };
    redeliver: number;
    redeliver_details: {
      rate: number;
    };
  };
  messages: number;
  messages_details: {
    rate: number;
  };
  messages_paged_out: number;
  messages_persistent: number;
  messages_ram: number;
  messages_ready: number;
  messages_ready_details: {
    rate: number;
  };
  messages_ready_ram: number;
  messages_unacknowledged: number;
  messages_unacknowledged_details: {
    rate: number;
  };
  messages_unacknowledged_ram: number;
  name: string;
  node: string;
  operator_policy: null;
  policy: string;
  recoverable_slaves: string[];
  reductions: number;
  reductions_details: {
    rate: number;
  };
  single_active_consumer_tag: null;
  slave_nodes: string[];
  state: string;
  synchronised_slave_nodes: string[];
  type: string;
  vhost: string;
};

export type Consumer = {
  arguments: Record<string, unknown>;
  channel_details: {
    connection_name: string;
    name: string;
    node: string;
    number: number;
    peer_host: string;
    peer_port: number;
    user: string;
  };
  ack_required: boolean;
  active: boolean;
  activity_status: string;
  consumer_tag: string;
  exclusive: boolean;
  prefetch_count: number;
  queue: {
    name: string;
    vhost: string;
  };
};

export type QueueDetail = Queue & {
  consumer_details: Consumer[];
};
