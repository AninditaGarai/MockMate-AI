import os
from typing import List, Dict

try:
    # Newer OpenAI SDK exposes OpenAI; older versions may differ.
    from openai import OpenAI
    _HAS_OPENAI = True
except Exception:
    OpenAI = None
    _HAS_OPENAI = False


class QuestionGenerator:
    """Generate interview questions using OpenAI API"""
    
    def __init__(self):
        self.model = "gpt-4"
        self.client = None

        # Only create a client if the SDK is available and an API key is set.
        api_key = os.getenv("OPENAI_API_KEY")
        if _HAS_OPENAI and api_key:
            try:
                # Instantiate the client defensively; some installed versions
                # of the OpenAI package may not accept certain kwargs.
                self.client = OpenAI(api_key=api_key)
            except TypeError:
                # Fallback: try without keyword args
                try:
                    self.client = OpenAI(api_key)
                except Exception:
                    self.client = None
            except Exception:
                self.client = None
    
    def generate_questions(
        self,
        category: str,
        difficulty: str,
        count: int = 1
    ) -> List[Dict]:
        """Generate interview questions based on category and difficulty"""
        
        prompt = self._build_prompt(category, difficulty, count)
        
        # If we don't have a working OpenAI client, use fallbacks immediately.
        if not self.client:
            return self._get_fallback_questions(category, difficulty, count)

        try:
            # The OpenAI SDK surface can vary; attempt a few reasonable call patterns.
            # Preferred: new-style `client.chat.completions.create`
            if hasattr(self.client, "chat") and hasattr(self.client.chat, "completions"):
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert interview question generator. Generate realistic, challenging interview questions."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.7,
                    max_tokens=1500
                )
                raw_text = getattr(response.choices[0].message, "content", None) or getattr(response.choices[0], "text", "")
            else:
                # Try older OpenAI client pattern
                response = self.client.Completion.create(
                    engine=self.model,
                    prompt=prompt,
                    max_tokens=1500,
                    temperature=0.7
                )
                raw_text = response.choices[0].text

            # Parse the response
            questions = self._parse_response(raw_text)
            return questions

        except Exception as e:
            print(f"Error generating questions: {e}")
            return self._get_fallback_questions(category, difficulty, count)
    
    def _build_prompt(self, category: str, difficulty: str, count: int) -> str:
        """Build the prompt for question generation"""
        
        category_descriptions = {
            "SDE": "Software Development Engineer",
            "AI/ML": "Artificial Intelligence / Machine Learning",
            "HR": "Human Resources / Behavioral"
        }
        
        difficulty_descriptions = {
            "easy": "beginner level",
            "medium": "intermediate level",
            "hard": "advanced level"
        }
        
        cat_desc = category_descriptions.get(category, category)
        diff_desc = difficulty_descriptions.get(difficulty, difficulty)
        
        return f"""Generate {count} {diff_desc} interview questions for a {cat_desc} position.

For each question, provide:
1. Question text
2. Category tags (comma-separated)

Format each question as:
Q: [Question text]
Tags: [tags]

Make questions realistic, thought-provoking, and appropriate for the difficulty level."""
    
    def _parse_response(self, response_text: str) -> List[Dict]:
        """Parse the OpenAI response into structured questions"""
        questions = []
        
        lines = response_text.strip().split('\n')
        current_question = None
        
        for line in lines:
            if line.startswith('Q:'):
                if current_question:
                    questions.append(current_question)
                current_question = {
                    "text": line.replace('Q:', '').strip(),
                    "tags": ""
                }
            elif line.startswith('Tags:') and current_question:
                current_question["tags"] = line.replace('Tags:', '').strip()
        
        if current_question:
            questions.append(current_question)
        
        return questions
    
    def _get_fallback_questions(
        self,
        category: str,
        difficulty: str,
        count: int
    ) -> List[Dict]:
        """Fallback questions when API is unavailable"""
        
        fallback_db = {
            "SDE": {
                "easy": [
                    "Explain the difference between arrays and linked lists.",
                    "What is a time complexity analysis?",
                    "How do you reverse a string?",
                    "Explain what a hash map is.",
                    "What are the SOLID principles?"
                ],
                "medium": [
                    "Implement a binary search tree.",
                    "How would you detect a cycle in a linked list?",
                    "Explain the concept of inheritance in OOP.",
                    "What is the difference between synchronous and asynchronous programming?",
                    "How do databases use indexing?"
                ],
                "hard": [
                    "Design a distributed caching system.",
                    "Explain how microservices architecture differs from monolithic.",
                    "How would you optimize a slow database query?",
                    "Design a URL shortening service.",
                    "How do you handle data consistency in distributed systems?"
                ]
            },
            "AI/ML": {
                "easy": [
                    "What is machine learning?",
                    "Explain supervised vs unsupervised learning.",
                    "What is a neural network?",
                    "Explain what a dataset is.",
                    "What is feature normalization?"
                ],
                "medium": [
                    "Explain the concept of overfitting.",
                    "How do you handle missing data in a dataset?",
                    "What is cross-validation?",
                    "Explain the backpropagation algorithm.",
                    "What are activation functions?"
                ],
                "hard": [
                    "Design a recommendation system.",
                    "Explain attention mechanisms in transformers.",
                    "How do you handle imbalanced datasets?",
                    "Design a natural language processing pipeline.",
                    "Explain generative adversarial networks."
                ]
            },
            "HR": {
                "easy": [
                    "Tell me about yourself.",
                    "Why do you want to work with us?",
                    "What are your strengths?",
                    "What are your weaknesses?",
                    "Where do you see yourself in 5 years?"
                ],
                "medium": [
                    "Tell me about a time you faced a challenge.",
                    "Describe a situation where you led a team.",
                    "How do you handle conflict with colleagues?",
                    "What's your approach to problem-solving?",
                    "Can you give an example of a time you failed?"
                ],
                "hard": [
                    "Tell me about your most complex project.",
                    "How have you handled a difficult stakeholder?",
                    "Describe your experience managing technical teams.",
                    "What's your approach to mentoring junior developers?",
                    "Tell me about a time you had to make a tough decision."
                ]
            }
        }
        
        questions_list = fallback_db.get(category, {}).get(difficulty, [])
        
        questions = []
        for i, q in enumerate(questions_list[:count]):
            questions.append({
                "text": q,
                "tags": f"{category},{difficulty}"
            })
        
        return questions


