Phase 6 — AI Automation Engine (Lead Scorer, Reply Generator, Product Optimizer)
------------------------------------------------------------------------------
Services included:
- ai-lead-scorer (FastAPI)  -> port 8001
- ai-reply-gen    (FastAPI) -> port 8002
- ai-product-opt  (FastAPI) -> port 8003

For each service:
1. cd <service>
2. pip install -r requirements.txt
3. (For lead-scorer) run: python train_model.py  # creates model.pkl
4. run: uvicorn main:app --reload --port <port>

Example usage (node):
node integration_examples/call_ai_examples.js
