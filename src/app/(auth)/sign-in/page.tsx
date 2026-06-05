import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";
import { SignInForm } from "./_components/sign-in-form";

export default async function SignInPage() {
	const session = await getSession();
	if (session) redirect("/");

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-sm space-y-6">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-bold">Sign in to SQI</h1>
					<p className="text-muted-foreground text-sm">
						Track your quantum learning journey
					</p>
				</div>

				<SignInForm />

				<p className="text-center text-muted-foreground text-sm">
					No account?{" "}
					<Link className="text-foreground underline underline-offset-4" href="/sign-up">
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}
