# Architecture


---

## 1. Executive Verdict

**The architecture is ready to freeze at the structural level. It is not yet ready to freeze at the numeric-claim level.**

Of the eleven audit findings, none require a new module, a removed module, or a change to the pipeline's overall shape (protocol-state gate → model-fit → joint statistical decision → cross-session detection → optional forensic attribution). This confirms v5's own conclusion and the audit's own verdict ("no module needs replacement, removal, or structural reordering"). What changes in this freeze are: one explicit policy statement that was structurally missing (F3 — the single most consequential finding), one reframing of what the quantum-evidence vector actually provides (F1), one procedural guarantee made binding rather than aspirational (F2), one documentation/complexity clarification (F6), one previously-pending test condition made mandatory and specified (F8), two compliance-language corrections (F9, F10), and one added validation task (F5). Nothing is added that increases runtime complexity; nothing load-bearing is removed.

Two items remain genuinely open and are frozen as *named, prioritized empirical work*, not as unresolved architecture: the Stage 2 joint Monte Carlo calibration (now bound to a mandatory train/evaluate split), and the full harness re-run — including the new unauthorized-verification condition — under the architecture as specified here. Until these run, quantitative claims are stated as designed, not demonstrated, exactly as the audit requires.

---

## 2. Final Design Decisions

| Finding | Decision | Keep/Fix/Remove/Replace | Justification | Expected Advantage |
|---|---|---|---|---|
| F1 — observable redundancy (m, C, H are functions of one parameter `p` under H0) | Reframe the evidence model; do not remove any observable | **FIX (reframe)** | Under H0 the three are provably redundant as *independent* estimators, exactly as the audit shows from the document's own formulas. But under the attack hypotheses already in the harness (Pauli-structured manipulation, unmodeled/structural burst), the attack does not respect the depolarizing model's symmetry, so it breaks the fixed m–C–H relationship the honest model predicts. Testing *joint consistency* of the triad against that relationship is therefore a real structural signal, not a cosmetic fourth feature — and it is exactly what Stage 1's goodness-of-fit already computes. The fix is to state this precisely instead of implying four independent features. | Corrects an overstated-rigor claim into a defensible one at zero implementation cost; strengthens rather than weakens the credibility of Stage 1/Stage 2 against a hostile reviewer who checks the math |
| F2 — calibration leakage in Stage 2's joint rejection region | Make train/evaluate separation a binding procedural constraint | **FIX** | The audit is correct that "maximize power against the declared attack set" does not currently state separation from the evaluation trials. This is a one-line procedural fix with no architectural cost. | Removes the single largest threat to the credibility of every future detection-rate figure |
| F3 — undefined interaction between a QSENTINEL flag and the protocol's own deterministic acceptance | QSENTINEL is fixed as **annotate/escalate-only**; it never overrides, blocks, or delays the protocol's own deterministic accept/reject decision on a legitimate signature | **FIX (policy statement, no new component)** | This is the audit's own "if no" branch: stating this explicitly is sufficient to make "deterministic acceptance of legitimate signatures under explicitly stated assumptions" a true claim about the *deployed system*, not only about the protocol in isolation. The added explicit assumption is precisely the one PS-141 asks for: "under explicitly defined assumptions." | Closes the most consequential open finding in the audit at zero complexity cost; directly satisfies a PS-141-quoted requirement |
| F4 — unexamined staged-pipeline-vs-unified-Bayesian-framework alternative | No change | **ACCEPT AS EXPLICIT LIMITATION** | No evidence exists in either direction; the governing synthesis rule ("only consider an alternative if there is evidence or strong reasoning that it can produce a meaningful advantage") is not met. Plausibility is explicitly not sufficient grounds under Section 7 of the governing framework. | Avoids unjustified architectural churn; the question is named honestly rather than silently dropped |
| F5 — Stage 1's profile-likelihood critical value relies on asymptotics unverified at n≈200 | Add empirical (simulation-based) small-sample validation of the critical value as a required outstanding task | **VALIDATE EXPERIMENTALLY** | A known general statistical concern, directly applicable at the stated sample size; resolvable by simulation, not by redesign | Prevents shipping an unverified asymptotic assumption as a settled result |
| F6 — GLR-CUSUM complexity understated (nontrivial `sup_θ` per window-start, not stated as closed-form) | Clarify: for this exponential-family (Bernoulli/binomial-type) noise model, `sup_θ` per window-start is the sample-proportion MLE — closed form — so true complexity is `O(w)` elementary operations | **FIX (documentation only)** | The audit itself flags this as likely self-resolving if closed-form; it is closed-form for the declared noise family. No architecture change, only a precise complexity statement. | Removes a legitimate complexity-accounting gap without touching the design |
| F7 — all headline figures measured under a superseded architecture | Every quantitative figure, wherever quoted, carries its "measured under the prior architecture, pending re-run" caveat at the point of use | **FIX (documentation discipline)** | Already correctly flagged once in the source document; the audit's point is that a correct caveat stated once is not the same as a caveat repeated everywhere the number is used | Prevents a stale figure from being misquoted out of context in a demo or writeup |
| F8 — unauthorized verification untested across 4+ review rounds | Add a fully specified seventh Monte Carlo condition: a party without valid authorization-scope credentials submits a verification request; confirm FSM's deterministic rejection | **MUST FIX (execute, not redesign)** | The mechanism (FSM authorization-scope check) is architecturally sound and already used for the same class of check elsewhere; the gap was a missing test, not a missing detector. The competitor research patch confirms no more general mechanism exists in the literature to adopt instead — FSM is the correct, sufficient home. | Closes a required PS-141 threat category with a concrete, specified, no-longer-deferrable test; ends a four-round credibility problem |
| F9 — impersonation coverage overstated relative to category label | Restate compliance language with the same explicit scope qualifier used elsewhere: detects missing/invalid/expired tokens; does not detect a validly-issued token in illegitimate hands (dependent on classical-channel authentication integrity, out of scope) | **FIX (language only)** | Direct, traceable overstatement relative to the document's own stated assumption | Removes an easy, low-cost line of attack for a hostile reviewer |
| F10 — "verification accuracy analysis" not represented as a distinct PS-141 deliverable | Define and add: legitimate-session acceptance-rate sweep across a range of honest noise levels (e.g., `p ∈ {0.01, …, 0.10}`), reported separately from attack-condition false-positive results | **FIX (new evaluation report, no new component)** | Uses the existing simulator; closes a literal PS-141 wording gap without adding architecture | Directly answers a named PS-141 evaluation requirement instead of leaving it implicit in the false-positive column |
| F11 — AI/ML terminology-conflation risk in a live demo/Q&A | No architectural action; add a rehearsed, precise explanation to presentation materials | **REJECT AS SPECULATIVE (architecturally)** | The architecture contains no learned model, no training corpus, no generalization mechanism — verified by construction against the standard AI/ML definition. This is a communication risk, not a design flaw, exactly as the audit itself concludes. | Avoids wasting final-polish effort on a non-defect |

