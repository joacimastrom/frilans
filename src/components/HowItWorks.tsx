import { BarChart3, Calculator, Lightbulb } from "lucide-react";
import MaxWidthSection from "./MaxWidthSection";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Calculator className="text-blue-600 w-10 h-10" />,
      title: "Fyll i dina uppgifter",
      description:
        "Ange din lön och eventuella avdrag för att få en detaljerad analys.",
    },
    {
      icon: <BarChart3 className="text-blue-600 w-10 h-10" />,
      title: "Se skatter och resultat",
      description:
        "Vi räknar ut hur skatter och avgifter påverkar din inkomst.",
    },
    {
      icon: <Lightbulb className="text-blue-600 w-10 h-10" />,
      title: "Optimera dina beslut",
      description: "Jämför olika scenarion för att fatta smartare beslut.",
    },
  ];

  return (
    <MaxWidthSection id="how-it-works" className="bg-white">
      <div className="mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">Så fungerar det</h2>
        <p className="mt-4 text-gray-600 text-lg">
          Få en tydlig bild av din ekonomi med vår enkla kalkylator.
        </p>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
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

export default HowItWorks;
