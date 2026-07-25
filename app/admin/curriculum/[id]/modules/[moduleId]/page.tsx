import { redirect } from "next/navigation";

export default async function ModulePage({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  redirect(`/admin/curriculum/${id}/modules/${moduleId}/topics`);
}
