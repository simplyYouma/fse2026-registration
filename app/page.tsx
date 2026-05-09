import RegistrationForm from "@/components/registration-form";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 md:px-6">
      <RegistrationForm />
      <Footer />
    </main>
  );
}
