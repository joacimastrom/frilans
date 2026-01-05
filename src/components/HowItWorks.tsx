import { BarChart3, Calculator, Lightbulb } from "lucide-react";
import MaxWidthSection from "./MaxWidthSection";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Calculator className="text-blue-600 w-10 h-10" />,
      title: "Fyll i intäkter och utgifter",
      description:
        "Ange ditt arvode och dina kostnader för att få en tydlig bild av din ekonomi.",
    },
    {
      icon: <BarChart3 className="text-blue-600 w-10 h-10" />,
      title: "Se skatter och resultat",
      description:
        "Se hur olika löner påverkar skatter, resultat och din totala inkomst.",
    },
    {
      icon: <Lightbulb className="text-blue-600 w-10 h-10" />,
      title: "Optimera dina beslut",
      description: "Jämför olika scenarion och minimera skatt eller maximera din inkomst.",
    },
  ];

  return (
    <MaxWidthSection id="how-it-works" className="bg-white">
      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
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