---

## 3. Final Proposed Solution

QSENTINEL remains a runtime, non-AI/ML statistical monitoring layer sitting alongside a teleportation-distributed QS-L variant, observing only the classical measurement telemetry the protocol already discloses. Its core architectural discipline is unchanged and is what this freeze re-confirms rather than replaces: deterministic protocol-state evidence and probabilistic quantum-measurement evidence are kept structurally separate, every statistical component must show independent, ablation-measured marginal value, and no independent-threshold composition is trusted where a jointly calibrated one is available.

What this freeze adds, precisely, is closure on the two questions the audit correctly identified as load-bearing and previously unanswered:

1. **What does a flag actually do?** QSENTINEL never overrides the protocol's own deterministic acceptance of a legitimate signature. Its REJECT/INVESTIGATE/MODEL_INVALID outputs are advisory: they produce a signed forensic log entry and a SOC-facing alert, and nothing else. This is now a binding design constraint, not an implicit assumption.
2. **What does the quantum-evidence vector actually provide?** Two independent quantities, not four: a refined estimate of the channel's depolarizing parameter `p` (obtained from three physically distinct measurement-derived estimators — mismatch rate, correlation, entropy — whose *mutual consistency* against the honest-execution model is itself the signal Stage 1 tests, catching exactly the asymmetric/structural attacks that violate that consistency), and Pauli-correction consistency, the system's one observable with no analog outside a teleportation-based distribution mechanism.

Every other structural element of v5 — the FSM, the joint Stage 2 decision, the window-limited GLR-CUSUM with unconditional ingestion, the optional forensic-only Attribution Engine — is retained unchanged, because no finding in the audit and no evidence in the competitor research demonstrates a defensible alternative to any of them.

