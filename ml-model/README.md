# ML Model Training and Evaluation Module

This directory contains machine learning models for interview feedback evaluation.

## Structure

```
ml-model/
├── models/              # Trained models storage
├── data/                # Training datasets
├── notebooks/           # Jupyter notebooks for experimentation
├── scripts/             # Training and evaluation scripts
└── README.md            # ML documentation
```

## Training

To train a custom model:

```python
from backend.services.ml_trainer import MLTrainer

trainer = MLTrainer()
training_data = [
    {
        "question": "...",
        "answer": "...",
        "confidence_score": 85,
        "grammar_score": 90,
        "technical_score": 75,
        "overall_score": 83
    },
    # ... more training samples
]
trainer.train(training_data)
```

## Features

- Answer length and structure analysis
- Confidence indicator detection
- Technical term recognition
- Grammar complexity assessment
- Ensemble learning with Random Forest

## Model Evaluation

The model evaluates interviews based on:
1. **Confidence Score**: Presence of confident language and assertiveness
2. **Grammar Score**: Language quality and structure
3. **Technical Score**: Accuracy and depth of technical content
4. **Overall Score**: Weighted combination of all metrics
