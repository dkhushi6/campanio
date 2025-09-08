from pydantic import BaseModel
from typing import List

class StressInput(BaseModel):
    mood: str
    sleep: float
    workload: int

class StressOutput(BaseModel):
    stress_level: str
    tips: List[str]
