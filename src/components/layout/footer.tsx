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

				<p className="text-muted-foreground text-xs">
					SUTD Quantum Initiatives &copy; {new Date().getFullYear()}
				</p>
			</div>
		</footer>
	);
}
