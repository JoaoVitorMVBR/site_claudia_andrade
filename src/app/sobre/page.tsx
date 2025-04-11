// app/sobre/page.tsx
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow pt-20"> {/* Ajustado para o Navbar fixo */}
        <About />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}