import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { HomeScreen } from "@/components/HomeScreen";
import { HealthTimeline } from "@/components/HealthTimeline";
import { AddRecordForm } from "@/components/AddRecordForm";
import { LanguageSelector } from "@/components/LanguageSelector";
import { HospitalsPage } from "@/pages/HospitalsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <VoiceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/timeline" element={<HealthTimeline />} />
              <Route path="/add-record" element={<AddRecordForm />} />
              <Route path="/language" element={<LanguageSelector />} />
              <Route path="/hospitals" element={<HospitalsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </VoiceProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
