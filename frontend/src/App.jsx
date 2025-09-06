import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ItemsPage from "./pages/ItemsPage";
import CartPage from "./pages/CartPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
      return (
            <AuthProvider>
                  <Router>
                        <Navbar />
                        <Routes>
                              <Route path="/" element={<ItemsPage />} />
                              <Route
                                    path="/cart"
                                    element={
                                          <ProtectedRoute>
                                                <CartPage />
                                          </ProtectedRoute>
                                    }
                              />
                              <Route path="/login" element={<LoginPage />} />
                              <Route path="/signup" element={<SignupPage />} />
                        </Routes>
                  </Router>
            </AuthProvider>
      );
}
