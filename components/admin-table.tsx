"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteButton } from "./delete-button";

type Row = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationType: string;
  country: string;
  mainItem: string;
  totalAmount: number;
};

export function AdminTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const types = useMemo(() => Array.from(new Set(rows.map(r => r.registrationType))).sort(), [rows]);
  const countries = useMemo(() => Array.from(new Set(rows.map(r => r.country))).sort(), [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (typeFilter && r.registrationType !== typeFilter) return false;
      if (countryFilter && r.country !== countryFilter) return false;
      if (!q) return true;
      return (
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [rows, query, typeFilter, countryFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 md:items-center">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, email, or ID…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="fse-input w-full pl-9 min-w-0"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="fse-input w-full md:w-48">
          <option value="">All types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
          className="fse-input w-full md:w-44">
          <option value="">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="text-sm text-slate-600 whitespace-nowrap text-center md:text-right">
          <span className="font-semibold text-slate-900">{filtered.length}</span> of {rows.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <Th>Date</Th><Th>Name</Th><Th>Email</Th><Th>Type</Th>
              <Th>Country</Th><Th>Item</Th><Th>Total</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">
                {rows.length === 0 ? "No registrations yet." : "No results match your filters."}
              </td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                <Td>{new Date(r.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <span className="font-medium text-slate-900">{r.firstName} {r.lastName}</span>
                </Td>
                <Td><span className="text-slate-600">{r.email}</span></Td>
                <Td>{r.registrationType}</Td>
                <Td>{r.country}</Td>
                <Td>{r.mainItem || "—"}</Td>
                <Td><span className="font-semibold text-blue-600">${r.totalAmount.toFixed(2)}</span></Td>
                <Td>
                  <Link href={`/admin/${r.id}`}
                    className="text-blue-600 hover:text-blue-800 underline text-xs font-medium">
                    View
                  </Link>
                  <DeleteButton id={r.id} name={`${r.firstName} ${r.lastName}`}
                    variant="compact" onDeleted={() => router.refresh()} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-slate-700">{children}</td>;
}
