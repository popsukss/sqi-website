export default async function PostPage({
	params,
}: {
	params: Promise<{ postId: string }>;
}) {
	const { postId } = await params;

	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-3xl font-bold">Post #{postId}</h1>
			<p className="mt-4 text-muted-foreground">Post detail — coming soon.</p>
		</div>
	);
}
