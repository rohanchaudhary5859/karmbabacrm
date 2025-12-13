from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title='AI Lead Scorer')

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
if not os.path.exists(MODEL_PATH):
    # model not present: instruct user to run train_model.py
    model = None
else:
    model = joblib.load(MODEL_PATH)

class LeadPayload(BaseModel):
    monthly_qty: int
    price_fit: float
    certifications: int
    urgency_days: int

@app.get('/health')
def health():
    return {'service':'ai-lead-scorer','status':'ok','model_loaded': bool(model)}

@app.post('/predict')
def predict(payload: LeadPayload):
    if model is None:
        return {'error':'model not trained. Run train_model.py to create model.pkl'}
    X = [[payload.monthly_qty, payload.price_fit, payload.certifications, payload.urgency_days]]
    score = float(model.predict_proba(X)[0][1])
    recommendation = 'HIGH' if score>0.7 else 'MEDIUM' if score>0.4 else 'LOW'
    return {'score': score, 'recommendation': recommendation}
