from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from models.forecaster import BloodDemandForecaster
from models.detector import SuspiciousRequestDetector

app = FastAPI(
    title="LIFE-LINK AI/ML Analytics Service",
    description="Supporting FastAPI microservice for blood demand forecasting and administrative suspicious request detection.",
    version="1.0.0"
)

forecaster = BloodDemandForecaster()
detector = SuspiciousRequestDetector()

class DemandForecastRequest(BaseModel):
    bloodGroup: str
    periodDays: Optional[int] = 7

class SuspiciousAnalysisRequest(BaseModel):
    unitsRequired: int
    requestsIn24h: Optional[int] = 1
    duplicateFlag: Optional[int] = 0

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "LIFE-LINK Python FastAPI AI Engine",
        "modelsLoaded": ["DemandForecaster", "SuspiciousRequestDetector"]
    }

@app.post("/api/ai/demand-forecast")
def forecast_demand(req: DemandForecastRequest):
    return forecaster.forecast(req.bloodGroup, req.periodDays or 7)

@app.post("/api/ai/suspicious-request")
def detect_suspicious(req: SuspiciousAnalysisRequest):
    return detector.analyze_request(req.unitsRequired, req.requestsIn24h or 1, req.duplicateFlag or 0)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
