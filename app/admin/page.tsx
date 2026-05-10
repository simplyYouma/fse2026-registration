import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { AdminTable } from "@/components/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = registrations.reduce((s, r) => s + (r.totalAmount ?? 0), 0);
  const todayCount = registrations.filter(r => isSameDay(r.createdAt, new Date())).length;

  const rows = registrations.map(r => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    registrationType: r.registrationType,
    country: r.country,
    mainItem: r.mainItem ?? "",
    totalAmount: r.totalAmount ?? 0,
  }));

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-lg flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">FSE 2026 — Admin Dashboard</h1>
            <p className="text-blue-100 text-xs sm:text-sm">Manage and export registrations</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/api/admin/export" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition text-sm">
              Export CSV
            </a>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Stat label="Total Registrations" value={registrations.length.toString()} />
          <Stat label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
          <Stat label="Today" value={todayCount.toString()} />
        </div>

        <AdminTable rows={rows} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
    </div>
  );
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
