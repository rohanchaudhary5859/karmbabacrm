from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title='AI Product Optimizer')

class ProductPayload(BaseModel):
    name: str
    specs: dict = {}
    price_min: float = 0.0
    price_max: float = 0.0
    moq: int = 0
    packaging: str = None

@app.get('/health')
def health():
    return {'service':'ai-product-opt','status':'ok'}

@app.post('/suggest')
def suggest(payload: ProductPayload):
    suggestions = []
    if payload.moq < 100:
        suggestions.append('Consider raising MOQ to improve margins if you can handle it.')
    if payload.price_max and payload.price_min and payload.price_max - payload.price_min < 10:
        suggestions.append('Widen price range to allow negotiation room.')
    if not payload.packaging:
        suggestions.append('Add packaging details (carton, poly-bag) to improve buyer confidence.')
    score = 50 + min(50, (payload.moq/1000)*10)
    return {'suggestions': suggestions, 'score_estimate': round(score,1)}
