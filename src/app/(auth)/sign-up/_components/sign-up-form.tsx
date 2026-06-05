"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authClient } from "~/server/better-auth/client";

export function SignUpForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSignUp(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const { error: authError } = await authClient.signUp.email({
			name,
			email,
			password,
			callbackURL: "/",
		});
		if (authError) {
			setError(authError.message ?? "Sign up failed.");
			setLoading(false);
		} else {
			router.push("/");
			router.refresh();
		}
	}

	async function handleGoogleSignIn() {
		await authClient.signIn.social({ provider: "google", callbackURL: "/" });
	}

	return (
		<div className="space-y-4">
			<Button
				className="w-full"
				disabled={loading}
				type="button"
				variant="outline"
				onClick={handleGoogleSignIn}
			>
				Continue with Google
			</Button>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center text-xs">
					<span className="bg-background px-2 text-muted-foreground">or</span>
				</div>
			</div>

			<form className="space-y-3" onSubmit={handleSignUp}>
				<div className="space-y-1">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						required
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						required
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						minLength={8}
						required
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{error && <p className="text-destructive text-sm">{error}</p>}
				<Button className="w-full" disabled={loading} type="submit">
					{loading ? "Creating account…" : "Create account"}
				</Button>
			</form>
		</div>
	);
}
