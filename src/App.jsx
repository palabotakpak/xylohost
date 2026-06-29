import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { ErrorBoundary } from "react-error-boundary";
import { Icon } from "@iconify/react";
import { ThemeProvider } from "./lib/ThemeContext";
import Navbar from "./components/Navbar";

const HomePage = lazy(() => import("./pages/HomePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function Fallback({ error, resetErrorBoundary }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md text-center">
        <Icon icon="tabler:alert-triangle" width="48" height="48" className="mx-auto mb-4 text-gold opacity-80" />
        <h1 className="font-brand text-xl font-black uppercase tracking-tight text-white mb-2">
          Something went wrong
        </h1>
        <p className="font-display text-sm text-ash mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center justify-center h-[42px] px-5 bg-gold text-black font-mono text-xs font-bold uppercase tracking-[0.05em] cursor-pointer hover:bg-[#f6cd4b] transition-colors"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ErrorBoundary FallbackComponent={Fallback} onReset={() => window.location.reload()}>
        <motion.main
          key={location.pathname}
          {...pageTransition}
          transition={{ duration: 0.2 }}
        >
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="font-mono text-xs text-ash uppercase tracking-[0.2em]">Loading...</div>
              </div>
            }
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Suspense>
        </motion.main>
      </ErrorBoundary>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Navbar />
            <AnimatedRoutes />
            <Toaster
              theme="system"
              position="bottom-right"
              toastOptions={{
                className: "font-display text-sm",
              }}
            />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
