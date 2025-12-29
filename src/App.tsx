import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import backgroundImage from "/images/background.jpg";
import Index from "./pages/Index";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ItemDetail from "./pages/ItemDetail";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lost" element={<LostItems />} />
              <Route path="/found" element={<FoundItems />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/report-lost" element={<ReportLost />} />
              <Route path="/report-found" element={<ReportFound />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;
