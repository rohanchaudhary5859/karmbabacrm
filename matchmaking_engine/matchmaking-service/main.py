
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Matchmaking Engine")

class Lead(BaseModel):
    category: str
    price_min: float
    price_max: float
    country: str
    moq: int
    certifications: list

class Supplier(BaseModel):
    id: str
    categories: list
    price_min: float
    price_max: float
    country_pref: list
    capacity: int
    certifications: list

def score(lead: Lead, s: Supplier):
    product_fit = 1.0 if lead.category in s.categories else 0.0
    price_fit = 1.0 if (s.price_min <= lead.price_max and s.price_max >= lead.price_min) else 0.0
    loc_fit = 1.0 if lead.country in s.country_pref else 0.0
    cap_fit = min(1.0, s.capacity / max(1, lead.moq))
    cert_fit = len(set(lead.certifications).intersection(s.certifications)) / max(1,len(lead.certifications))
    final = product_fit*0.40 + price_fit*0.20 + loc_fit*0.15 + cap_fit*0.15 + cert_fit*0.10
    return final

@app.post("/score")
def score_single(lead: Lead, supplier: Supplier):
    return {"score": score(lead, supplier)}

@app.post("/rank")
def rank_suppliers(lead: Lead, suppliers: list[Supplier]):
    ranked=[]
    for s in suppliers:
        sc=score(lead,s)
        ranked.append({"supplier":s.id,"score":sc})
    ranked=sorted(ranked,key=lambda x:x["score"],reverse=True)
    return {"ranked":ranked}
