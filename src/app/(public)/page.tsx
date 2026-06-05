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
					Where students learn by building — and builders become tomorrow&apos;s quantum talent
				</h1>
				<p className="max-w-xl text-muted-foreground text-lg">
					SUTD Quantum Initiatives (SQI) advances quantum computing education
					and research through community, mentorship, and hands-on learning.
				</p>
				<div className="flex flex-wrap justify-center gap-3">
					<Button asChild size="lg">
						<Link href="/roadmap">Start the roadmap</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="/forum">Join the forum</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="#join">Get Involved ↓</Link>
					</Button>
				</div>
			</section>

			<Separator />

			{/* Club Programs */}
			<section className="container mx-auto px-4 py-16">
				<h2 className="mb-2 text-center text-2xl font-bold">Club Programs</h2>
				<p className="mb-8 text-center text-sm text-muted-foreground">
					Three ways to engage with quantum at SUTD.
				</p>
				<div className="grid gap-6 sm:grid-cols-3">
					{[
						{
							title: "Project Track",
							body: "Creative and intellectual space to explore quantum through your own passions — with structure, mentorship, and team support to ship real, documented projects every semester.",
						},
						{
							title: "Academic Learning",
							body: "Rigorous yet accessible quantum foundations through community-driven study blocks, working toward QWorld certifications (QBronze, QNickel) as a cohort.",
							link: { href: "/roadmap", label: "→ Start with the learning roadmap" },
						},
						{
							title: "Dialogues & Events",
							body: "Industry talks, lab visits, cross-university workshops, and the annual Quantum Fall Fest — exposing members to the full quantum landscape beyond the classroom.",
						},
					].map((item) => (
						<Card key={item.title}>
							<CardContent className="pt-6">
								<h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
								<p className="text-muted-foreground text-sm">{item.body}</p>
								{"link" in item && item.link && (
									<Link
										className="mt-3 block text-sm underline underline-offset-4 hover:text-foreground text-muted-foreground"
										href={item.link.href}
									>
										{item.link.label}
									</Link>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Events */}
			{events.length > 0 && (
				<>
					<Separator />
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
				</>
			)}

			{/* People */}
			{members.length > 0 && (
				<>
					<Separator />
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
				</>
			)}

			<Separator />

			{/* Join */}
			<section id="join" className="container mx-auto max-w-2xl px-4 py-16">
				<h2 className="mb-4 text-center text-2xl font-bold">Join SQI</h2>
				<p className="mb-6 text-center text-muted-foreground">
					SQI is open to all SUTD students — no prior quantum knowledge required.
					Reach out to our President to express your interest and we&apos;ll loop you in.
				</p>
				<div className="flex justify-center">
					<Button asChild size="lg">
						<a href="mailto:saamiya_khan@mymail.sutd.edu.sg?subject=Joining%20SQI">
							Apply to Join →
						</a>
					</Button>
				</div>
			</section>

			<Separator />

			{/* Contact */}
			<section className="container mx-auto max-w-2xl px-4 py-16">
				<h2 className="mb-4 text-center text-2xl font-bold">Get in Touch</h2>
				<p className="mb-8 text-center text-muted-foreground">
					Reach out to any of our EXCO members directly.
				</p>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border text-left text-muted-foreground">
								<th className="pb-2 pr-6 font-medium">Name</th>
								<th className="pb-2 pr-6 font-medium">Position</th>
								<th className="pb-2 font-medium">Email</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{[
								{ name: "Saamiya Khan", position: "President", email: "saamiya_khan" },
								{ name: "Tanmay Jha", position: "Vice President", email: "tanmay_jha" },
								{ name: "Popsuk Sumetchoengprachya", position: "Academic Lead", email: "popsuk_sumetchoengprachya" },
								{ name: "Ashley Simon", position: "Treasurer", email: "ashley_simon" },
								{ name: "Akhila Mokkapati", position: "Events Director", email: "akhila_mokkapati" },
								{ name: "Nguyen Bao Chau", position: "Secretary", email: "nguyen_bao_chau" },
							].map((person) => (
								<tr key={person.email}>
									<td className="py-3 pr-6 font-medium">{person.name}</td>
									<td className="py-3 pr-6 text-muted-foreground">{person.position}</td>
									<td className="py-3">
										<a
											className="underline underline-offset-4 hover:text-foreground text-muted-foreground"
											href={`mailto:${person.email}@mymail.sutd.edu.sg`}
										>
											{person.email}@mymail.sutd.edu.sg
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
