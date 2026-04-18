import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import SellPropertyPage from './pages/SellPropertyPage';
import AdminPage from './pages/AdminPage';

function AdminGuard() {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/?login=1" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/sell" element={<SellPropertyPage />} />
          <Route path="/admin" element={<AdminGuard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