---

## 4. Final Architecture

```
                          Session Transcript
                                  │
                ┌─────────────────┴─────────────────┐
                │                                     │
    PROTOCOL EXECUTION EVIDENCE                QUANTUM MEASUREMENT EVIDENCE
    (deterministic)                             (probabilistic — 2 independent
                │                                dimensions: refined p̂, Pauli-
    FSM: freshness, authorization-scope,        correction consistency)
    sequencing invariants                                  │
        ┌───────┴───────┐                                  ▼
        │               │                  STAGE 1 — Model-Fit / Mutual-
      FAIL            PASS                 Consistency Check
        │               │                  (profile-likelihood goodness-of-fit
        ▼               │                   testing whether m, C, H are jointly
     PROTOCOL-LEVEL      │                   consistent with a single scalar p;
     REJECT               │                   asymmetric/structural attacks break
  (authoritative,         │                   this relationship — this is where
   terminal for            │                  the triad's marginal value lives)
   protocol accept/         │                             │
   reject; logged,          │                ┌────────────┴────────────┐
   never overridden          │            fits noise family      doesn't fit / boundary
   by QSENTINEL)               │                │                        │
        │                │                       ▼                        ▼
        │                │             STAGE 2 — Joint Statistical    MODEL_INVALID
        │                │             Decision                       → RECALIBRATE
        │                │             (fast sequential statistic +   → FLAG (advisory)
        │                │              structural goodness-of-fit
        │                │              statistic, jointly calibrated
        │                │              on a Monte-Carlo sample held
        │                │              OUT of evaluation, α_system
        │                │              = 0.01, mandatory train/
        │                │              eval separation)
        │                │                        │
        │                │              ACCEPT / FLAG(REJECT) /
        │                │              FLAG(INVESTIGATE)
        │                │              — advisory only; never
        │                │              overrides protocol accept
        │                │                        │
        │                │                        ├──────────────────────────┐
        │                │                        ▼                          ▼
        │                │              TEMPORAL / CROSS-SESSION       (session summary
        │                │              EVIDENCE — every session       recorded regardless
        │                │              contributes unconditionally    of Stage 2 outcome)
        │                │              Window-limited GLR-CUSUM
        │                │              (O(w) — closed-form sup_θ
        │                │               for this exponential family)
        │                │                        │
        │                │              flags persistent drift?
        │                │                        │
        │                │                ▼ (only if EITHER Stage 2
        │                │                    OR CUSUM flagged)
        │                │              THREAT CLASSIFICATION (optional,
        │                │              forensic-only, never load-bearing)
        │                │                        │
        └────────────────┴────────────────────────▼
                 Signed, Hash-Chained Forensic Evidence Log
                                  │
                         SOC Alert Interface (advisory)
```

**Module table:**

| Module | Input | Processing | Output | Threat Coverage | PS-141 Requirement | Complexity | Independent Justification |
|---|---|---|---|---|---|---|---|
| Protocol State Integrity Engine (FSM) | Transcript metadata: timestamps, tokens, sequencing | Deterministic finite-state-machine transition/invariant checking | PASS / protocol-level REJECT, with violated invariant recorded | Replay, unauthorized verification, impersonation (missing/invalid/expired-token scope only) | Efficient verification, deterministic acceptance | O(1)/session | Sole detector for these three threat categories; 100%→1.5% replay-detection collapse when removed |
| Quantum Evidence Collector | Signed classical measurement telemetry | Compute mismatch rate `m`, correlation `C=1−2p`, entropy `H`, Pauli-correction consistency | Per-session observable vector (2 independent dimensions, as reframed) | Feeds Stage 1/2 | Pauli eigenstates, projective measurement, statistical analysis | O(n) | Sole source of all quantum-channel-manipulation evidence |
| Stage 1 — Model-Fit / Mutual-Consistency Check | Observable vector | Profile-likelihood goodness-of-fit, testing joint consistency of m/C/H against single-parameter depolarizing model | fits / MODEL_INVALID | Separates drift and model-misfit from attack; structural precondition for Stage 2 | Statistical threshold-based decision methods | O(n) | Without it, deviation collapses into unacceptable FP rate or blindness |
| Stage 2 — Joint Statistical Decision | Stage-1-routed observable stream | Fast SPRT statistic + structural goodness-of-fit statistic, jointly calibrated (train/eval-separated) rejection region, α_system=0.01 | ACCEPT / FLAG(REJECT) / FLAG(INVESTIGATE), advisory only | Quantum channel manipulation; sub-threshold/unmodeled forgery tail | Statistical thresholds, forgery-probability analysis | O(n) | Sole mechanism for channel-manipulation detection |
| Window-limited GLR-CUSUM | Per-session summary statistics, every session unconditionally | Generalized-likelihood-ratio change-point statistic, closed-form `sup_θ` for this noise family | Flag / not flagged | Persistent, low-and-slow cross-session forgery/manipulation | Statistical analysis of measurement outcomes | O(w)/session, elementary ops | Sole mechanism able to see this attack class at all |
| Attribution Engine (optional) | Observable stream of an already-flagged session | Per-hypothesis likelihood ratios | CONFIDENT / AMBIGUOUS / NO ATTRIBUTION | None required by PS-141 — forensic enrichment | — | O(n) on flagged sessions only | Never load-bearing; zero cost on the common path |
| Forensic Evidence Log | Every module's evidence and decision | Signed, hash-chained append-only write | Immutable audit record | Supports all threat categories evidentially | Security analysis | O(1)/session | Preserves evidence regardless of outcome, including protocol-level accepts that QSENTINEL flagged advisory |

