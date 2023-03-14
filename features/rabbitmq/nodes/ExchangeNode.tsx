import { Handle, NodeProps, Position } from "reactflow";
import { ExchangeNodeData } from "../types";

export function ExchangeNode({ data: exchange }: NodeProps<ExchangeNodeData>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex flex-col items-center border bg-white px-2 py-1">
        <span>{`<${exchange.type}>`}</span>
        <div className="font-semibold">{exchange.name}</div>
      </div>
    </>
  );
}
