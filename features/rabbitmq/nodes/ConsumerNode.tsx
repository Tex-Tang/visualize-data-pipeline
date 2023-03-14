import { clsx } from "clsx";
import { Handle, NodeProps, Position } from "reactflow";
import { ConsumerNodeData } from "../types";

export function ConsumerNode({ data: consumer }: NodeProps<ConsumerNodeData>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="flex flex-col gap-1 bg-white p-1 px-2 border relative">
        <div className="flex gap-1.5 items-baseline">
          <span
            className={clsx(
              "h-2.5 w-2.5 rounded-full animate-pulse",
              consumer.activeCount > consumer.count ? "bg-red-500" : "bg-green-500"
            )}
          ></span>
          <span>{consumer.user}</span>
        </div>
        <span className="font-mono text-xs">
          {consumer.consumerTag} {consumer.count > 1 && `(+${consumer.count - 1})`}
        </span>

        {consumer.count > 1 && <div className="absolute h-full w-full left-2 top-2 border bg-white -z-10"></div>}
        {consumer.count > 2 && <div className="absolute h-full w-full left-3.5 top-3.5 border bg-white -z-20"></div>}
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