---

## 5. Threat-to-Detector Matrix

| Threat | Detection Path | Decision Authority | Guarantee | Named Limitation |
|---|---|---|---|---|
| Forgery — clean, single-session | Protocol's own `s_a<s_v` threshold rule | Protocol (deterministic, authoritative) | Deterministic given the transcript | Statistically clean forgery is undetectable by any monitor in principle — information-theoretic, not an engineering gap |
| Forgery — sub-threshold / cross-session | Stage 2 (single-session tail) + GLR-CUSUM (accumulated) | QSENTINEL (advisory) | Target α_system=0.01, calibration pending | Adaptive attacker aware of rejection-region shape or CUSUM window horizon — named, untested |
| Impersonation | FSM authorization/identity-token check | Protocol/FSM (deterministic) | Deterministic for the in-scope case (missing/invalid/expired token) | Does not detect a validly-issued token in illegitimate hands — depends on classical-channel authentication integrity, explicitly out of scope |
| Replay | FSM freshness/single-use check | Protocol/FSM (deterministic) | Measured: 100%→1.5% detection collapse without this layer | Same classical-channel-authentication dependency as above |
| Unauthorized verification | FSM authorization-scope check | Protocol/FSM (deterministic) | Deterministic by design; **now backed by a specified, mandatory seventh test condition** (Section 6, F8) | Same dependency; test execution is an outstanding task, not a design gap |
| Quantum-channel manipulation | Stage 1 (mutual-consistency routing) + Stage 2 (joint decision) | QSENTINEL (advisory) | Target α_system=0.01, calibration and re-measurement pending | Reproducing the legitimate noise distribution exactly is undetectable in principle; adaptive rejection-region evasion is a named, untested gap |

---

## 6. Quantum Relevance Matrix

| Quantum Element | Classification | Role |
|---|---|---|
| Bell-state entanglement / teleportation | PROTOCOL-NECESSARY | The mandated distribution substitution; load-bearing for protocol operation |
| Pauli eigenstate key encoding | PROTOCOL-NECESSARY | Directly required by PS-141 |
| Pauli correction | PROTOCOL-NECESSARY + DETECTION-NECESSARY | Mandatory teleportation step; sole basis for Pauli-correction consistency, the system's one genuinely independent quantum-native observable |
| Projective measurement | PROTOCOL-NECESSARY | Required for verification and all downstream evidence |
| Mismatch rate `m` | DETECTION-NECESSARY | Primary estimator of channel parameter `p` |
| Correlation `C=1−2p` | DETECTION-NECESSARY, **reframed** | Not an independent feature under H0; contributes to the mutual-consistency test that flags asymmetric/structural attacks (Finding 1 resolution) |
| Entropy `H` | DETECTION-NECESSARY, **reframed** | Same reframing as `C` |
| Attribution likelihood ratios | OPTIONAL BUT JUSTIFIED | Forensic-only, non-load-bearing |

