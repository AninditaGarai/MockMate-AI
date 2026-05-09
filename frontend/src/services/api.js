import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_URL || '/api'
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

const withAuthHeader = (headers = {}) => {
  const token = localStorage.getItem('access_token')
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add authorization token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  register: (email, username, password, fullName) =>
    apiClient.post('/auth/register', { email, username, password, full_name: fullName }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  getCurrentUser: () =>
    apiClient.get('/auth/me'),
}

export const questionService = {
  generateQuestions: (category, difficulty, count) =>
    apiClient.post('/questions/generate', { category, difficulty, count }),
  
  getQuestions: (category, difficulty) =>
    apiClient.get('/questions/all', { params: { category, difficulty } }),
  
  getQuestion: (id) =>
    apiClient.get(`/questions/${id}`),
}

export const feedbackService = {
  evaluateAnswer: (interviewId, questionId, answerText, useMlModel = false) =>
    apiClient.post('/feedback/evaluate', {
      interview_id: interviewId,
      question_id: questionId,
      answer_text: answerText,
      use_ml_model: useMlModel,
    }),
  
  evaluateVoiceAnswer: (interviewId, questionId, audioFile) => {
    const formData = new FormData()
    formData.append('audio_file', audioFile)
    return apiClient.post(
      `/feedback/evaluate-voice?interview_id=${interviewId}&question_id=${questionId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  },
  
  getFeedbackHistory: (interviewId) =>
    apiClient.get(`/feedback/history/${interviewId}`),
}

export const userService = {
  startInterview: (interviewType, difficulty) => {
    return apiClient.post(
      '/users/start-interview',
      { interview_type: interviewType, difficulty },
      { headers: withAuthHeader() }
    )
  },
  
  endInterview: (interviewId) =>
    apiClient.post(`/users/end-interview/${interviewId}`),
  
  getUserPerformance: (userId) =>
    apiClient.get(`/users/performance/${userId}`),
  
  getUserInterviews: (userId) =>
    apiClient.get(`/users/interviews/${userId}`),
}

export const modelService = {
  trainLocalModel: (trainingData) =>
    apiClient.post('/models/train-local-model', trainingData),
  
  getModelStatus: () =>
    apiClient.get('/models/model-status'),
}

export default apiClient
