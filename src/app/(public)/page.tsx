import Image from "next/image";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function HomePage() {
	const events = await api.event.getAll();
	const members = await api.member.getAll();

	return (
		<div className="flex flex-col">
			{/* Hero */}
			<section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center">
				<Badge variant="outline">SUTD Student Club</Badge>
				<h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
					Building Singapore&apos;s quantum future together
				</h1>
				<p className="max-w-xl text-muted-foreground text-lg">
					SUTD Quantum Initiatives (SQI) advances quantum computing education
					and research through community, mentorship, and hands-on learning.
				</p>
				<div className="flex gap-3">
					<Button asChild size="lg">
						<Link href="/roadmap">Start the roadmap</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="/forum">Join the forum</Link>
					</Button>
				</div>
			</section>

			<Separator />

			{/* Mission */}
			<section className="container mx-auto px-4 py-16">
				<h2 className="mb-8 text-center text-2xl font-bold">What We Do</h2>
				<div className="grid gap-6 sm:grid-cols-3">
					{[
						{
							title: "Learn",
							body: "A structured quantum computing roadmap from absolute beginner to researcher — at your own pace.",
						},
						{
							title: "Connect",
							body: "A community forum to ask questions, share discoveries, and get unstuck with peers who've been there.",
						},
						{
							title: "Build",
							body: "Resources, workshops, and projects that turn theory into real quantum hardware and software experience.",
						},
					].map((item) => (
						<Card key={item.title}>
							<CardContent className="pt-6">
								<h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
								<p className="text-muted-foreground text-sm">{item.body}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<Separator />

			{/* Events */}
			{events.length > 0 && (
				<section className="container mx-auto px-4 py-16">
					<h2 className="mb-8 text-center text-2xl font-bold">Past Events</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{events.map((event) => (
							<Card key={event.id}>
								{event.imageUrl && (
									<div className="relative h-40 w-full overflow-hidden rounded-t-lg">
										<Image
											alt={event.title}
											className="object-cover"
											fill
											src={event.imageUrl}
										/>
									</div>
								)}
								<CardContent className="pt-4">
									<p className="mb-1 text-muted-foreground text-xs">
										{new Date(event.date).toLocaleDateString("en-SG", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
									<h3 className="font-semibold">{event.title}</h3>
									<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
										{event.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}

			<Separator />

			{/* People */}
			{members.length > 0 && (
				<section className="container mx-auto px-4 py-16">
					<h2 className="mb-8 text-center text-2xl font-bold">Our Team</h2>
					<div className="flex flex-wrap justify-center gap-6">
						{members.map((member) => (
							<div key={member.id} className="flex flex-col items-center gap-2 text-center">
								<div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
									{member.imageUrl && (
										<Image
											alt={member.name}
											className="object-cover"
											fill
											src={member.imageUrl}
										/>
									)}
								</div>
								<div>
									<p className="font-semibold text-sm">{member.name}</p>
									<p className="text-muted-foreground text-xs">{member.role}</p>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			<Separator />

			{/* Contact */}
			<section className="container mx-auto px-4 py-16 text-center">
				<h2 className="mb-4 text-2xl font-bold">Get in Touch</h2>
				<p className="mb-6 text-muted-foreground">
					Interested in quantum computing or want to collaborate?
				</p>
				<div className="flex justify-center gap-6 text-sm">
					<a
						className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
						href="mailto:sqi@sutd.edu.sg"
					>
						sqi@sutd.edu.sg
					</a>
					<a
						className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
						href="https://github.com/popsukss/sqi-website"
						rel="noopener noreferrer"
						target="_blank"
					>
						GitHub
					</a>
				</div>
			</section>
		</div>
	);
}
