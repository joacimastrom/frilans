import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Form from "./components/Form/Form";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col items-center min-h-screen py-8 bg-blue-50">
        <div className="w-[1020px]">
          <Form />
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
