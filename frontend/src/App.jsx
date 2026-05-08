import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial check and setup complete
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/interview/:id" element={token ? <InterviewPage /> : <Navigate to="/login" />} />
          <Route path="/results/:id" element={token ? <ResultsPage /> : <Navigate to="/login" />} />
          <Route path="/dev/mic" element={<DevMicPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
