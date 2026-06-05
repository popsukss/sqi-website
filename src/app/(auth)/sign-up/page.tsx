import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";
import { SignUpForm } from "./_components/sign-up-form";

export default async function SignUpPage() {
	const session = await getSession();
	if (session) redirect("/");

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-sm space-y-6">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-bold">Create account</h1>
					<p className="text-muted-foreground text-sm">
						Join the SQI community
					</p>
				</div>

				<SignUpForm />

				<p className="text-center text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link className="text-foreground underline underline-offset-4" href="/sign-in">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
