import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Files } from './pages/Files';
import { Analytics } from './pages/Analytics';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#fafbfc] flex flex-col">
          <Header />
          <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/files" element={<Files />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
