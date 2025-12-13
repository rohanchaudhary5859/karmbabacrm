# Train a simple synthetic lead scoring model and save it to model.pkl
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

# Synthetic dataset: features -> [monthly_qty, price_fit_score (0-1), certifications_count, urgency_days]
N = 1000
rng = np.random.default_rng(42)
monthly_qty = rng.integers(1, 10000, size=N)
price_fit = rng.random(size=N)
certs = rng.integers(0,5,size=N)
urgency = rng.integers(1,60,size=N)
# Create a target: conversion more likely when monthly_qty high, price_fit high, certs>=1, urgency low
y = ((monthly_qty>2000) & (price_fit>0.6) & (certs>=1) & (urgency<30)).astype(int)

X = pd.DataFrame({
    'monthly_qty': monthly_qty,
    'price_fit': price_fit,
    'certs': certs,
    'urgency': urgency
})
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
joblib.dump(model, 'model.pkl')
print('Trained model saved to model.pkl')
