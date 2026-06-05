import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
				<div className="flex flex-col items-center gap-1 md:items-start">
					<p className="font-semibold text-sm">SUTD Quantum Initiatives</p>
					<p className="text-muted-foreground text-xs">
						Building Singapore&apos;s quantum future together.
					</p>
				</div>

				<div className="flex items-center gap-4 text-muted-foreground text-sm">
					<Link
						className="hover:text-foreground transition-colors"
						href="mailto:sqi@sutd.edu.sg"
					>
						Email
					</Link>
					<Link
						className="hover:text-foreground transition-colors"
						href="https://github.com/popsukss/sqi-website"
						rel="noopener noreferrer"
						target="_blank"
					>
						GitHub
					</Link>
				</div>
			</div>
		</footer>
	);
}
