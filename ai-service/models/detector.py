import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

class SuspiciousRequestDetector:
    def __init__(self):
        # Isolation Forest trained on normal vs anomalous request features:
        # [units_required, requests_in_24h, duplicate_phone_flag]
        self.clf = IsolationForest(contamination=0.1, random_state=42)
        X_train = np.array([
            [1, 1, 0], [2, 1, 0], [3, 2, 0], [1, 1, 0], [4, 1, 0],
            [2, 2, 0], [1, 1, 0], [3, 1, 0], [2, 1, 0], [1, 1, 0],
            [50, 15, 1], [30, 20, 1], [100, 10, 1]  # Anomalies
        ])
        self.clf.fit(X_train)

    def analyze_request(self, units_required: int, requests_in_24h: int, duplicate_flag: int) -> dict:
        """
        Flags suspicious request activity for human admin review.
        """
        features = np.array([[units_required, requests_in_24h, duplicate_flag]])
        prediction = self.clf.predict(features)[0] # -1 = anomaly, 1 = normal
        score = self.clf.score_samples(features)[0]

        is_suspicious = bool(prediction == -1)

        return {
            "isSuspicious": is_suspicious,
            "anomalyScore": float(round(-score, 3)),
            "flaggedForAdminReview": is_suspicious,
            "recommendation": "FLAG_FOR_HUMAN_REVIEW" if is_suspicious else "NORMAL_PASS",
            "disclaimer": "AI detection provides administrative flags for review. It NEVER automatically bans accounts or alters medical eligibility."
        }
