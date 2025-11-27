import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import ROIQuiz from "./pages/ROIQuiz";
import LayoutWrapper from "./LayoutWrapper";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LayoutWrapper>
          <div className="appomate-roi-calculator" style={{ isolation: 'isolate' }}>
            <ROIQuiz />
          </div>
        </LayoutWrapper>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
