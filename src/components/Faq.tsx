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
      question: "É necessário fazer agendamento?",
      answer: "Sim, trabalhamos exclusivamente com agendamento prévio para garantir um atendimento personalizado. Você pode agendar através do nosso site ou pelo telefone."
    },
    {
      question: "Quais são as políticas de ajuste?",
      answer: "Oferecemos ajustes gratuitos em até 30 dias após a entrega, desde que o item não tenha sido usado. Ajustes adicionais podem ser cobrados separadamente."
    },
    {
      question: "Como funcionam as trocas?",
      answer: "Aceitamos trocas em até 15 dias após a entrega, desde que o produto esteja em perfeito estado e com a embalagem original."
    },
    {
      question: "Qual é a política de cancelamento?",
      answer: "Cancelamentos podem ser feitos até 48 horas antes do horário agendado sem custo. Após esse período, pode ser cobrada uma taxa de 30%."
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
        <h2 className="font-[Poppins-light] text-3xl font-bold text-[#641311] text-center mb-8">
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