"""Experiment runners for Monte Carlo calibration."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np


def run_monte_carlo_calibration(n_simulations: int = 1000) -> dict:
    """Monte Carlo calibration routine for rejection thresholds."""
    mismatch_rates = np.random.beta(2, 50, size=n_simulations) * 0.15
    rejection_threshold = float(np.percentile(mismatch_rates, 99))
    s_sprt_threshold = float(np.percentile(mismatch_rates / 0.02, 99))
    s_gate_threshold = float(np.percentile(1.0 - mismatch_rates * 2, 1))

    artifact = {
        "rejection_threshold": rejection_threshold,
        "s_sprt_threshold": max(s_sprt_threshold, 2.0),
        "s_gate_threshold": max(s_gate_threshold, 0.01),
        "metadata": {
            "calibration_method": "monte_carlo",
            "n_simulations": n_simulations,
            "confidence": 0.99,
        },
    }

    canonical = json.dumps(artifact, sort_keys=True, separators=(",", ":"))
    artifact["content_hash"] = hashlib.sha256(canonical.encode()).hexdigest()

    out_path = Path(__file__).resolve().parent.parent / "db" / "calibration.json"
    out_path.write_text(json.dumps(artifact, indent=2))
    return artifact
