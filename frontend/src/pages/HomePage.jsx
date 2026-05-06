import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlay, FiTrendingUp } from 'react-icons/fi'

export default function HomePage() {
  const isAuthenticated = !!localStorage.getItem('access_token')

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Questions',
      description: 'Dynamic questions generated across SDE, AI/ML, and HR domains'
    },
    {
      icon: '🎤',
      title: 'Multi-Modal Input',
      description: 'Answer questions via text or voice to simulate real interviews'
    },
    {
      icon: '📊',
      title: 'Intelligent Feedback',
      description: 'Get detailed feedback on confidence, grammar, and technical accuracy'
    },
    {
      icon: '📈',
      title: 'Performance Tracking',
      description: 'Track your progress and identify areas for improvement'
    },
    {
      icon: '⚙️',
      title: 'Hybrid AI + ML',
      description: 'OpenAI API with local ML model fallback for reliability'
    },
    {
      icon: '🌐',
      title: 'Responsive UI',
      description: 'Clean, intuitive interface built with React and Tailwind CSS'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center text-white py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">MockMate AI</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100">
          Master Your Interview Skills with AI-Powered Practice
        </p>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-200">
          Practice realistic interview scenarios, get intelligent feedback, and track your progress with our advanced AI Interview Simulator
        </p>
        
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 flex items-center gap-2">
              <FiPlay /> Start Interview
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/login" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl p-8 text-white text-center">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">1000+</div>
            <p className="text-lg">Interview Questions</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">3</div>
            <p className="text-lg">Categories (SDE, AI/ML, HR)</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">3</div>
            <p className="text-lg">Difficulty Levels</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-white rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to ace your interviews?</h2>
          <p className="text-gray-600 mb-6 text-lg">Join thousands of users preparing for their dream jobs</p>
          <Link to="/register" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700">
            Start Free Trial
          </Link>
        </section>
      )}
    </div>
  )
}
