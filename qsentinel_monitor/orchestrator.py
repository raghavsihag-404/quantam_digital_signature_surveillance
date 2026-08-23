"""QSENTINEL monitoring orchestrator — advisory-only analysis pipeline."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from qds.protocol import ProtocolDecision, SessionTranscript
from qsentinel_monitor.glr_cusum import GLRCusumMonitor
from qsentinel_monitor.protocol_evidence.fsm import ProtocolFSM
from qsentinel_monitor.quantum_evidence.collector import collect_evidence
from qsentinel_monitor.stage1 import run_stage1
from qsentinel_monitor.stage2 import CalibrationArtifact, load_calibration, run_stage2

_CALIBRATION_PATH = Path(__file__).resolve().parent.parent / "db" / "calibration.json"
_fsm = ProtocolFSM()
_cusum = GLRCusumMonitor()
_calibration: CalibrationArtifact | None = None
_sequence_counter = 0


def get_calibration() -> CalibrationArtifact:
    global _calibration
    if _calibration is None:
        _calibration = load_calibration(_CALIBRATION_PATH)
    return _calibration


@dataclass(frozen=True)
class MonitoringDecision:
    session_id: str
    verdict: str
    advisory: bool = True
    details: str = ""
    stage1_passed: bool = True
    stage2_passed: bool = True
    fsm_passed: bool = True
    cusum_value: float = 0.0
    drift_detected: bool = False


def analyze(transcript: SessionTranscript, protocol_decision: ProtocolDecision) -> MonitoringDecision:
    """Run full advisory monitoring pipeline. NEVER mutates protocol_decision."""
    global _sequence_counter
    _sequence_counter += 1

    fsm_result = _fsm.check(transcript.session_id, _sequence_counter)
    evidence = collect_evidence(transcript.measurement_telemetry)
    stage1 = run_stage1(evidence)
    stage2 = run_stage2(evidence, stage1, get_calibration())
    cusum_update = _cusum.update(transcript.session_id, evidence.mismatch_rate)

    if not fsm_result.passed:
        verdict = "MODEL_INVALID"
        details = fsm_result.details
    elif not stage1.optimizer_converged:
        verdict = "FLAG_INVESTIGATE"
        details = "Stage 1 optimizer failure — manual review recommended"
    elif not stage1.passed or stage2.verdict == "FLAG_REJECT":
        verdict = stage2.verdict
        details = stage2.details
    elif stage2.verdict == "FLAG_INVESTIGATE" or cusum_update.drift_detected:
        verdict = "FLAG_INVESTIGATE"
        details = stage2.details if stage2.verdict == "FLAG_INVESTIGATE" else "CUSUM drift threshold crossed"
    else:
        verdict = "ACCEPT"
        details = stage2.details

    return MonitoringDecision(
        session_id=transcript.session_id,
        verdict=verdict,
        advisory=True,
        details=details,
        stage1_passed=stage1.passed,
        stage2_passed=stage2.passed,
        fsm_passed=fsm_result.passed,
        cusum_value=cusum_update.cusum_value,
        drift_detected=cusum_update.drift_detected,
    )
