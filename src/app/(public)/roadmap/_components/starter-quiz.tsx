"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { EntryPoint } from "~/lib/roadmap";

export function StarterQuiz({ entryPoints }: { entryPoints: EntryPoint[] }) {
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<div className="mx-auto max-w-xl space-y-6">
			<div className="space-y-1">
				<h2 className="text-xl font-semibold">Where do you start?</h2>
				<p className="text-muted-foreground text-sm">
					Pick the option that best matches your background.
				</p>
			</div>

			<div className="space-y-2">
				{entryPoints.map((ep) => (
					<button
						key={ep.background}
						className={`w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent ${
							selected === ep.startAt
								? "border-primary bg-accent"
								: "border-border"
						}`}
						type="button"
						onClick={() => setSelected(ep.startAt)}
					>
						{ep.background}
					</button>
				))}
			</div>

			<div className="flex flex-col gap-3">
				{selected && (
					<Button asChild>
						<Link href={`/roadmap/${selected}`}>View my checkpoint →</Link>
					</Button>
				)}
				<Card>
					<CardContent className="pt-4">
						<p className="text-muted-foreground text-sm">
							<strong>Sign in</strong> to save your progress and track your journey
							across the roadmap.{" "}
							<Link className="underline underline-offset-4" href="/sign-in">
								Sign in
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
