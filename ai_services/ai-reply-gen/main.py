from fastapi import FastAPI
from pydantic import BaseModel
import os
import random

app = FastAPI(title='AI Reply Generator')

class ReplyPayload(BaseModel):
    buyer_message: str
    product: str = None
    tone: str = 'professional'  # professional / friendly / brief

templates = {
    'professional': [
        "Namaste. Thank you for your message regarding {product}. We can supply MOQ as discussed. Please share required delivery timeline and destination.",
        "Hello, thanks for contacting KARM BABA about {product}. We will check availability and share quotation within 24 hours."
    ],
    'friendly': [
        "Hi! 👋 Thanks for asking about {product}. We'll get back with price and timeline soon.",
        "Hey! Glad you reached out about {product}. Can you tell us quantity and destination?"
    ],
    'brief': [
        "Received. ETA & price will be shared shortly for {product}.",
        "Thanks. Share quantity & destination for {product}."
    ]
}

@app.get('/health')
def health():
    return {'service':'ai-reply-gen','status':'ok'}

@app.post('/generate')
def generate(payload: ReplyPayload):
    tone = payload.tone if payload.tone in templates else 'professional'
    tpl = random.choice(templates[tone])
    product = payload.product or 'the product'
    text = tpl.format(product=product)
    if len(payload.buyer_message) > 0:
        text += ' (Ref: "{}")'.format(payload.buyer_message[:80])
    return {'reply': text}
