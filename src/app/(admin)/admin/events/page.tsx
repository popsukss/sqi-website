"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

type EventForm = {
	title: string;
	date: string;
	description: string;
	imageUrl: string;
};

const EMPTY_FORM: EventForm = { title: "", date: "", description: "", imageUrl: "" };

export default function AdminEventsPage() {
	const utils = api.useUtils();
	const { data: events = [], isLoading } = api.event.getAll.useQuery();

	const [open, setOpen] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [form, setForm] = useState<EventForm>(EMPTY_FORM);
	const [uploading, setUploading] = useState(false);

	const createEvent = api.admin.createEvent.useMutation({
		onSuccess: () => { void utils.event.getAll.invalidate(); setOpen(false); setForm(EMPTY_FORM); },
	});
	const updateEvent = api.admin.updateEvent.useMutation({
		onSuccess: () => { void utils.event.getAll.invalidate(); setOpen(false); setEditId(null); setForm(EMPTY_FORM); },
	});
	const deleteEvent = api.admin.deleteEvent.useMutation({
		onSuccess: () => { void utils.event.getAll.invalidate(); },
	});

	function openCreate() {
		setEditId(null);
		setForm(EMPTY_FORM);
		setOpen(true);
	}

	function openEdit(event: NonNullable<typeof events>[number]) {
		setEditId(event.id);
		setForm({
			title: event.title,
			date: event.date.toISOString().slice(0, 10),
			description: event.description,
			imageUrl: event.imageUrl ?? "",
		});
		setOpen(true);
	}

	async function handleImageUpload(file: File) {
		setUploading(true);
		const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
			method: "POST",
			body: file,
		});
		const data = await res.json() as { url: string };
		setForm((f) => ({ ...f, imageUrl: data.url }));
		setUploading(false);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const payload = {
			title: form.title,
			date: new Date(form.date),
			description: form.description,
			imageUrl: form.imageUrl || undefined,
		};
		if (editId) {
			updateEvent.mutate({ id: editId, ...payload });
		} else {
			createEvent.mutate(payload);
		}
	}

	const isPending = createEvent.isPending || updateEvent.isPending;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Events</h1>
				<Button onClick={openCreate}>Add event</Button>
			</div>

			{isLoading ? (
				<p className="text-muted-foreground text-sm">Loading…</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="w-24" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{events.map((event) => (
							<TableRow key={event.id}>
								<TableCell className="font-medium">{event.title}</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{new Date(event.date).toLocaleDateString()}
								</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button size="sm" variant="outline" onClick={() => openEdit(event)}>
											Edit
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => deleteEvent.mutate({ id: event.id })}
										>
											Delete
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{editId ? "Edit event" : "Add event"}</DialogTitle>
					</DialogHeader>
					<form className="space-y-3" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								required
								value={form.title}
								onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor="date">Date</Label>
							<Input
								id="date"
								required
								type="date"
								value={form.date}
								onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								required
								value={form.description}
								onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
							/>
						</div>
						<div className="space-y-1">
							<Label>Image</Label>
							<Input
								accept="image/*"
								type="file"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) void handleImageUpload(file);
								}}
							/>
							{form.imageUrl && (
								<p className="text-muted-foreground text-xs truncate">{form.imageUrl}</p>
							)}
						</div>
						<Button className="w-full" disabled={isPending || uploading} type="submit">
							{isPending ? "Saving…" : editId ? "Update" : "Create"}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