def get_fallback_questions(category: str, difficulty: str, count: int = 1) -> List[Dict]:
    """Module-level fallback function so callers don't need to instantiate the class.

    This avoids instantiating the OpenAI client when the installed SDK is incompatible.
    """
    fallback_db = {
        "SDE": {
            "easy": [
                "Explain the difference between arrays and linked lists.",
                "What is a time complexity analysis?",
                "How do you reverse a string?",
                "Explain what a hash map is.",
                "What are the SOLID principles?"
            ],
            "medium": [
                "Implement a binary search tree.",
                "How would you detect a cycle in a linked list?",
                "Explain the concept of inheritance in OOP.",
                "What is the difference between synchronous and asynchronous programming?",
                "How do databases use indexing?"
            ],
            "hard": [
                "Design a distributed caching system.",
                "Explain how microservices architecture differs from monolithic.",
                "How would you optimize a slow database query?",
                "Design a URL shortening service.",
                "How do you handle data consistency in distributed systems?"
            ]
        },
        "AI/ML": {
            "easy": [
                "What is machine learning?",
                "Explain supervised vs unsupervised learning.",
                "What is a neural network?",
                "Explain what a dataset is.",
                "What is feature normalization?"
            ],
            "medium": [
                "Explain the concept of overfitting.",
                "How do you handle missing data in a dataset?",
                "What is cross-validation?",
                "Explain the backpropagation algorithm.",
                "What are activation functions?"
            ],
            "hard": [
                "Design a recommendation system.",
                "Explain attention mechanisms in transformers.",
                "How do you handle imbalanced datasets?",
                "Design a natural language processing pipeline.",
                "Explain generative adversarial networks."
            ]
        },
        "HR": {
            "easy": [
                "Tell me about yourself.",
                "Why do you want to work with us?",
                "What are your strengths?",
                "What are your weaknesses?",
                "Where do you see yourself in 5 years?"
            ],
            "medium": [
                "Tell me about a time you faced a challenge.",
                "Describe a situation where you led a team.",
                "How do you handle conflict with colleagues?",
                "What's your approach to problem-solving?",
                "Can you give an example of a time you failed?"
            ],
            "hard": [
                "Tell me about your most complex project.",
                "How have you handled a difficult stakeholder?",
                "Describe your experience managing technical teams.",
                "What's your approach to mentoring junior developers?",
                "Tell me about a time you had to make a tough decision."
            ]
        }
    }

    questions_list = fallback_db.get(category, {}).get(difficulty, [])
    questions = []
    for i, q in enumerate(questions_list[:count]):
        questions.append({"text": q, "tags": f"{category},{difficulty}"})

    return questions