No quantum element is cosmetic. The correction made here is evidentiary framing (Finding 1), not quantum correctness — the audit found no mathematical error, only an overstated independence claim.

---

## 7. Security and Guarantee Boundary

**Provided by the underlying QDS protocol (QS-L, inherited, not re-derived):**
- Unforgeability and non-repudiation via the `s_a<s_v` asymmetric threshold rule — formally proven in the published QS-L literature.
- Deterministic accept/reject given a transcript.
- Information-theoretic security under the protocol's own stated assumptions. The teleportation-for-direct-transmission substitution is **explicitly unproven** — stated plainly, not smoothed over, and unchanged by this freeze.

**Provided by QSENTINEL:**
- Threat observability and evidence extraction beyond what the protocol itself checks.
- Deterministic detection of replay, unauthorized verification, and in-scope impersonation (FSM).
- Calibrated statistical detection of channel manipulation and sub-threshold/cross-session forgery (Stage 1/2, GLR-CUSUM) — probabilistic by nature, target α_system=0.01, **calibration pending**.
- Signed, hash-chained forensic evidence, regardless of outcome.
- **A binding non-interference guarantee (new in this freeze, closing F3):** QSENTINEL's own verdicts never override, block, or delay the protocol's deterministic acceptance of a legitimate signature. This is what makes "deterministic acceptance of legitimate signatures under explicitly stated assumptions" a claim about the *deployed system*, not only the protocol in isolation — the explicit assumption being that QSENTINEL operates in detection/annotation mode.

**Never claimed:** that QSENTINEL increases the protocol's own information-theoretic security level; that channel-manipulation detection is complete against hardware-level side channels or an adaptive attacker aware of the calibrated rejection region; that the teleportation/QS-L composite construction's security is proven.

---

## 8. Statistical Decision Framework

**Stage 1 (model-fit / mutual consistency):** `H0`: session statistics are consistent with *some* legitimate operating point `p` in the declared depolarizing-noise family, tested jointly across `m`, `C`, `H` via profile-likelihood goodness-of-fit (nuisance parameter `p` profiled out, not plugged in as a point estimate). `H1`: statistics are inconsistent with any such `p` (drift or model misspecification). Assumption: the declared noise family contains the true legitimate distribution; small-sample validity of the asymptotic critical value at n≈200 is an **outstanding validated task (F5)**, not yet confirmed.

**Stage 2 (joint decision):** `H0`: honest execution under the model Stage 1 validated. `H1`: attack (channel manipulation or sub-threshold forgery). Observed: `(S_SPRT, S_gate)`, evaluated jointly against a rejection region `R` calibrated once, offline, by Monte Carlo simulation of the joint null distribution, **now bound by a mandatory train/evaluate separation (F2)** to `α_system=0.01`. Composition is statistically valid because calibration is performed directly against the joint distribution rather than assuming independence and combining marginal thresholds — at least as tight as a Bonferroni bound, without requiring independence.

**GLR-CUSUM:** `H0`: parameter stable at `θ0`. `H1`: an unknown post-change parameter `θ`, estimated online via `sup_θ`, closed-form for this exponential-family model (F6 resolution). Runs on every session unconditionally, independent of Stage 2's own per-session verdict — required, since low-and-slow drift is defined by being sub-threshold in any single session.

**System-level composition:** Protocol-level acceptance (deterministic) is authoritative and final. QSENTINEL's Stage 1→2→CUSUM chain produces an independent, advisory annotation stream with its own α_system target; the two are not composed into a single joint guarantee, and this freeze does not claim they are — the deterministic and probabilistic layers remain categorically separate outputs, one gating (FSM only), one advisory (statistical layer only), by explicit design.

---

## 9. Competitive Position

**What is genuinely better:** No reviewed teleportation-QDS protocol paper attempts a separate runtime statistical monitoring layer at all (competitor landscape, Sections 3B/6) — every reviewed construction proves security at the protocol-design level and stops there. QSENTINEL's Pauli-correction-consistency observable has no analog in a directly-transmitted-qubit scheme. Its FSM/statistical separation, applied specifically to a teleportation-QDS substrate, occupies white space the competitor research confirms is genuinely unfilled.

**What is merely different:** Compared with QKD channel-monitoring literature (QBER thresholds, entanglement-witness diagnostics), QSENTINEL solves a different problem (signature-verification integrity, not key secrecy) using structurally similar statistical tools; neither is "better" in the abstract.

