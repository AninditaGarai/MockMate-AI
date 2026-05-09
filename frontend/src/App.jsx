import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InterviewPage from './pages/InterviewPage'
import DashboardPage from './pages/DashboardPage'
import ResultsPage from './pages/ResultsPage'
import DevMicPage from './pages/DevMicPage'
import { useAuthStore } from './store'
import './App.css'

function App() {
  const token = useAuthStore((state) => state.token)

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/interview/:id" element={token ? <InterviewPage /> : <Navigate to="/login" replace />} />
          <Route path="/results/:id" element={token ? <ResultsPage /> : <Navigate to="/login" replace />} />
          <Route path="/dev/mic" element={<DevMicPage />} />
          <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
