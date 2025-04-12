// app/page.tsx
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/BannerHero';
import FAQSection from '@/components/Faq';
import Footer from '@/components/Footer';
import WhyRent from '@/components/WhyRent'
<<<<<<< HEAD
=======
import Highlights from '@/components/Highlights'

>>>>>>> feature/WhyRent

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow">
        {/* Banner Hero */}
        <HeroBanner />

<<<<<<< HEAD
=======
        {/* Destaques */}
        <Highlights/>
        
>>>>>>> feature/WhyRent
        {/* porque alugar */}
        <WhyRent/>
        
        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Rodapé */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
