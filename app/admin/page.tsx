import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = registrations.reduce((s, r) => s + (r.totalAmount ?? 0), 0);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6 shadow-lg flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">FSE 2026 — Admin Dashboard</h1>
            <p className="text-blue-100 text-sm">Manage and export registrations</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/api/admin/export" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition">
              Export CSV
            </a>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Stat label="Total Registrations" value={registrations.length.toString()} />
          <Stat label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
          <Stat label="Today" value={registrations.filter(r => isSameDay(r.createdAt, new Date())).length.toString()} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <Th>Date</Th><Th>Name</Th><Th>Email</Th><Th>Type</Th>
                  <Th>Country</Th><Th>Item</Th><Th>Total</Th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">No registrations yet.</td></tr>
                )}
                {registrations.map(r => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <Td>{r.createdAt.toLocaleDateString()}</Td>
                    <Td>{r.firstName} {r.lastName}</Td>
                    <Td>{r.email}</Td>
                    <Td>{r.registrationType}</Td>
                    <Td>{r.country}</Td>
                    <Td>{r.mainItem ?? "—"}</Td>
                    <Td><span className="font-semibold text-blue-600">${r.totalAmount?.toFixed(2)}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-slate-700">{children}</td>;
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
