from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ValidationError
import joblib
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title='AI Lead Scorer', version='1.0.0')

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
fallback = False
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        fallback = True
else:
    logger.warning("Model file not found, using fallback mode")
    fallback = True

import random

class _FallbackModel:
    def predict_proba(self, X):
        # return a probability for the positive class between 0.05 and 0.95
        return [[1 - (v := random.uniform(0.05, 0.95)), v] for _ in X]

if fallback:
    model = _FallbackModel()
    logger.info("Using fallback model")

class LeadPayload(BaseModel):
    monthly_qty: int
    price_fit: float
    certifications: int
    urgency_days: int

@app.get('/health')
def health():
    return {
        'service': 'ai-lead-scorer',
        'status': 'ok',
        'model_loaded': not fallback,
        'using_fallback': fallback,
        'version': '1.0.0'
    }

@app.post('/predict')
def predict(payload: LeadPayload):
    try:
        X = [[payload.monthly_qty, payload.price_fit, payload.certifications, payload.urgency_days]]
        proba = model.predict_proba(X)[0]
        score = float(proba[1])
        
        recommendation = 'HIGH' if score > 0.7 else 'MEDIUM' if score > 0.4 else 'LOW'
        
        return {
            'score': score,
            'recommendation': recommendation,
            'using_fallback': fallback,
            'confidence': 'high' if not fallback else 'low'
        }
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")
