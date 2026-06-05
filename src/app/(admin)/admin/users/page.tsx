"use client";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function AdminUsersPage() {
	const utils = api.useUtils();
	const { data: users = [], isLoading } = api.admin.getAllUsers.useQuery();

	const setRole = api.admin.setUserRole.useMutation({
		onSuccess: () => void utils.admin.getAllUsers.invalidate(),
	});

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Users</h1>

			{isLoading ? (
				<p className="text-muted-foreground text-sm">Loading…</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead className="w-24" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
								<TableCell>
									<Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{new Date(user.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell>
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											setRole.mutate({
												userId: user.id,
												role: user.role === "ADMIN" ? "USER" : "ADMIN",
											})
										}
									>
										{user.role === "ADMIN" ? "Demote" : "Promote"}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
