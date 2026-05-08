import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut, FiHome, FiBarChart2 } from 'react-icons/fi'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem('access_token')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-bold text-2xl text-purple-600">
              🎯 MockMate AI
            </Link>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                    <FiBarChart2 /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-purple-600">Login</Link>
                  <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2026 MockMate AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
