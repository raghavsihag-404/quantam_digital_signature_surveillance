"""Modular attack simulation strategies for QSENTINEL evaluation."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

from qds.protocol import SessionTranscript, run_session


@dataclass
class AttackResult:
    strategy: str
    transcript: SessionTranscript
    noise_override: float
    metadata: dict[str, Any]


class AttackStrategy(ABC):
    name: str

    @abstractmethod
    def execute(self, session_id: str) -> AttackResult:
        ...


class CleanForgery(AttackStrategy):
    name = "clean_forgery"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.001)
        return AttackResult(self.name, transcript, 0.001, {"type": "clean_forgery"})


class SubThresholdForgery(AttackStrategy):
    name = "sub_threshold_forgery"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.045)
        return AttackResult(self.name, transcript, 0.045, {"type": "sub_threshold"})


class ReplayAttack(AttackStrategy):
    name = "replay"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.02)
        return AttackResult(
            self.name,
            transcript,
            0.02,
            {"type": "replay", "replayed_session": f"{session_id}-prev"},
        )


class ImpersonationAttack(AttackStrategy):
    name = "impersonation"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.06)
        return AttackResult(self.name, transcript, 0.06, {"type": "impersonation"})


class UnauthorizedVerification(AttackStrategy):
    name = "unauthorized_verification"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.03)
        return AttackResult(
            self.name,
            transcript,
            0.03,
            {"type": "unauthorized", "scope": "invalid"},
        )


class ChannelManipulation(AttackStrategy):
    name = "channel_manipulation"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.12)
        return AttackResult(self.name, transcript, 0.12, {"type": "channel_manip"})


class LowAndSlowDrift(AttackStrategy):
    name = "low_and_slow_drift"

    def execute(self, session_id: str) -> AttackResult:
        transcript = run_session(session_id, noise_p=0.035)
        return AttackResult(self.name, transcript, 0.035, {"type": "low_slow_drift"})


ATTACK_REGISTRY: dict[str, AttackStrategy] = {
    cls.name: cls()
    for cls in [
        CleanForgery,
        SubThresholdForgery,
        ReplayAttack,
        ImpersonationAttack,
        UnauthorizedVerification,
        ChannelManipulation,
        LowAndSlowDrift,
    ]
}


def run_attack(strategy_name: str, session_id: str) -> AttackResult:
    if strategy_name not in ATTACK_REGISTRY:
        raise ValueError(f"Unknown attack strategy: {strategy_name}")
    return ATTACK_REGISTRY[strategy_name].execute(session_id)
