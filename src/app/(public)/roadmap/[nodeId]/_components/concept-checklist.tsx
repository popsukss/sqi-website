"use client";

import { useEffect, useState } from "react";

import { MarkdownInline } from "~/components/markdown";

function storageKey(nodeId: string, index: number) {
	return `sqi-check-${nodeId}-${index}`;
}

export function ConceptChecklist({ nodeId, items }: { nodeId: string; items: string[] }) {
	const [checked, setChecked] = useState<boolean[]>([]);

	useEffect(() => {
		setChecked(items.map((_, i) => localStorage.getItem(storageKey(nodeId, i)) === "1"));
	}, [nodeId, items]);

	function toggle(i: number) {
		setChecked((prev) => {
			const next = [...prev];
			next[i] = !next[i];
			localStorage.setItem(storageKey(nodeId, i), next[i] ? "1" : "0");
			return next;
		});
	}

	return (
		<ul className="space-y-2">
			{items.map((item, i) => (
				<li key={i} className="flex items-start gap-2 text-sm">
					<input
						checked={checked[i] ?? false}
						className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
						type="checkbox"
						onChange={() => toggle(i)}
					/>
					<span className={`min-w-0 ${checked[i] ? "text-muted-foreground line-through" : ""}`}>
						<MarkdownInline>{item}</MarkdownInline>
					</span>
				</li>
			))}
		</ul>
	);
}
