import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import BookNow from "./pages/BookNow";
import Consultation from "./pages/Consultation";
import SecondOpinion from "./pages/SecondOpinion";
import DocumentUpload from "./pages/DocumentUpload";
import RefundPolicy from "./pages/RefundPolicy";
import DoctorLogin from "./pages/admin/DoctorLogin";
import DoctorDashboard from "./pages/admin/DoctorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Book />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/second-opinion" element={<SecondOpinion />} />
          <Route path="/document-upload" element={<DocumentUpload />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/admin/login" element={<DoctorLogin />} />
          <Route path="/doctor-portal" element={<DoctorLogin />} />
          <Route path="/admin/dashboard" element={<DoctorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
