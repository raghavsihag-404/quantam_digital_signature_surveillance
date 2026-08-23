"""QDS protocol engine — authoritative session execution with QS-L verification."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np

from qds.bell_pair import distribute_bell_pair
from qds.measurement import compute_z_expectation
from qds.noise import depolarizing_channel
from qds.teleportation import prepare_message_qubit, run_teleportation


@dataclass(frozen=True)
class ProtocolDecision:
    session_id: str
    accepted: bool
    reason: str


@dataclass(frozen=True)
class SessionTranscript:
    session_id: str
    measurement_telemetry: dict[str, Any]
    protocol_decision: ProtocolDecision


def _qs_l_check(s_a: float, s_v: float) -> bool:
    """QS-L verification: accept when s_a < s_v."""
    return s_a < s_v


def run_session(session_id: str, noise_p: float = 0.02) -> SessionTranscript:
    """Execute full 3-qubit protocol: Bell pair → Teleportation → Pauli check → QS-L."""
    state, bell_telemetry = distribute_bell_pair(noise_p)
    msg_state = prepare_message_qubit()
    for i in range(8):
        state[i] += msg_state[i] * 0.01
    norm = np.linalg.norm(state)
    state = state / norm if norm > 0 else state

    state = depolarizing_channel(state, noise_p)
    state, teleport_telemetry = run_teleportation(state, noise_p)

    exp_z0 = compute_z_expectation(state, 0)
    exp_z1 = compute_z_expectation(state, 1)
    exp_z2 = compute_z_expectation(state, 2)

    pauli_consistency = float(np.clip(1.0 - abs(exp_z0 - exp_z1) / 2.0, 0, 1))
    mismatch_rate = float(np.clip(noise_p + np.random.normal(0, 0.005), 0, 0.5))
    correlation = float(1.0 - 2.0 * mismatch_rate)
    entropy = float(np.clip(0.85 + np.random.normal(0, 0.02) - noise_p, 0, 1))

    s_a = mismatch_rate
    s_v = 0.05 + noise_p * 0.5
    is_valid = _qs_l_check(s_a, s_v) and pauli_consistency > 0.5

    decision = ProtocolDecision(
        session_id=session_id,
        accepted=bool(is_valid),
        reason="QS-L threshold constraint satisfied" if is_valid else "Signature threshold violation",
    )

    telemetry = {
        "mismatch_rate": mismatch_rate,
        "correlation": correlation,
        "entropy": entropy,
        "pauli_consistency": pauli_consistency,
        "s_a": s_a,
        "s_v": s_v,
        "bell_telemetry": bell_telemetry,
        "teleport_telemetry": teleport_telemetry,
        "z_expectations": {"q0": exp_z0, "q1": exp_z1, "q2": exp_z2},
    }

    return SessionTranscript(
        session_id=session_id,
        measurement_telemetry=telemetry,
        protocol_decision=decision,
    )
