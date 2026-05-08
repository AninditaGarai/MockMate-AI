import { useState } from 'react'
import { feedbackService } from '../services/api'

export default function DevMicPage() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [interviewId, setInterviewId] = useState('')
  const [questionId, setQuestionId] = useState('')

  const handleUpload = async () => {
    if (!file || !interviewId || !questionId) return alert('Select file and set interview/question IDs')
    setLoading(true)
    try {
      const resp = await feedbackService.evaluateVoiceAnswer(interviewId, questionId, file)
      setResult(resp.data)
    } catch (err) {
      setResult({ error: err.message || 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Dev: Upload Audio for Evaluation</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Interview ID</label>
          <input value={interviewId} onChange={(e)=>setInterviewId(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold">Question ID</label>
          <input value={questionId} onChange={(e)=>setQuestionId(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold">Audio File</label>
          <input type="file" accept="audio/*" onChange={(e)=>setFile(e.target.files[0])} />
        </div>
        <div>
          <button onClick={handleUpload} className="bg-purple-600 text-white px-4 py-2 rounded" disabled={loading}>{loading? 'Sending...':'Send Audio'}</button>
        </div>
        {result && (
          <pre className="bg-gray-100 p-4 rounded mt-4">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
