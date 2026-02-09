'use client'

import Link from 'next/link'
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#E7DED0] text-white py-8 w-full m-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="font-moondance text-3xl md:text-4xl text-[#82614A] tracking-wide"
            >
              Cláudia Andrade
            </Link>
            <p className="font-[Poppins-light] text-[#82614A] text-lg mt-2">
              Vestidos Finos
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-[Poppins-light] text-xl md:text-2xl text-[#82614A] mb-4">
              Contato
            </h3>
            <p className="font-[Poppins-light] text-sm md:text-base text-[#82614A]">
              E-mail : byclaudiaandrade@hotmail.com 
            </p>
            <p className="font-[Poppins-light] text-sm md:text-base text-[#82614A]">
              Telefone: (38) 3222-5704 
            </p>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-[Poppins-light] text-xl md:text-2xl text-[#82614A] mb-4">
              Siga-nos
            </h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <Link
                href="https://www.instagram.com/claudiaandradevestidoss/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-[#82614A] text-2xl hover:text-black transition-colors duration-300" />
              </Link>
              {/* <Link
                href="https://facebook.com/seuperfil"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="text-[#82614A] text-2xl hover:text-black transition-colors duration-300" />
              </Link> */}
              <Link
                href="https://wa.me/message/SGCAIYHEWCALP1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="text-[#82614A] text-2xl hover:text-black transition-colors duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="font-[Poppins-light] max-w-7xl mx-auto mt-8 text-center text-sm text-[#82614A]/80">
          © {new Date().getFullYear()} Seu Site. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer
