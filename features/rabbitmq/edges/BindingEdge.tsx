import { EdgeProps, getBezierPath } from "reactflow";
import { BindingNodeData } from "../types";

export function BindingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps<BindingNodeData>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const routingKeys = data?.routingKeys ?? [];

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text dy={-5} className="nodrag nopan">
        <textPath href={`#${id}`} style={{ fontSize: 12 }} startOffset="50%" textAnchor="middle">
          {routingKeys[0]} {routingKeys.length > 1 ? `(+${routingKeys.length - 1})` : ""}
        </textPath>
      </text>
    </>
  );
}
