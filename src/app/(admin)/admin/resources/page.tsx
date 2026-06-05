"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function AdminResourcesPage() {
	const utils = api.useUtils();
	const { data: resources = [], isLoading } = api.admin.getPendingResources.useQuery();

	const approve = api.admin.approveResource.useMutation({
		onSuccess: () => void utils.admin.getPendingResources.invalidate(),
	});
	const reject = api.admin.rejectResource.useMutation({
		onSuccess: () => void utils.admin.getPendingResources.invalidate(),
	});

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Resources — Approval Queue</h1>

			{isLoading ? (
				<p className="text-muted-foreground text-sm">Loading…</p>
			) : resources.length === 0 ? (
				<p className="text-muted-foreground text-sm">No pending resources.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Tag</TableHead>
							<TableHead>Submitted by</TableHead>
							<TableHead className="w-32" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{resources.map((resource) => (
							<TableRow key={resource.id}>
								<TableCell>
									<a
										className="font-medium underline underline-offset-4"
										href={resource.url}
										rel="noopener noreferrer"
										target="_blank"
									>
										{resource.title}
									</a>
									{resource.description && (
										<p className="mt-0.5 line-clamp-1 text-muted-foreground text-xs">
											{resource.description}
										</p>
									)}
								</TableCell>
								<TableCell>
									<Badge variant="outline">{resource.type}</Badge>
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{resource.checkpointTag ?? "—"}
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{resource.submittedBy.name}
								</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={() => approve.mutate({ id: resource.id })}
										>
											Approve
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => reject.mutate({ id: resource.id })}
										>
											Reject
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
