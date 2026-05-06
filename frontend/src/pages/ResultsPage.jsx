import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { feedbackService } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ResultsPage() {
  const { id } = useParams()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    loadFeedback()
  }, [id])

  const loadFeedback = async () => {
    try {
      const response = await feedbackService.getFeedbackHistory(id)
      setFeedback(response.data)
      
      // Prepare data for chart
      const data = response.data.map((item, index) => ({
        question: `Q${index + 1}`,
        confidence: item.confidence_score,
        grammar: item.grammar_score,
        technical: item.technical_score,
        overall: item.overall_score,
      }))
      setChartData(data)
    } catch (error) {
      console.error('Error loading feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>
  }

  const averageScores = {
    confidence: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.confidence_score, 0) / feedback.length).toFixed(2) : 0,
    grammar: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.grammar_score, 0) / feedback.length).toFixed(2) : 0,
    technical: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.technical_score, 0) / feedback.length).toFixed(2) : 0,
    overall: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.overall_score, 0) / feedback.length).toFixed(2) : 0,
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">Avg Confidence</p>
          <p className="text-4xl font-bold text-blue-600">{averageScores.confidence}</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">Avg Grammar</p>
          <p className="text-4xl font-bold text-green-600">{averageScores.grammar}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">Avg Technical</p>
          <p className="text-4xl font-bold text-purple-600">{averageScores.technical}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-xl shadow-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">Overall Score</p>
          <p className="text-4xl font-bold text-pink-600">{averageScores.overall}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Performance Trend</h2>
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="confidence" stroke="#3b82f6" />
              <Line type="monotone" dataKey="grammar" stroke="#10b981" />
              <Line type="monotone" dataKey="technical" stroke="#a855f7" />
              <Line type="monotone" dataKey="overall" stroke="#f43f5e" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detailed Feedback */}
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Detailed Feedback</h2>
        <div className="space-y-6">
          {feedback.map((item, index) => (
            <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Question {index + 1}</h3>
              
              <div className="bg-gray-50 p-4 rounded mb-4">
                <p className="text-gray-700"><strong>Your Answer:</strong> {item.answer}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-700"><strong>Feedback:</strong> {item.feedback}</p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold text-blue-600">{item.confidence_score}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Grammar</p>
                  <p className="text-2xl font-bold text-green-600">{item.grammar_score}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Technical</p>
                  <p className="text-2xl font-bold text-purple-600">{item.technical_score}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Overall</p>
                  <p className="text-2xl font-bold text-pink-600">{item.overall_score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
