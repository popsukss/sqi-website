export default async function CheckpointPage({
	params,
}: {
	params: Promise<{ nodeId: string }>;
}) {
	const { nodeId } = await params;

	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-3xl font-bold">Checkpoint: {nodeId}</h1>
			<p className="mt-4 text-muted-foreground">Checkpoint detail — coming soon.</p>
		</div>
	);
}
