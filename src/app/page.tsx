// app/page.tsx
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/BannerHero';
import FAQSection from '@/components/Faq';
import Footer from '@/components/Footer';
import Highlights from '@/components/Highlights';
import WhyRent from '@/components/WhyRent';
import SocialProof from '@/components/SocialProof';
import WppBtn from '@/components/Wpp'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow">
        <HeroBanner />
        <Highlights />
        <WhyRent />
        <SocialProof />
        <FAQSection />
        <WppBtn 
            phone="5511999998888" 
            message="Olá gostaria de mais informações!" 
            position="bottom-right" 
            size={64} 
            theme="default"     
        />
      </main>

      {/* Rodapé */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
