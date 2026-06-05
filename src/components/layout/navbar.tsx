"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

const NAV_LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/roadmap", label: "Roadmap" },
	{ href: "/forum", label: "Forum" },
	{ href: "/resources", label: "Resources" },
] as const;

export function Navbar() {
	const pathname = usePathname();

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
					<Link
						className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
						href="/sign-in"
					>
						Sign in
					</Link>
				</div>
			</div>
		</header>
	);
}
