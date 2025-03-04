import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/600.css"; // Import specific weights if needed
import "@fontsource/inter/700.css"; // Bold
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Form from "./components/Form/Form";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100">
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
          <div className="text-xl font-bold text-blue-600">
            Frilanskalkylatorn
          </div>
          <ul className="flex space-x-6 text-gray-700">
            <li>
              <a href="#features" className="hover:text-blue-600">
                Hur det fungerar
              </a>
            </li>
            <li>
              <a href="#calculator" className="hover:text-blue-600">
                Räkna
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-600">
                Kontakt
              </a>
            </li>
          </ul>
        </nav>
        <main className="flex flex-col items-center min-h-screen py-8 ">
          <div className="max-w-[1020px] px-4">
            <Hero />
            <HowItWorks />
            <Form />
          </div>
        </main>
        <footer className="bg-gray-900 text-white text-center py-6 mt-12">
          <p className="text-sm">
            © 2024 Frilanskalkylatorn. Alla rättigheter förbehållna.
          </p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
