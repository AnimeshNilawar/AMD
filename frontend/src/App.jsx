import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/list/:category" element={<ListPage />} />
              <Route path="/place/:id" element={<DetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </ChatProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
