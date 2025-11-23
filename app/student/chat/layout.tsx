import { AuthGuard } from "@/components/auth-guard";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </AuthGuard>
  );
}