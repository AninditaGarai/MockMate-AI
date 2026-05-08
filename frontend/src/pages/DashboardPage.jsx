import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay } from 'react-icons/fi'
import { userService, questionService } from '../services/api'
import { useInterviewStore } from '../store'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState([])
  const [selectedType, setSelectedType] = useState('SDE')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)

  const interviewTypes = ['SDE', 'AI/ML', 'HR']
  const difficulties = ['easy', 'medium', 'hard']

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    try {
      const userId = localStorage.getItem('user_id')
      if (userId) {
        const response = await userService.getUserInterviews(userId)
        setInterviews(response.data)
      }
    } catch (error) {
      console.error('Failed to load interviews:', error)
    }
  }

  const handleStartInterview = async () => {
    setLoading(true)
    try {
      // Start interview
      const interviewResponse = await userService.startInterview(selectedType, selectedDifficulty)
      const interviewId = interviewResponse.data.interview_id

      // Get questions
      const questionsResponse = await questionService.getQuestions(selectedType, selectedDifficulty)
      const startInterview = useInterviewStore.getState().startInterview
      const setQuestions = useInterviewStore.getState().setQuestions

      // Normalize response to an array (API may return { questions: [...] } or an array)
      let questionsArray = []
      if (Array.isArray(questionsResponse.data)) {
        questionsArray = questionsResponse.data
      } else if (questionsResponse.data && Array.isArray(questionsResponse.data.questions)) {
        questionsArray = questionsResponse.data.questions
      }

      startInterview(interviewResponse.data)
      setQuestions(questionsArray)

      navigate(`/interview/${interviewId}`)
    } catch (error) {
      console.error('Failed to start interview:', error)
      alert('Failed to start interview. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Start New Interview */}
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Start New Interview</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Interview Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {interviewTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
            >
              <FiPlay /> {loading ? 'Starting...' : 'Start Interview'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Recent Interviews</h2>
        
        {interviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No interviews yet. Start your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Type</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Difficulty</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Score</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{interview.type}</td>
                    <td className="px-4 py-3 capitalize">{interview.difficulty}</td>
                    <td className="px-4 py-3">
                      {interview.score ? (
                        <span className="font-bold text-purple-600">{interview.score.toFixed(2)}%</span>
                      ) : (
                        <span className="text-gray-500">In Progress</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{new Date(interview.started_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {interview.score && (
                        <button
                          onClick={() => navigate(`/results/${interview.id}`)}
                          className="text-purple-600 hover:text-purple-800 font-semibold"
                        >
                          View Results
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
