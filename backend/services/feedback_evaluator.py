import os
from openai import OpenAI
import re

class FeedbackEvaluator:
    """Evaluate answers using OpenAI API"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4"
    
    def evaluate(self, question: str, answer: str) -> dict:
        """Evaluate an answer against a question"""
        
        prompt = f"""You are an expert interview evaluator. Evaluate the following answer to an interview question.

Question: {question}

Answer: {answer}

Provide your evaluation in the following JSON format:
{{
    "confidence_score": <0-100>,
    "grammar_score": <0-100>,
    "technical_score": <0-100>,
    "overall_score": <0-100>,
    "feedback": "Your detailed feedback here"
}}

Consider:
- Confidence: How confident does the answer seem?
- Grammar: Quality of language and expression
- Technical: Accuracy and depth of technical knowledge
- Overall: General quality of the response

Respond ONLY with valid JSON."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert interview evaluator. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=500
            )
            
            # Parse JSON response
            import json
            evaluation = json.loads(response.choices[0].message.content)
            return evaluation
        
        except Exception as e:
            print(f"Error evaluating answer: {e}")
            return self._get_fallback_evaluation(question, answer)
    
    def _get_fallback_evaluation(self, question: str, answer: str) -> dict:
        """Fallback evaluation when API is unavailable"""
        
        # Simple heuristic-based evaluation
        answer_length = len(answer.split())
        
        # Basic scoring logic
        confidence_score = min(95, 40 + (answer_length // 10))
        grammar_score = 75  # Would need grammar checking library
        technical_score = 65  # Would need more sophisticated analysis
        overall_score = (confidence_score + grammar_score + technical_score) // 3
        
        feedback = f"""
This is a fallback evaluation (local model):
- Answer length: {answer_length} words
- The response attempts to address the question
- Grammar and clarity could be improved
- Technical depth is moderate

For more detailed feedback, ensure the OpenAI API is properly configured.
"""
        
        return {
            "confidence_score": confidence_score,
            "grammar_score": grammar_score,
            "technical_score": technical_score,
            "overall_score": overall_score,
            "feedback": feedback.strip()
        }
