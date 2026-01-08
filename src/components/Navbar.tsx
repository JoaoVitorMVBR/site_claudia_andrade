'use client'

import Link from 'next/link'
import { useState } from 'react'

// Definindo a interface para os itens do menu
interface NavItem {
  name: string
  href: string
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Vestidos', href: '/produtos' },
    // { name: 'Contato', href: '/contato' },
    { name: 'Sobre Nós', href: '/sobre' },
    // { name: 'Painel', href: '/adm/produtos' },
  ]

  const LinkWrapper = ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
    const isStorybook = typeof window === 'undefined'
    return isStorybook ? (
      <a href={href} {...props}>
        {children}
      </a>
    ) : (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <nav className="bg-[#ffffff] text-white fixed w-full z-20 top-0 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-[#000000] hover:text-white hover:bg-[#cc936b]/10 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Abrir menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:flex-initial">
            <LinkWrapper
              href="/"
              className="font-moondance text-3xl sm:text-4xl md:text-5xl text-[#000000] tracking-wide hover:text-[#000000]/80 transition-colors duration-300 whitespace-nowrap"
            >
              Cláudia Andrade
            </LinkWrapper>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <LinkWrapper
                key={item.name}
                href={item.href}
                className="font-[Poppins-light] text-[#000000] text-base md:text-sm relative group hover:text-black transition-colors duration-200"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#000000] group-hover:w-full transition-all duration-300 ease-in-out" />
              </LinkWrapper>
            ))}
          </div>

          {/* Espaço vazio para balancear o layout no mobile */}
          <div className="flex-1 md:hidden"></div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute w-full left-0 top-20 bg-[#ffffff] shadow-lg animate-slideDown">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navItems.map((item) => (
                <LinkWrapper
                  key={item.name}
                  href={item.href}
                  className="font-[Poppins-light] block px-4 py-2 text-[#000000] hover:text-white hover:bg-[#000000]/10 text-xl sm:text-2xl rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </LinkWrapper>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
