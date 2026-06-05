"use client";

import { useEffect, useState } from "react";

import { MarkdownInline } from "~/components/markdown";
import { api } from "~/trpc/react";

function localKey(nodeId: string, index: number) {
	return `sqi-check-${nodeId}-${index}`;
}

function itemKey(index: number) {
	return `Concepts-${index}`;
}

function GuestChecklist({ nodeId, items }: { nodeId: string; items: string[] }) {
	const [checked, setChecked] = useState<boolean[]>([]);

	useEffect(() => {
		setChecked(items.map((_, i) => localStorage.getItem(localKey(nodeId, i)) === "1"));
	}, [nodeId, items]);

	function toggle(i: number) {
		setChecked((prev) => {
			const next = [...prev];
			next[i] = !next[i];
			localStorage.setItem(localKey(nodeId, i), next[i] ? "1" : "0");
			return next;
		});
	}

	return <ChecklistUI checked={checked} items={items} onToggle={toggle} />;
}

function AuthedChecklist({ nodeId, items }: { nodeId: string; items: string[] }) {
	const { data: checkedKeys = [], refetch } = api.roadmap.getCheckedItems.useQuery({ nodeId });
	const setItem = api.roadmap.setCheckedItem.useMutation({ onSuccess: () => refetch() });

	const checkedSet = new Set(checkedKeys);

	function toggle(i: number) {
		const key = itemKey(i);
		setItem.mutate({ nodeId, itemKey: key, checked: !checkedSet.has(key) });
	}

	return (
		<ChecklistUI
			checked={items.map((_, i) => checkedSet.has(itemKey(i)))}
			items={items}
			onToggle={toggle}
		/>
	);
}

function ChecklistUI({
	items,
	checked,
	onToggle,
}: {
	items: string[];
	checked: boolean[];
	onToggle: (i: number) => void;
}) {
	return (
		<ul className="space-y-2">
			{items.map((item, i) => (
				<li key={i} className="flex items-start gap-2 text-sm">
					<input
						checked={checked[i] ?? false}
						className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
						type="checkbox"
						onChange={() => onToggle(i)}
					/>
					<span className={`min-w-0 ${checked[i] ? "text-muted-foreground line-through" : ""}`}>
						<MarkdownInline>{item}</MarkdownInline>
					</span>
				</li>
			))}
		</ul>
	);
}

export function ConceptChecklist({
	nodeId,
	items,
	isAuthed,
}: {
	nodeId: string;
	items: string[];
	isAuthed: boolean;
}) {
	if (isAuthed) return <AuthedChecklist items={items} nodeId={nodeId} />;
	return <GuestChecklist items={items} nodeId={nodeId} />;
}
