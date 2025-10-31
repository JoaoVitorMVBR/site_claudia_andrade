'use client';

// components/FAQSection.tsx
import { useState } from 'react';

// Interface para os dados do FAQ
interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  // Estado com tipagem para controlar qual pergunta está aberta
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Lista de perguntas e respostas com tipagem
  const faqData: FAQItem[] = [
    {
      question: "Quais os melhores dias para ir na loja?",
      answer: "Terça , quarta e quinta."
    },
    {
      question: "Vocês enviam para todo Brasil?",
      answer: "Sim, enviamos para todo Brasil."
    },
    {
      question: "Precisa agendar horário?",
      answer: "Não precisa agendar horário, nosso atendimento é por ordem de chegada."
    },
    {
      question: "Vocês ajustam os vestidos?",
      answer: "Sim, fazemos os ajustes necessários."
    },
    {
      question: "O frete é por conta da loja ou do cliente?",
      answer: "O frete é por conta do cliente."
    }
  ];

  // Função tipada para toggle da pergunta
  const toggleQuestion = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full mx-auto">
        {/* Título */}
        <h2 className="font-[Poppins-light] text-3xl text-[#641311] text-center mb-8">
          Perguntas Frequentes
        </h2>

        {/* Lista de perguntas */}
        <div className="space-y-4 w-full">
        {faqData.map((item: FAQItem, index: number) => (
            <div 
              key={index} 
              className="border border-[#cc936b] rounded-lg overflow-hidden w-full"
            >
              {/* Pergunta - Botão clicável */}
              <button
                onClick={() => toggleQuestion(index)}
                className="font-[Poppins-light] w-full text-left px-4 py-4 sm:px-6 flex justify-between items-center focus:outline-none"
              >
                <span className="font-[Poppins-light] text-[#641311] font-semibold text-sm sm:text-base">
                  {item.question}
                </span>
                <span className="text-[#cc936b] text-lg sm:text-xl">
                  {openIndex === index ? '-' : '+'}
                </span>
              </button>

              {/* Resposta - Aparece quando aberto */}
              {openIndex === index && (
                <div className="px-4 py-4 sm:px-6 bg-[#cc936b]/10">
                  <p className="font-[Poppins-light] text-gray-700 text-sm sm:text-base">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mensagem final */}
        <p className="font-[Poppins-light] text-center mt-8 text-[#641311] italic">
          Ainda tem dúvidas? Entre em contato conosco!
        </p>
      </div>
    </section>
  );
};

export default FAQSection;