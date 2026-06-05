import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "~/server/db";
import { getSession } from "~/server/better-auth/server";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	if (!session) redirect("/sign-in");

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { role: true },
	});

	if (user?.role !== "ADMIN") redirect("/");

	return (
		<div className="flex min-h-screen">
			<aside className="w-56 shrink-0 border-r border-border bg-background">
				<nav className="flex flex-col gap-1 p-4">
					<p className="mb-2 px-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
						Admin
					</p>
					{[
						{ href: "/admin", label: "Dashboard" },
						{ href: "/admin/events", label: "Events" },
						{ href: "/admin/members", label: "Members" },
						{ href: "/admin/resources", label: "Resources" },
						{ href: "/admin/forum", label: "Forum" },
						{ href: "/admin/users", label: "Users" },
					].map((item) => (
						<Link
							key={item.href}
							className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							href={item.href}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</aside>
			<main className="flex-1 p-8">{children}</main>
		</div>
	);
}
