"""Stage 1: Profile-likelihood mutual-consistency test."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from scipy.optimize import minimize_scalar

from qsentinel_monitor.quantum_evidence.collector import QuantumEvidence


@dataclass(frozen=True)
class Stage1Result:
    p_hat: float
    ll_ratio: float
    passed: bool
    details: str
    optimizer_converged: bool


def _neg_log_likelihood(p: float, m: float, n: int = 100) -> float:
    p = np.clip(p, 1e-9, 0.4999)
    return -(n * m * np.log(p) + n * (1 - m) * np.log(1 - p))


def run_stage1(evidence: QuantumEvidence, n: int = 100) -> Stage1Result:
    """Profile-likelihood test with explicit boundary optima handling."""
    m = evidence.mismatch_rate
    p0 = 0.02

    optimizer_converged = True
    try:
        result = minimize_scalar(
            lambda p: _neg_log_likelihood(p, m, n),
            bounds=(1e-6, 0.4999),
            method="bounded",
        )
        p_hat = float(result.x)
        optimizer_converged = result.success
    except Exception:
        p_hat = 0.0
        optimizer_converged = False

    ll_h0 = -_neg_log_likelihood(p0, m, n)
    ll_h1 = -_neg_log_likelihood(p_hat, m, n)
    ll_ratio = float(2 * (ll_h1 - ll_h0))

    if p_hat <= 1e-5:
        details = "Boundary optimum at p_hat=0 (honest model)"
        passed = True
    elif p_hat >= 0.499:
        details = "Boundary optimum at p_hat=0.5 (maximal mismatch)"
        passed = False
    elif ll_ratio < 3.84:
        details = f"Mutual consistency satisfied (LR={ll_ratio:.3f})"
        passed = True
    else:
        details = f"Likelihood ratio exceeds chi-sq threshold (LR={ll_ratio:.3f})"
        passed = False

    return Stage1Result(
        p_hat=p_hat,
        ll_ratio=ll_ratio,
        passed=passed,
        details=details,
        optimizer_converged=optimizer_converged,
    )