**What is not yet proven superior:** Source-stage (pre-teleportation) entanglement-integrity monitoring — mature measurement-device-independent witness techniques in the literature currently exceed anything QSENTINEL specifies; this is explicitly deferred, not shipped weaker. Stealthy-attack recall against an adaptive adversary — ML-based detectors have a measured advantage here that QSENTINEL, constrained by PS-141's no-AI/ML requirement, does not attempt to match. Multi-statistic robustness against the documented QKD failure pattern (single-statistic detection is known-evadable) is architecturally addressed by the joint Stage 1/Stage 2 design but **not yet empirically demonstrated** under the corrected, calibrated architecture.

**Scoped claim:** *Compared with existing teleportation-QDS protocols, QSENTINEL provides continuous runtime statistical monitoring because none of the reviewed protocol-design papers attempt this at all; compared with QKD channel-monitoring and classical FSM/IDS literature, QSENTINEL provides a teleportation-specific quantum observable (Pauli-correction consistency) and protocol-session-lifecycle awareness that neither line of prior work combines.* No broader superiority is claimed.

---

## 10. Final Delivery Table (Expected Deliverables)

| Expected Deliverable | Final Architecture Component | Demonstration Method | Validation Method |
|---|---|---|---|
| Teleportation-based QDS simulation | Protocol Simulator | Deterministic acceptance on noiseless runs | Cross-checked against statevector ground truth |
| Bell-state entanglement | Bell-pair distribution module | Simulation | Cross-checked against ground truth |
| Quantum teleportation | Teleportation execution module | Simulation | Cross-checked against ground truth |
| Pauli corrections | Correction module | Simulation | Cross-checked against ground truth; sole basis for Pauli-correction consistency |
| Pauli eigenstate analysis | Quantum Evidence Collector | Closed-form statistics | Cross-checked against simulator |
| Projective measurements | Recipient measurement stage | BB84-style sifting | Cross-checked against simulator |
| Forgery detection | Protocol threshold rule + Stage 2 | Protocol proof (inherited) + Monte Carlo | Held-out calibration (F2) |
| Impersonation detection | FSM | Deterministic check | Measured, scope explicitly qualified (F9) |
| Replay detection | FSM | Deterministic check | Measured: 100%→1.5% collapse ablation |
| Unauthorized verification detection | FSM | Deterministic check | **New, specified, mandatory 7th Monte Carlo condition (F8)** |
| Quantum-channel manipulation detection | Stage 1 + Stage 2 | Joint calibrated decision | Held-out Monte Carlo (F2), full re-run (Section 12) |
| Statistical threshold decisions | Stage 1, Stage 2, GLR-CUSUM | Profile-likelihood, joint rejection region, GLR | Small-sample validation (F5), closed-form complexity note (F6) |
| Forgery probability | Detection-rate tables | Monte Carlo harness | Re-run required (F7) |
| Verification accuracy | **New distinct deliverable (F10)** | Legitimate-session acceptance sweep across noise levels | Monte Carlo, existing simulator |
| Mathematical modelling | Section 8 of this document | Closed-form statistics | Reframed evidence-dimensionality claim (F1) |
| Attack simulation | Attack Simulator, 7 conditions | Monte Carlo | Full re-run required |
| Security analysis | Sections 7, 5 | Threat model, boundary statement | Non-interference guarantee added (F3) |
| Performance evaluation | Section 12 (below) | Detection rate, FP/FN, latency, complexity | Full re-run required |
| Deterministic legitimate acceptance under stated assumptions | Protocol rule + non-interference guarantee | Explicit policy statement | **Now FULL — closed by F3** |
| Low computational complexity | All modules O(1)–O(w) | Big-O with corrected constant-factor note | Wall-clock benchmark optional, not required |
| Information-theoretic security compatibility | Strictly additive overlay | No modification to protocol accept/reject logic | Re-confirmed |

---

## 11. Final Complexity Analysis

Every retained cost is `O(1)` to `O(w)` per session, all justified by necessity, not convenience: the FSM is `O(1)` because it checks a bounded set of invariants; the Quantum Evidence Collector and Stage 1/2 are `O(n)` because they must touch every sifted measurement outcome once; GLR-CUSUM is `O(w)` — and, per the F6 resolution, `w` cheap closed-form MLE evaluations, not `w` nontrivial optimizations, because the noise family here is exponential-family (Bernoulli/binomial-type), for which `sup_θ` is the sample proportion. The Attribution Engine adds zero cost on the common path because it runs only on already-flagged sessions. No component was retained on the grounds of sophistication; each survives the minimum-necessary-change test in Section 2's decision table.

