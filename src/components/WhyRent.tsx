// components/WhyRentDress.tsx
const WhyRent: React.FC = () => {
    const reasons = [
      {
        title: 'Economia',
        description: 'Alugar um vestido é muito mais acessível do que comprar, permitindo que você use peças de alta qualidade sem comprometer seu orçamento.',
      },
      {
        title: 'Sustentabilidade',
        description: 'Ao alugar, você contribui para a moda consciente, reduzindo o desperdício e promovendo o reuso de peças únicas.',
      },
      {
        title: 'Exclusividade',
        description: 'Tenha acesso a vestidos exclusivos e sob medida para ocasiões especiais, sem a necessidade de armazenamento permanente.',
      },
      {
        title: 'Praticidade',
        description: 'Alugue, use e devolva! Sem preocupações com manutenção ou espaço no guarda-roupa após o evento.',
      },
    ];
  
    return (
      <section className="py-12 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-[Poppins-light] text-3xl text-[#641311] text-center mb-8 tracking-wide">
            Por que Alugar um Vestido?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white border border-[#cc936b] rounded-lg p-6 shadow-md text-center"
              >
                <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2">
                  {reason.title}
                </h3>
                <p className="font-[Poppins-light] text-gray-700 text-sm sm:text-base">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default WhyRent;