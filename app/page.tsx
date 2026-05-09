import RegistrationForm from "@/components/registration-form";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 md:px-6">
      <RegistrationForm />
      <footer className="max-w-4xl mx-auto mt-8 text-center text-xs text-slate-500">
        <p>© 2026 ESEC/FSE — Association for Computing Machinery</p>
      </footer>
    </main>
  );
}
