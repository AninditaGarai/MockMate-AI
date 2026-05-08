import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiMic, FiMicOff, FiSend } from 'react-icons/fi'
import { feedbackService, userService } from '../services/api'
import { useInterviewStore } from '../store'

export default function InterviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const {
    questions,
    currentQuestionIndex,
    answers,
    scores,
    addAnswer,
    addScore,
    setQuestions,
    setCurrentQuestion,
    endInterview: endInterviewStore,
  } = useInterviewStore()

  const [isRecording, setIsRecording] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState(answers[questions[currentQuestionIndex]?.id] || '')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    if (questions.length === 0) {
      // If dev questions are present in localStorage, use them for testing.
      try {
        const dev = localStorage.getItem('dev_questions')
        if (dev) {
          const parsed = JSON.parse(dev)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed)
            return
          }
        }
      } catch (e) {
        // ignore
      }

      navigate('/dashboard')
    }
  }, [questions, navigate])

  // Speak the question aloud and optionally auto-start recording
  useEffect(() => {
    if (questions.length === 0) return
    const current = questions[currentQuestionIndex]
    if (!current) return

    // Text-to-Speech
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(current.text)
        utter.lang = 'en-US'
        window.speechSynthesis.speak(utter)
      }
    } catch (err) {
      console.warn('TTS not available:', err)
    }

    // Auto-start recording shortly after speaking (if not already recording)
    const t = setTimeout(() => {
      if (!isRecording) startRecording()
    }, 1200)

    return () => clearTimeout(t)
  }, [currentQuestionIndex, questions])

  if (questions.length === 0) {
    return <div className="text-center py-8">Loading...</div>
  }

  const currentQuestion = questions[currentQuestionIndex]
  const hasAnswer = !!answers[currentQuestion?.id]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await handleVoiceSubmit(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleVoiceSubmit = async (audioBlob) => {
    setLoading(true)
    try {
      const response = await feedbackService.evaluateVoiceAnswer(
        id,
        currentQuestion.id,
        audioBlob
      )

      setFeedback(response.data)
      addAnswer(currentQuestion.id, response.data.transcribed_text)
      addScore(currentQuestion.id, {
        confidence: response.data.confidence_score,
        grammar: response.data.grammar_score,
        technical: response.data.technical_score,
        overall: response.data.overall_score,
      })
    } catch (error) {
      console.error('Error evaluating voice:', error)
      alert('Failed to evaluate voice answer')
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = async () => {
    setLoading(true)
    try {
      const response = await feedbackService.evaluateAnswer(
        id,
        currentQuestion.id,
        currentAnswer,
        false
      )

      setFeedback(response.data)
      addAnswer(currentQuestion.id, currentAnswer)
      addScore(currentQuestion.id, {
        confidence: response.data.confidence_score,
        grammar: response.data.grammar_score,
        technical: response.data.technical_score,
        overall: response.data.overall_score,
      })
    } catch (error) {
      console.error('Error evaluating answer:', error)
      alert('Failed to evaluate answer')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1)
      const nextQuestion = questions[currentQuestionIndex + 1]
      setCurrentAnswer(answers[nextQuestion.id] || '')
      setFeedback(null)
    }
  }

  const handleFinish = async () => {
    try {
      await userService.endInterview(id)
      endInterviewStore()
      navigate(`/results/${id}`)
    } catch (error) {
      console.error('Error ending interview:', error)
      alert('Failed to end interview')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2">
          <div
            className="h-full bg-white transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Header */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Interview ID: {id}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-lg text-gray-800 font-semibold">{currentQuestion.text}</p>
          </div>

          {/* Answer Input */}
          {!feedback ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Your Answer</label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-vertical"
                  rows="6"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleTextSubmit}
                  disabled={loading || !currentAnswer.trim()}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
                >
                  <FiSend /> {loading ? 'Evaluating...' : 'Submit Answer'}
                </button>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                >
                  {isRecording ? <FiMicOff /> : <FiMic />}
                  {isRecording ? 'Stop' : 'Record'}
                </button>
              </div>
            </div>
          ) : (
            /* Feedback Display */
            <div className="space-y-6">
              <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Feedback</h3>
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Confidence</p>
                  <p className="text-3xl font-bold text-blue-600">{feedback.confidence_score}</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Grammar</p>
                  <p className="text-3xl font-bold text-green-600">{feedback.grammar_score}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Technical</p>
                  <p className="text-3xl font-bold text-purple-600">{feedback.technical_score}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Overall</p>
                  <p className="text-3xl font-bold text-pink-600">{feedback.overall_score}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {currentQuestionIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
                  >
                    Next Question
                  </button>
                )}
                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    onClick={handleFinish}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Finish Interview
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
