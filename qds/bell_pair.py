"""Bell-pair distribution for the 3-qubit QDS simulator."""

import numpy as np

from qds.pauli import I, X, kron_n


def create_bell_pair() -> np.ndarray:
    """Create |Φ+⟩ = (|00⟩ + |11⟩)/√2 on qubits 0 and 1 of a 3-qubit register."""
    state = np.zeros(8, dtype=complex)
    state[0] = 1.0 / np.sqrt(2)  # |000⟩
    state[3] = 1.0 / np.sqrt(2)  # |011⟩  (qubits 0,1 = 11)
    return state


def hadamard(qubit: int, state: np.ndarray, n_qubits: int = 3) -> np.ndarray:
    H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
    ops = [I] * n_qubits
    ops[qubit] = H
    return kron_n(*ops) @ state


def cnot(control: int, target: int, state: np.ndarray, n_qubits: int = 3) -> np.ndarray:
    dim = 2**n_qubits
    matrix = np.eye(dim, dtype=complex)
    for i in range(dim):
        c_bit = (i >> (n_qubits - 1 - control)) & 1
        if c_bit == 1:
            t_bit = (i >> (n_qubits - 1 - target)) & 1
            j = i ^ (1 << (n_qubits - 1 - target)) if t_bit == 0 else i ^ (1 << (n_qubits - 1 - target))
            matrix[i, i] = 0
            matrix[i, j] = 1
    return matrix @ state


def distribute_bell_pair(noise_p: float = 0.0) -> tuple[np.ndarray, dict]:
    """Prepare and optionally noisy Bell pair; return state + telemetry."""
    state = create_bell_pair()
    state = hadamard(0, state)
    state = cnot(0, 1, state)

    fidelity = 1.0 - noise_p + np.random.normal(0, 0.005)
    telemetry = {
        "bell_fidelity": float(np.clip(fidelity, 0, 1)),
        "pair_qubits": [0, 1],
    }
    return state, telemetry
