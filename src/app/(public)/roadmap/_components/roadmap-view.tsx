"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	Background,
	Controls,
	type Edge,
	Handle,
	type Node,
	Position,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { RoadmapMeta } from "~/lib/roadmap";
import { api } from "~/trpc/react";

type NodeStatus = "completed" | "in_progress" | "skipped" | "unreached";

function nodeColor(status: NodeStatus, type: "checkpoint" | "track"): string {
	if (status === "completed") return type === "track" ? "#6366f1" : "#18181b";
	if (status === "in_progress") return "#f59e0b";
	if (status === "skipped") return "#71717a";
	return "#e4e4e7";
}

function nodeTextColor(status: NodeStatus): string {
	return status === "unreached" ? "#71717a" : "#fff";
}

function RoadmapNode({ data }: { data: { label: string; status: NodeStatus; type: "checkpoint" | "track" } }) {
	return (
		<div
			className="flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 py-2 text-center text-xs font-medium shadow-sm transition-transform hover:scale-105"
			style={{
				background: nodeColor(data.status, data.type),
				color: nodeTextColor(data.status),
				minWidth: 120,
				maxWidth: 140,
			}}
		>
			<Handle position={Position.Top} type="target" />
			{data.label}
			<Handle position={Position.Bottom} type="source" />
		</div>
	);
}

const NODE_TYPES = { roadmap: RoadmapNode };

function buildLayout(meta: RoadmapMeta, progress: Record<string, string>) {
	const checkpoints = meta.nodes.filter((n) => n.type === "checkpoint");
	const tracks = meta.nodes.filter((n) => n.type === "track");

	const nodes: Node[] = [];
	const edges: Edge[] = [];

	const cpSpacingX = 220;
	const cpStartX = 300;
	const cpY = 60;

	checkpoints.forEach((cp, i) => {
		const raw = progress[cp.id];
		const status: NodeStatus =
			raw === "COMPLETED" ? "completed"
				: raw === "IN_PROGRESS" ? "in_progress"
					: raw === "SKIPPED" ? "skipped"
						: "unreached";

		nodes.push({
			id: cp.id,
			type: "roadmap",
			position: { x: cpStartX + i * cpSpacingX, y: cpY },
			data: { label: cp.label, status, type: "checkpoint" },
		});
	});

	const tracksPerRow = 4;
	const trackSpacingX = 200;
	const trackSpacingY = 100;
	const trackStartY = cpY + 160;

	tracks.forEach((track, i) => {
		const row = Math.floor(i / tracksPerRow);
		const col = i % tracksPerRow;
		const raw = progress[track.id];
		const status: NodeStatus =
			raw === "COMPLETED" ? "completed"
				: raw === "IN_PROGRESS" ? "in_progress"
					: raw === "SKIPPED" ? "skipped"
						: "unreached";

		nodes.push({
			id: track.id,
			type: "roadmap",
			position: {
				x: 100 + col * trackSpacingX,
				y: trackStartY + row * trackSpacingY,
			},
			data: { label: track.label, status, type: "track" },
		});
	});

	meta.edges.forEach((e, i) => {
		edges.push({
			id: `e-${i}`,
			source: e.from,
			target: e.to,
			style: { stroke: "#d4d4d8" },
		});
	});

	return { nodes, edges };
}

export function RoadmapView({ meta, userId: _ }: { meta: RoadmapMeta; userId: string }) {
	const router = useRouter();
	const { data: progress = {} } = api.roadmap.getMyProgress.useQuery();

	const { nodes: initialNodes, edges: initialEdges } = useMemo(
		() => buildLayout(meta, progress as Record<string, string>),
		[meta, progress],
	);

	const [nodes, , onNodesChange] = useNodesState(initialNodes);
	const [edges, , onEdgesChange] = useEdgesState(initialEdges);

	const onNodeClick = useCallback(
		(_: React.MouseEvent, node: Node) => {
			router.push(`/roadmap/${node.id}`);
		},
		[router],
	);

	return (
		<div className="space-y-4">
			<div className="h-[480px] w-full rounded-lg border border-border overflow-hidden">
				<ReactFlow
					edges={edges}
					fitView
					nodeTypes={NODE_TYPES}
					nodes={nodes}
					onEdgesChange={onEdgesChange}
					onNodeClick={onNodeClick}
					onNodesChange={onNodesChange}
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
			<p className="text-center text-muted-foreground text-xs">
				Click any node to view the checkpoint details and track your progress.
			</p>
		</div>
	);
}
