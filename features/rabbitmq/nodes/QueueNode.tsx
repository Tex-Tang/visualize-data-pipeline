import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { QueueNodeData } from "../types";

function ConsumerCapacityBar({ consumerCapacity, columns }: { consumerCapacity: number; columns: number }) {
  const color = consumerCapacity > 0.8 ? "bg-green-500" : consumerCapacity > 0.5 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="flex gap-0.5">
      {new Array(Math.ceil(columns * consumerCapacity)).fill(0).map((_, i) => (
        <div key={i} className={clsx("h-6 w-1", color)}></div>
      ))}
      {new Array(Math.floor(columns * (1 - consumerCapacity))).fill(0).map((_, i) => (
        <div key={i} className="h-6 bg-gray-300 w-1"></div>
      ))}
    </div>
  );
}

export function QueueNode({ data: queue }: NodeProps<QueueNodeData>) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth;
      const columns = Math.floor(width / 6);
      setColumns(columns);
    }
  }, [ref]);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="flex flex-col min-w-[300px] p-2 border gap-1 bg-white">
        <div className="flex gap-4 justify-between" ref={ref}>
          <div className="font-semibold text-sm">{queue.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-yellow-500">{queue.stats.publish.toFixed(1) ?? 0}/s</span>
            <span className="text-xs font-mono text-green-500">{queue.stats.ack.toFixed(1) ?? 0}/s</span>
          </div>
        </div>
        {queue.consumer.count <= 0 ? (
          <div className="flex items-center gap-1">
            <AlertTriangle className="text-yellow-500" />
            <span>No Consumer</span>
          </div>
        ) : (
          <ConsumerCapacityBar consumerCapacity={queue.consumer.capacity} columns={columns} />
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
