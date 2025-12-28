from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title='AI Lead Scorer')

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
fallback = False
if not os.path.exists(MODEL_PATH):
    # model not present: use a lightweight fallback so the service remains usable
    model = None
    fallback = True
else:
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        model = None
        fallback = True

import random

class _FallbackModel:
    def predict_proba(self, X):
        # return a probability for the positive class between 0.05 and 0.95
        return [[1 - (v := random.uniform(0.05, 0.95)), v] for _ in X]

if fallback and model is None:
    model = _FallbackModel()

class LeadPayload(BaseModel):
    monthly_qty: int
    price_fit: float
    certifications: int
    urgency_days: int

@app.get('/health')
def health():
    return {'service':'ai-lead-scorer','status':'ok','model_loaded': not fallback, 'using_fallback': fallback}

@app.post('/predict')
def predict(payload: LeadPayload):
    X = [[payload.monthly_qty, payload.price_fit, payload.certifications, payload.urgency_days]]
    try:
        score = float(model.predict_proba(X)[0][1])
    except Exception:
        # as a last resort, return a safe medium score
        score = 0.5

    recommendation = 'HIGH' if score > 0.7 else 'MEDIUM' if score > 0.4 else 'LOW'
    return {'score': score, 'recommendation': recommendation, 'using_fallback': fallback}
