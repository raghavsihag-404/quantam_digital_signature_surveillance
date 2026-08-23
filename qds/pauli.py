"""Pauli operator matrices for 3-qubit statevector simulator."""

import numpy as np

I = np.eye(2, dtype=complex)
X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)

PAULI = {"I": I, "X": X, "Y": Y, "Z": Z}


def kron_n(*ops: np.ndarray) -> np.ndarray:
    result = ops[0]
    for op in ops[1:]:
        result = np.kron(result, op)
    return result


def apply_single(qubit: int, op: np.ndarray, state: np.ndarray, n_qubits: int = 3) -> np.ndarray:
    ops = [I] * n_qubits
    ops[qubit] = op
    matrix = kron_n(*ops)
    return matrix @ state