---

## 12. Final Evaluation Plan

In priority order, matching the audit's own severity ranking:

1. **Stage 2 joint Monte Carlo calibration**, executed with a mandatory train/evaluate split (closes F2) — the single blocking prerequisite for every other numeric claim.
2. **Full harness re-run**, seven conditions (the six historical plus the new, specified unauthorized-verification condition closing F8), under the corrected joint-decision rule and GLR-CUSUM formulation.
3. **Profile-likelihood critical-value validation** at the actual operating sample size (n≈200), by simulation, not asymptotics alone (closes F5).
4. **Verification-accuracy sweep**: legitimate-session acceptance rate across a range of honest noise levels, reported as its own metric (closes F10).
5. **Naive multi-detector-integration baseline**, re-implemented and run head-to-head, so the joint-calibration claim has an actual measured comparator.
6. **Alpha-spending benchmark** against the joint-calibration approach, as a secondary, non-blocking comparison.
7. Every ablation continues to include full-architecture-minus-one-component tests, with unfavorable results reported without exception, and every resulting figure is reported with a confidence interval at the stated trial count.

---

## 13. Explicit Limitations

- A statistically clean, single-session forgery that reproduces the legitimate noise distribution exactly is undetectable by any component of this system, in principle — an information-theoretic limit, not an engineering gap.
- An adaptive attacker aware of the calibrated Stage 2 rejection region, or of the GLR-CUSUM window size, has a named, untested evasion path.
- Impersonation and unauthorized-verification coverage both depend on the integrity of the classical-channel authentication layer issuing tokens and freshness state; a compromise there is out of scope for this monitoring layer by design.
- Source-stage (pre-teleportation) entanglement-integrity monitoring is not covered; mature measurement-device-independent witness techniques in the literature currently exceed anything specified here, and this capability is deferred rather than shipped underspecified.
- The teleportation-for-direct-transmission substitution to the QS-L protocol is explicitly unproven; QSENTINEL's guarantees are conditioned on that substitution's soundness, not a proof of it.
- The staged-pipeline architecture itself has not been benchmarked against a unified probabilistic alternative (F4); no evidence currently exists in either direction, and none is assumed.
- Every quantitative figure currently in the historical record was measured under a superseded architecture and requires re-confirmation (F7) before being quoted as a current result.
- Full deployment isolation (collector agents at reduced privilege, on an independently authenticated telemetry channel) is out of scope for this software deliverable and is named, not silently assumed.

---

## 14. Architecture Freeze Statement

**What is frozen:** the two-evidence-channel separation (deterministic FSM / probabilistic quantum-statistical); the FSM's role and scope; the two-independent-dimension reframing of quantum evidence (refined `p̂` via mutual-consistency testing across m/C/H, plus Pauli-correction consistency); the joint-calibration philosophy for Stage 2, with mandatory train/evaluate separation; the unconditional-ingestion, closed-form window-limited GLR-CUSUM; the optional, non-load-bearing Attribution Engine; and, as the binding addition made by this freeze, QSENTINEL's strict non-interference with the protocol's own deterministic acceptance of legitimate signatures.

**What assumptions are frozen:** the declared depolarizing noise family contains the true legitimate-operation distribution; the classical-channel authentication layer is uncompromised; the attacker is static and non-adaptive in the primary evaluated threat model; QSENTINEL is deployed in detection/annotation mode, never blocking mode.

**What remains to be validated experimentally:** the Stage 2 joint calibration under a held-out split; the full seven-condition harness re-run; the profile-likelihood critical value at n≈200; the verification-accuracy sweep; the naive-integration baseline comparison; the alpha-spending benchmark.

**What would require new evidence before being allowed:** any change to the staged-pipeline shape itself; any expansion of the observable set beyond the two independent dimensions established here; any new detection component; any claim of superiority beyond the specific, scoped comparisons in Section 9. Per the governing synthesis framework, plausibility, novelty, or sophistication are not sufficient grounds for any of these — only demonstrated evidence is.
