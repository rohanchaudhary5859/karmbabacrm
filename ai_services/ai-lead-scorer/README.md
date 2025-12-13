AI Lead Scorer Service
----------------------
Purpose: Predicts a lead conversion probability and returns recommendation HIGH/MEDIUM/LOW.

How to use:
1. Install requirements: pip install -r requirements.txt
2. Train model (creates model.pkl): python train_model.py
3. Run service: uvicorn main:app --reload --port 8001
4. POST /predict with JSON: { monthly_qty, price_fit, certifications, urgency_days }
