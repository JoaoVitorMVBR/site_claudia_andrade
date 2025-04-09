// components/Contact.tsx
'use client';

import { useState, FormEvent } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica para enviar o formulário (ex.: API)
    console.log('Formulário enviado:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
          Entre em Contato
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-white border border-[#cc936b] rounded-lg p-6 shadow-md">
            {submitted ? (
              <p className="text-[#641311] text-center text-lg">
                Obrigado por sua mensagem! Entraremos em contato em breve.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="font-[Poppins-light] block text-[#641311] mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cc936b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#cc936b] text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="font-[Poppins-light] block text-[#641311] mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cc936b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#cc936b] text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="font-[Poppins-light] block text-[#641311] mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cc936b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#cc936b] text-gray-700 resize-y min-h-[120px]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="font-[Poppins-light] w-full bg-[#641311] text-white py-2 rounded-md hover:bg-[#cc936b] transition-colors duration-300"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>

          {/* Informações de Contato */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="text-center">
              <h3 className="font-[Poppins-light] text-2xl text-[#641311] mb-2">Fale Conosco</h3>
              <p className="text-gray-700 font-[Poppins-light]">Estamos aqui para ajudar você!</p>
            </div>
            <div className="space-y-4">
              <p className="text-[#641311]">
                <span className="font-[Poppins-light]">E-mail:</span>{' '}
                <a href="mailto:contato@ateliesofia.com" className="font-[Poppins-light] text-[#cc936b] hover:underline">
                  contato@ateliesofia.com
                </a>
              </p>
              <p className="font-[Poppins-light] text-[#641311]">
                <span className="font-[Poppins-light]">Telefone:</span> (11) 99999-9999
              </p>
              <p className="font-[Poppins-light] text-[#641311]">
                <span className="font-semibold">Endereço:</span> Rua das Flores, 123, São Paulo - SP
              </p>
            </div>
            <div className="font-[Poppins-light] flex justify-center space-x-4">
              <a href="#" className="text-[#cc936b] hover:text-[#641311] transition-colors duration-300">
                Instagram
              </a>
              <a href="#" className="text-[#cc936b] hover:text-[#641311] transition-colors duration-300">
                Facebook
              </a>
              <a href="#" className="text-[#cc936b] hover:text-[#641311] transition-colors duration-300">
                Pinterest
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;