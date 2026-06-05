import { unstable_cache } from "next/cache";

const REPO = "popsukss/quantum-roadmap";
const BRANCH = "main";
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

export type NodeType = "checkpoint" | "track";

export type RoadmapNode = {
	id: string;
	label: string;
	type: NodeType;
};

export type RoadmapEdge = {
	from: string;
	to: string;
};

export type EntryPoint = {
	background: string;
	startAt: string;
};

export type RoadmapMeta = {
	nodes: RoadmapNode[];
	edges: RoadmapEdge[];
	entryPoints: EntryPoint[];
};

export type ChecklistSection = {
	heading: string;
	items: string[];
};

export type CheckpointContent = {
	id: string;
	title: string;
	sections: ChecklistSection[];
	milestone: string | null;
};

export type RoadmapResourceItem = {
	nodeId: string;
	nodeLabel: string;
	text: string;
};

export const getRoadmapMeta = unstable_cache(
	async (): Promise<RoadmapMeta> => {
		const res = await fetch(`${RAW}/meta.json`);
		if (!res.ok) throw new Error(`Failed to fetch meta.json: ${res.status}`);
		return res.json() as Promise<RoadmapMeta>;
	},
	["roadmap-meta"],
	{ revalidate: 3600 },
);

export const getCheckpointContent = unstable_cache(
	async (nodeId: string): Promise<CheckpointContent> => {
		const isTrack = nodeId.startsWith("t");
		const path = isTrack
			? `tracks/${nodeId}.md`
			: `checkpoints/${nodeId}.md`;

		const res = await fetch(`${RAW}/${path}`);
		if (!res.ok) throw new Error(`Node not found: ${nodeId}`);
		const markdown = await res.text();

		return parseCheckpointMarkdown(nodeId, markdown);
	},
	["roadmap-checkpoint"],
	{ revalidate: 3600 },
);

export const getAllRoadmapResources = unstable_cache(
	async (): Promise<RoadmapResourceItem[]> => {
		const meta = await getRoadmapMeta();
		const contents = await Promise.all(
			meta.nodes.map((n) => getCheckpointContent(n.id).catch(() => null)),
		);

		const result: RoadmapResourceItem[] = [];
		meta.nodes.forEach((node, i) => {
			const content = contents[i];
			if (!content) return;
			const section = content.sections.find((s) => s.heading === "Resources");
			if (!section) return;
			section.items.forEach((text) => {
				result.push({ nodeId: node.id, nodeLabel: node.label, text });
			});
		});
		return result;
	},
	["roadmap-all-resources"],
	{ revalidate: 3600 },
);

function parseCheckpointMarkdown(nodeId: string, markdown: string): CheckpointContent {
	const lines = markdown.split("\n");

	let title = nodeId;
	let inFrontmatter = false;
	let frontmatterDone = false;
	let milestone: string | null = null;
	const sections: ChecklistSection[] = [];
	let currentSection: ChecklistSection | null = null;

	for (const rawLine of lines) {
		const line = rawLine.trim();

		if (!frontmatterDone) {
			if (line === "---") {
				if (!inFrontmatter) {
					inFrontmatter = true;
					continue;
				} else {
					frontmatterDone = true;
					continue;
				}
			}
			if (inFrontmatter && line.startsWith("title:")) {
				title = line.replace("title:", "").trim().replace(/^["']|["']$/g, "");
			}
			continue;
		}

		if (line.startsWith("## Milestone")) {
			currentSection = null;
			continue;
		}

		if (line.startsWith("## ")) {
			const heading = line.replace("## ", "").trim();
			currentSection = { heading, items: [] };
			sections.push(currentSection);
			continue;
		}

		if (line.startsWith("**") && currentSection) {
			continue;
		}

		if (line.startsWith("- [ ]") && currentSection) {
			const item = line.replace("- [ ]", "").trim();
			currentSection.items.push(item);
			continue;
		}

		if (!line.startsWith("#") && !line.startsWith("-") && line.length > 0 && !currentSection) {
			milestone = line;
		}
	}

	return { id: nodeId, title, sections, milestone };
}
