"""Quantum teleportation step for the QDS protocol."""

import numpy as np

from qds.pauli import I, X, Z, apply_single
from qds.bell_pair import cnot, hadamard
from qds.measurement import measure_z


def prepare_message_qubit(theta: float = np.pi / 4) -> np.ndarray:
    """Prepare message qubit |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ on qubit 2."""
    state = np.zeros(8, dtype=complex)
    c, s = np.cos(theta / 2), np.sin(theta / 2)
    state[2] = c   # |010⟩ qubit2=|0⟩
    state[6] = s   # |110⟩ qubit2=|1⟩
    norm = np.linalg.norm(state)
    return state / norm


def run_teleportation(state: np.ndarray, noise_p: float = 0.0) -> tuple[np.ndarray, dict]:
    """Execute teleportation circuit on 3-qubit register."""
    state = cnot(2, 0, state)
    state = hadamard(2, state)

    m0, state = measure_z(state, qubit=2)
    m1, state = measure_z(state, qubit=0)

    if m1 == 1:
        state = apply_single(1, X, state)
    if m0 == 1:
        state = apply_single(1, Z, state)

    success = np.random.random() > noise_p
    telemetry = {
        "m0": int(m0),
        "m1": int(m1),
        "teleport_success": bool(success),
        "noise_p": float(noise_p),
    }
    return state, telemetry
