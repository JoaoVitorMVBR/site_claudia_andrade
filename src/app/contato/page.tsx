// app/contato/page.tsx
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow pt-20"> {/* Ajustado para o Navbar fixo */}
        <Contact />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}