import Navbar from '@/components/Navbar';
import Login from '@/components/Login';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow pt-20">
        <Login />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}