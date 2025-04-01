
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import TermsAndConditions from "./pages/TermsAndConditions";
import KnowClaudia from "./pages/KnowClaudia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="bg-[#142126] min-h-screen">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/know-claudia" element={<KnowClaudia />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
