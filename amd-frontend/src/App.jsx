import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ChatProvider } from './context/ChatContext';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list/:category" element={<ListPage />} />
            <Route path="/place/:id" element={<DetailPage />} />
          </Routes>
        </ChatProvider>
      </ToastProvider>
    </Router>
  );
}
