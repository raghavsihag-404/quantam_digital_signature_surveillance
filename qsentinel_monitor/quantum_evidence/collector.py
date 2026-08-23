"""Extract mismatch rate, correlation, entropy, and Pauli-correction consistency."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class QuantumEvidence:
    mismatch_rate: float
    correlation: float
    entropy: float
    pauli_consistency: float


def collect_evidence(telemetry: dict[str, Any]) -> QuantumEvidence:
    """Extract quantum evidence metrics from measurement telemetry."""
    m = float(telemetry.get("mismatch_rate", 0.0))
    c = float(telemetry.get("correlation", 1.0 - 2.0 * m))
    h = float(telemetry.get("entropy", 0.85))
    pauli = float(telemetry.get("pauli_consistency", 1.0))
    return QuantumEvidence(
        mismatch_rate=m,
        correlation=c,
        entropy=h,
        pauli_consistency=pauli,
    )
