import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import backgroundImage from "/images/background.jpg";
import Index from "./pages/Index";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ItemDetail from "./pages/ItemDetail";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AuthLanding from "./pages/AuthLanding";
import Chat from "./pages/Chat";
import { useAuth } from "./hooks/useSupabase";

function AppContent() {
  const { data: session } = useAuth();

  if (!session) {
    return (
      <Router>
        <AuthLanding />
      </Router>
    );
  }

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
        <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lost" element={<LostItems />} />
              <Route path="/found" element={<FoundItems />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/report-lost" element={<ReportLost />} />
              <Route path="/report-found" element={<ReportFound />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
