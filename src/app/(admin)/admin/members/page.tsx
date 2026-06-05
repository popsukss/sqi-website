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

type MemberForm = {
	name: string;
	role: string;
	bio: string;
	imageUrl: string;
	order: string;
};

const EMPTY_FORM: MemberForm = { name: "", role: "", bio: "", imageUrl: "", order: "0" };

export default function AdminMembersPage() {
	const utils = api.useUtils();
	const { data: members = [], isLoading } = api.member.getAll.useQuery();

	const [open, setOpen] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [form, setForm] = useState<MemberForm>(EMPTY_FORM);
	const [uploading, setUploading] = useState(false);

	const createMember = api.admin.createMember.useMutation({
		onSuccess: () => { void utils.member.getAll.invalidate(); setOpen(false); setForm(EMPTY_FORM); },
	});
	const updateMember = api.admin.updateMember.useMutation({
		onSuccess: () => { void utils.member.getAll.invalidate(); setOpen(false); setEditId(null); setForm(EMPTY_FORM); },
	});
	const deleteMember = api.admin.deleteMember.useMutation({
		onSuccess: () => { void utils.member.getAll.invalidate(); },
	});

	function openCreate() {
		setEditId(null);
		setForm(EMPTY_FORM);
		setOpen(true);
	}

	function openEdit(member: NonNullable<typeof members>[number]) {
		setEditId(member.id);
		setForm({
			name: member.name,
			role: member.role,
			bio: member.bio ?? "",
			imageUrl: member.imageUrl ?? "",
			order: String(member.order),
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
			name: form.name,
			role: form.role,
			bio: form.bio || undefined,
			imageUrl: form.imageUrl || undefined,
			order: Number(form.order),
		};
		if (editId) {
			updateMember.mutate({ id: editId, ...payload });
		} else {
			createMember.mutate(payload);
		}
	}

	const isPending = createMember.isPending || updateMember.isPending;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Members</h1>
				<Button onClick={openCreate}>Add member</Button>
			</div>

			{isLoading ? (
				<p className="text-muted-foreground text-sm">Loading…</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Order</TableHead>
							<TableHead className="w-24" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.map((member) => (
							<TableRow key={member.id}>
								<TableCell className="font-medium">{member.name}</TableCell>
								<TableCell className="text-muted-foreground text-sm">{member.role}</TableCell>
								<TableCell className="text-muted-foreground text-sm">{member.order}</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button size="sm" variant="outline" onClick={() => openEdit(member)}>
											Edit
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => deleteMember.mutate({ id: member.id })}
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
						<DialogTitle>{editId ? "Edit member" : "Add member"}</DialogTitle>
					</DialogHeader>
					<form className="space-y-3" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<Label htmlFor="name">Name</Label>
							<Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
						</div>
						<div className="space-y-1">
							<Label htmlFor="role">Club role</Label>
							<Input id="role" required value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
						</div>
						<div className="space-y-1">
							<Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
						</div>
						<div className="space-y-1">
							<Label htmlFor="order">Display order</Label>
							<Input id="order" min={0} type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} />
						</div>
						<div className="space-y-1">
							<Label>Photo</Label>
							<Input accept="image/*" type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleImageUpload(file); }} />
							{form.imageUrl && <p className="text-muted-foreground text-xs truncate">{form.imageUrl}</p>}
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
