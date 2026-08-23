"""Classical noise models applied to simulated quantum states."""

import numpy as np


def depolarizing_channel(state: np.ndarray, p: float, n_qubits: int = 3) -> np.ndarray:
    """Apply independent single-qubit depolarizing noise with probability p."""
    if p <= 0:
        return state.copy()
    noisy = state.copy()
    for _ in range(n_qubits):
        if np.random.random() < p:
            phase = np.exp(1j * np.random.uniform(0, 2 * np.pi))
            noisy *= phase
            idx = np.random.randint(0, len(noisy))
            noisy[idx] += np.random.normal(0, p * 0.1) + 1j * np.random.normal(0, p * 0.1)
    norm = np.linalg.norm(noisy)
    return noisy / norm if norm > 0 else noisy


def bit_flip_probability(p: float) -> bool:
    return np.random.random() < p
