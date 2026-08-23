"""Measurement utilities for the 3-qubit statevector simulator."""

from __future__ import annotations

import numpy as np


def measure_z(state: np.ndarray, qubit: int, n_qubits: int = 3) -> tuple[int, np.ndarray]:
    """Projective Z-basis measurement on a single qubit."""
    dim = 2**n_qubits
    probs = np.zeros(dim)
    for i in range(dim):
        bit = (i >> (n_qubits - 1 - qubit)) & 1
        if bit == 0:
            probs[i] = abs(state[i]) ** 2

    p0 = probs.sum()
    outcome = 0 if np.random.random() < p0 else 1

    collapsed = np.zeros(dim, dtype=complex)
    for i in range(dim):
        bit = (i >> (n_qubits - 1 - qubit)) & 1
        if bit == outcome:
            collapsed[i] = state[i]

    norm = np.linalg.norm(collapsed)
    if norm > 0:
        collapsed /= norm
    return outcome, collapsed


def compute_z_expectation(state: np.ndarray, qubit: int, n_qubits: int = 3) -> float:
    """Compute ⟨Z⟩ for a single qubit."""
    exp = 0.0
    for i in range(2**n_qubits):
        bit = (i >> (n_qubits - 1 - qubit)) & 1
        amp_sq = abs(state[i]) ** 2
        exp += amp_sq * (1 if bit == 0 else -1)
    return float(exp)
