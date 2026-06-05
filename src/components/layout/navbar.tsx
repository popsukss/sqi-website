"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "~/server/better-auth/client";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const NAV_LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/roadmap", label: "Roadmap" },
	{ href: "/forum", label: "Forum" },
	{ href: "/resources", label: "Resources" },
] as const;

export function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = authClient.useSession();

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/");
		router.refresh();
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-14 items-center justify-between px-4">
				<Link className="flex items-center gap-2 font-semibold" href="/">
					<span>SQI</span>
				</Link>

				<nav className="hidden items-center gap-6 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							className={cn(
								"text-sm transition-colors hover:text-foreground",
								pathname === link.href
									? "text-foreground font-medium"
									: "text-muted-foreground",
							)}
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					{session ? (
						<>
							<span className="hidden text-muted-foreground text-sm md:inline">
								{session.user.name}
							</span>
							<Button size="sm" variant="outline" onClick={handleSignOut}>
								Sign out
							</Button>
						</>
					) : (
						<Button asChild size="sm" variant="outline">
							<Link href="/sign-in">Sign in</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
