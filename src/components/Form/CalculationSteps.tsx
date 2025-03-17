import {
  Briefcase,
  CalendarDays,
  Coins,
  FileMinus,
  Percent,
  PiggyBank,
} from "lucide-react";
import MaxWidthSection from "../MaxWidthSection";

const CalculationSteps = () => {
  const steps = [
    {
      icon: <Briefcase className="text-blue-600 w-10 h-10" />,
      title: "1. Beräkna intäkter",
      description: "Timpris × Beläggningsgrad × 250 arbetsdagar.",
    },
    {
      icon: <CalendarDays className="text-blue-600 w-10 h-10" />,
      title: "2. Dra av semester",
      description: "Minskad intäkt baserat på valt antal semesterdagar.",
    },
    {
      icon: <FileMinus className="text-blue-600 w-10 h-10" />,
      title: "3. Dra av övriga kostnader",
      description: "Alla extra kostnader som påverkar resultatet.",
    },
    {
      icon: <Coins className="text-blue-600 w-10 h-10" />,
      title: "4. Beräkna lönekostnad",
      description: "Lön × Arbetsgivaravgift + Pensionskostnad dras av.",
    },
    {
      icon: <Percent className="text-blue-600 w-10 h-10" />,
      title: "5. Företagsskatt",
      description: "20,4% bolagsskatt dras av från vinsten.",
    },
    {
      icon: <PiggyBank className="text-blue-600 w-10 h-10" />,
      title: "6. Dra av max utdelning",
      description: "Kvarvarande vinst efter utdelning.",
    },
  ];

  return (
    <MaxWidthSection className="bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Så görs beräkningarna
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          Vi går igenom varje steg för att ge dig en tydlig översikt över dina
          inkomster och skatter.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto px-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-2 text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </MaxWidthSection>
  );
};

export default CalculationSteps;
