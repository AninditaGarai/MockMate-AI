import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('access_token', token)
    set({ token })
  },
  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, token: null })
  },
}))

export const useInterviewStore = create((set) => ({
  currentInterview: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  scores: {},
  
  startInterview: (interview) => set({ currentInterview: interview, answers: {}, scores: {} }),
  setQuestions: (questions) => set({ questions }),
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  addAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  addScore: (questionId, score) =>
    set((state) => ({
      scores: { ...state.scores, [questionId]: score },
    })),
  endInterview: () => set({ currentInterview: null, questions: [], answers: {}, scores: {} }),
}))
