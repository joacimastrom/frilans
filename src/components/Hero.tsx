import MaxWidthSection from "./MaxWidthSection";
import { Button } from "./ui/button";

const Hero = () => (
  <MaxWidthSection as="header">
    <div className="relative flex flex-col items-center justify-center text-center px-6 mt-12">
      <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
        Frilanskalkylatorn
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">
        Beräkna och visualisera hur olika löner påverkar skatter, resultat och
        din inkomst – fatta smartare och mer optimerade beslut.
      </p>
      <a href="#calculate">
        <Button
          size="lg"
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
        >
          Börja räkna nu
        </Button>
      </a>
    </div>
  </MaxWidthSection>
);

export default Hero;
