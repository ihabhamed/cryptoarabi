
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Airdrop from "./pages/Airdrop";
import AirdropDetail from "./pages/AirdropDetail";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminAirdropForm from "./pages/AdminAirdropForm";
import AdminBlogForm from "./pages/AdminBlogForm";
import AdminServiceForm from "./pages/AdminServiceForm";
import NotFound from "./pages/NotFound";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WindowFocusHandler from "./components/WindowFocusHandler";

// Create a client
const queryClient = new QueryClient();

// Make sure App is declared as a function component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WindowFocusHandler />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/airdrop" element={<Airdrop />} />
              <Route path="/airdrop/:id" element={<AirdropDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/airdrops/new" 
                element={
                  <ProtectedRoute>
                    <AdminAirdropForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/airdrops/edit/:id" 
                element={
                  <ProtectedRoute>
                    <AdminAirdropForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog/new" 
                element={
                  <ProtectedRoute>
                    <AdminBlogForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog/edit/:id" 
                element={
                  <ProtectedRoute>
                    <AdminBlogForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/services/new" 
                element={
                  <ProtectedRoute>
                    <AdminServiceForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/services/edit/:id" 
                element={
                  <ProtectedRoute>
                    <AdminServiceForm />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
