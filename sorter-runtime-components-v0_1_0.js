// ══════════════════════════════════════════════════════════
// SORTER RUNTIME COMPONENTS  v0.1.0
//
// Component runtime adapter for SorterSpine v0.5.0.
// Provides respond() implementations for each adaptive
// component, keyed by component id.
//
// Usage:
//   SorterSpine.setComponentRuntime(SorterRuntimeComponents);
//
// Contract:
//   SorterRuntimeComponents.respond(finalMap, componentConfig)
//   → { action, payload, warnings, mapUpdate? }
//
// action:    what the system should do next
// payload:   data the system needs to act
// warnings:  any reliability notes
// mapUpdate: optional — if the component updates map state
//            (e.g. trust drift changes a running score),
//            return the update here and the spine will merge it.
//
// Components act on the mapped state.
// They do not read input material directly.
// ══════════════════════════════════════════════════════════

const SorterRuntimeComponents = (() => {


  // ── Helpers ───────────────────────────────────────────────

  function _clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function _confidenceRank(level) {
    const ranks = {
      'not_readable': 0, 'inferred': 1, 'thin': 2,
      'partial': 3, 'supported': 4, 'strong': 5,
    };
    return ranks[level] ?? 0;
  }


  // ── Component implementations ─────────────────────────────


  // 01 — Hidden Agenda
  function _hiddenAgenda(map, config) {
    const contradictions = map.contradictions?.detected || [];
    const avoidance      = map.avoidance?.count || 0;
    const connections    = map.connections?.count || 0;

    // Accumulate drift from map signals
    let driftDelta = 0;
    if (contradictions.length > 0) driftDelta += 15 * contradictions.length;
    if (avoidance > 0)             driftDelta += 10 * avoidance;
    if (connections > 1)           driftDelta += 5  * connections;

    const currentDrift = _clamp((config.agendaState?.drift || 0) + driftDelta, 0, 100);

    const modes = config.responseModes || [];
    const mode  = modes.find(m => currentDrift >= m.range[0] && currentDrift <= m.range[1]);

    return {
      action:  'hidden-agenda-update',
      payload: {
        drift:    currentDrift,
        mode:     mode?.key    || 'concealed',
        modeDesc: mode?.desc   || 'Not perceptible.',
        revealed: currentDrift >= 90,
      },
      warnings: currentDrift >= 70
        ? ['Hidden agenda surfacing — tension visible in mapped pattern.']
        : [],
      mapUpdate: { hiddenAgendaDrift: currentDrift },
    };
  }


  // 02 — Trust Drift
  function _trustDrift(map, config) {
    const movement       = map.movement      || {};
    const contradictions = map.contradictions || {};
    const avoidance      = map.avoidance     || {};

    let current = config.trustState?.level ?? 50;

    // Movement builds trust
    if (movement.isMoving) current += 5;
    // Contradictions erode trust
    if (contradictions.hasContradiction) current -= 8;
    // Avoidance erodes trust
    if (avoidance.hasAvoidance) current -= 5;

    current = _clamp(current, 0, 100);

    const broken    = current <= 15;
    const direction = current > (config.trustState?.level ?? 50) ? 'building'
      : current < (config.trustState?.level ?? 50)               ? 'eroding'
      : 'stable';

    const modes     = config.responseModes || [];
    const mode      = modes.find(m => current >= m.range[0] && current <= m.range[1]);

    return {
      action:  'trust-drift-update',
      payload: {
        level:     current,
        direction,
        broken,
        standing:  mode?.key || 'moderate',
        modeDesc:  mode?.desc || '',
      },
      warnings: broken ? ['Trust broken. Active repair required before further engagement.'] : [],
      mapUpdate: { trustLevel: current, trustDirection: direction, trustBroken: broken },
    };
  }


  // 03 — Sly Planning
  function _slyPlanning(map, config) {
    const hiddenDrift   = map.hiddenAgendaDrift || 0;
    const contradiction = map.contradictions?.hasContradiction || false;
    const state         = config.planningState || {};
    const patience      = state.patience ?? 80;

    let progress        = state.progress || 0;
    let exposureRisk    = hiddenDrift * 0.8;

    // If contradiction detected, exposure risk increases
    if (contradiction) exposureRisk = _clamp(exposureRisk + 15, 0, 100);

    // Determine action
    let action = 'hold';
    if (exposureRisk < 50 && progress < 90) {
      action   = 'advance';
      progress = _clamp(progress + 10, 0, 100);
    } else if (exposureRisk >= 80 && patience < 30) {
      action = 'accelerate';
    } else if (exposureRisk >= 80) {
      action = 'cover';
    }

    return {
      action:  'sly-planning-update',
      payload: { progress, exposureRisk, planningAction: action },
      warnings: exposureRisk >= 70 ? ['Planning exposure risk high.'] : [],
      mapUpdate: { slyPlanningProgress: progress, slyExposureRisk: exposureRisk },
    };
  }


  // 04 — Faction Memory
  function _factionMemory(map, config) {
    const movement    = map.movement   || {};
    const stateChange = map.stateChanges?.detected || [];
    const state       = config.factionMemoryState || {};
    let reputation    = state.reputation ?? 50;

    // Actions that build or erode reputation
    if (movement.isMoving)        reputation += 3;
    if (!movement.isMoving)       reputation -= 2;
    if (stateChange.length > 0)   reputation += 5;

    reputation = _clamp(reputation, 0, 100);

    const thresholds = config.standingThresholds || [];
    const standing   = thresholds.find(t => reputation >= t.range[0] && reputation <= t.range[1]);

    return {
      action:  'faction-memory-update',
      payload: {
        reputation,
        standing:     standing?.key  || 'neutral',
        standingDesc: standing?.desc || '',
      },
      warnings: reputation <= 15 ? ['Faction standing: enemy. Active opposition possible.'] : [],
      mapUpdate: { factionReputation: reputation },
    };
  }


  // 05 — Dramatic Timing
  function _dramaticTiming(map, config) {
    const hiddenDrift = map.hiddenAgendaDrift || 0;
    const trustBroken = map.trustBroken       || false;
    const load        = map.load?.level       || 'low';
    const state       = config.heldState      || {};

    let weight    = state.weight   || hiddenDrift;
    let readiness = 0;

    // Readiness signals
    const signals = config.readinessSignals || [];
    if (load === 'high' || load === 'critical') readiness += 20;
    if (trustBroken)                            readiness += 25;
    if (hiddenDrift >= 70)                      readiness += 30;
    readiness = _clamp(readiness, 0, 100);

    const shouldTrigger = weight >= 70 && readiness >= 60;
    const decayRules    = config.decayRules || {};
    const forceRelease  = weight <= (decayRules.forceReleaseAt || 20);

    return {
      action: shouldTrigger || forceRelease ? 'dramatic-trigger' : 'dramatic-hold',
      payload: {
        weight,
        readiness,
        shouldTrigger,
        forceRelease,
        reason: shouldTrigger
          ? 'Weight and readiness aligned — trigger the reveal.'
          : forceRelease
            ? 'Weight decayed to force-release threshold.'
            : 'Conditions not yet aligned — hold.',
      },
      warnings: forceRelease ? ['Tension weight decaying — surface or drop before it becomes noise.'] : [],
    };
  }


  // 06 — Consequence Propagation
  function _consequencePropagation(map, config) {
    const stateChanges  = map.stateChanges?.detected || [];
    const trustBroken   = map.trustBroken            || false;
    const load          = map.load?.level            || 'low';
    const effects       = [];

    if (trustBroken) {
      effects.push({ type: 'trust_impact', strength: 'strong', desc: 'Trust broken — propagates to connected relationships.' });
    }
    if (load === 'high' || load === 'critical') {
      effects.push({ type: 'load_impact', strength: 'moderate', desc: 'High load propagating to dependent threads.' });
    }
    if (stateChanges.length > 0) {
      effects.push({ type: 'state_change', strength: 'moderate', desc: 'State change detected — consequences propagating.' });
    }

    const cascadeRisk = effects.length >= 2;

    return {
      action:  effects.length > 0 ? 'propagate-consequences' : 'no-propagation',
      payload: { effects, cascadeRisk },
      warnings: cascadeRisk ? ['Multiple consequences propagating simultaneously — cascade risk.'] : [],
    };
  }


  // 07 — Escalation Timing
  function _escalationTiming(map, config) {
    const constraints = map.constraints || {};
    const load        = map.load        || {};
    const gaps        = map.gaps        || {};
    const avoidance   = map.avoidance   || {};

    let level = 0;
    const reasons = [];

    if (constraints.hasConstraints && constraints.count >= 2) {
      level = Math.max(level, 3);
      reasons.push('Persistent external block.');
    } else if (constraints.hasConstraints && avoidance.hasAvoidance) {
      level = Math.max(level, 2);
      reasons.push('Constraint present — check whether engagement with available channels is happening.');
    } else if (gaps.count >= 3) {
      level = Math.max(level, 2);
      reasons.push('Multiple priority gaps open.');
    } else if (load.level === 'critical') {
      level = Math.max(level, 2);
      reasons.push('Critical load level.');
    } else if (gaps.count >= 1) {
      level = Math.max(level, 1);
      reasons.push('Priority gap open.');
    }

    const levels = config.escalationLevels || [];
    const escalationLevel = levels.find(l => l.level === level);

    return {
      action:  level >= 3 ? 'escalate' : level >= 2 ? 'prompt' : level >= 1 ? 'flag' : 'monitor',
      payload: {
        level,
        key:     escalationLevel?.key  || 'none',
        desc:    escalationLevel?.desc || 'Monitor.',
        reasons,
      },
      warnings: level >= 3 ? ['Escalation level 3 — route to human review.'] : [],
    };
  }


  // 08 — Constraint-Aware Hinting
  function _constraintAwareHinting(map, config) {
    const constraints   = map.constraints   || {};
    const load          = map.load          || {};
    const gaps          = map.gaps          || {};
    const metaReading   = map.metaReading   || {};
    const trustBroken   = map.trustBroken   || false;
    const hintTypes     = config.hintTypes  || [];
    const suppression   = config.suppressionRules || {};

    let hintType = 'next_action';
    let hintText = null;

    // Suppression checks
    if (load.level === 'high' || load.level === 'critical') {
      hintType = 'load_acknowledgement';
      hintText = 'High load is present. One small step at a time.';
    } else if (constraints.hasConstraints) {
      hintType = 'constraint_note';
      hintText = 'The block is real and external — not a personal failure. Focus on what is accessible now.';
    } else if (metaReading.engagementType === 'performed') {
      hintType = 'pattern_nudge';
      hintText = 'The map works better with honest material than with performed material.';
    } else if (gaps.highestPriority) {
      hintType = 'gap_prompt';
      hintText = `The most useful next step is toward the open gap: ${gaps.highestPriority.name || gaps.highestPriority.key}.`;
    } else {
      hintText = 'Continue the current movement — evidence of progress is present.';
    }

    return {
      action:  'hint',
      payload: { hintType, hintText },
      warnings: [],
    };
  }


  // 09 — Tool Routing
  function _toolRouting(map, config) {
    const confidence  = map.confidence  || {};
    const gaps        = map.gaps        || {};
    const constraints = map.constraints || {};
    const routes      = config.routes   || [];

    let route   = 'output';
    let reason  = 'Confidence sufficient. No blocking gaps or constraints.';

    if (_confidenceRank(confidence.overall) === 0) {
      route  = 'human_escalation';
      reason = 'Confidence not readable.';
    } else if (_confidenceRank(confidence.overall) <= 1) {
      route  = 'clarify';
      reason = `Confidence: ${confidence.overall}. Clarification needed.`;
    } else if (constraints.hasConstraints) {
      route  = 'acknowledge_constraint';
      reason = 'External constraint active.';
    } else if (gaps.count > 0 && _confidenceRank(confidence.overall) <= 2) {
      route  = 'search';
      reason = 'Gaps present and confidence thin. Search may help.';
    } else if (_confidenceRank(confidence.overall) <= 2) {
      route  = 'confidence_gated_output';
      reason = `Confidence: ${confidence.overall}. Output with label.`;
    }

    return {
      action:  route,
      payload: { route, reason },
      warnings: route === 'human_escalation' ? ['Routing to human — beyond safe autonomous scope.'] : [],
    };
  }


  // 10 — Confidence-Gated Output
  function _confidenceGatedOutput(map, config) {
    const confidence   = map.confidence || {};
    const gateConfig   = config.gateConfig || {};
    const stakes       = config.deploymentStakes || 'mediumStakes';
    const gate         = gateConfig[stakes] || gateConfig.mediumStakes || {};
    const minLevel     = gate.minimumConfidence || 'partial';
    const minRank      = _confidenceRank(minLevel);
    const currentRank  = _confidenceRank(confidence.overall);

    let outcome   = 'pass';
    let label     = null;

    if (currentRank < minRank) {
      outcome = gate.hold ? 'hold' : 'pass_labelled';
      label   = confidence.label || `(${confidence.overall})`;
    }

    if (_confidenceRank(confidence.overall) <= 1) {
      label = config.outputLabels?.inferred || '(inferred — not directly stated)';
    }

    return {
      action:  outcome === 'hold' ? 'hold' : 'output',
      payload: { outcome, label, confidence: confidence.overall, stakes },
      warnings: outcome === 'hold'
        ? [`Output held — confidence "${confidence.overall}" below minimum "${minLevel}" for ${stakes}.`]
        : [],
    };
  }


  // 11 — Handover Trigger
  function _handoverTrigger(map, config) {
    const confidence  = map.confidence || {};
    const gaps        = map.gaps       || {};
    const entries     = map.baseline?.entryCount || 0;
    const readiness   = config.handoverReadiness || {};

    const minQuality  = readiness.mapQualityMinimum || 'partial';
    const minPeriods  = readiness.periodMinimum     || 3;
    const maxGaps     = readiness.openGapThreshold  || 2;

    const qualityMet  = _confidenceRank(confidence.overall) >= _confidenceRank(minQuality);
    const periodsMet  = entries >= minPeriods;
    const gapsMet     = (gaps.count || 0) <= maxGaps;
    const ready       = qualityMet && periodsMet && gapsMet;

    const warnings = [];
    if (!qualityMet)  warnings.push(`Map quality below minimum "${minQuality}".`);
    if (!periodsMet)  warnings.push(`Fewer than ${minPeriods} independent periods.`);
    if (!gapsMet)     warnings.push(`${gaps.count} open gaps — above threshold of ${maxGaps}.`);

    return {
      action:  ready ? 'handover-ready' : 'handover-not-ready',
      payload: {
        ready,
        qualityMet,
        periodsMet,
        gapsMet,
        openGaps:     gaps.count || 0,
        confidence:   confidence.overall,
      },
      warnings,
      mapUpdate: { 'handover.readyForHandover': ready },
    };
  }


  // 12 — Gap-Closure Prompt
  function _gapClosurePrompt(map, config) {
    const gaps        = map.gaps        || {};
    const constraints = map.constraints || {};
    const avoidance   = map.avoidance   || {};
    const load        = map.load        || {};
    const metaReading = map.metaReading || {};

    if (!gaps.highestPriority) {
      return {
        action:  'no-gap-prompt',
        payload: { prompt: null, reason: 'No open priority gaps.' },
        warnings: [],
      };
    }

    const gap = gaps.highestPriority;
    let promptType = 'direct_action';
    let promptText = null;

    // Suppression and shaping logic
    if (load.level === 'high' || load.level === 'critical') {
      promptText = `One small step: what is the single smallest thing that moves toward "${gap.name || gap.key}"?`;
      promptType = 'direct_action';
    } else if (constraints.hasConstraints) {
      promptText = `The gap "${gap.name || gap.key}" may be blocked externally. What is the constraint, and is it changeable?`;
      promptType = 'constraint_surface';
    } else if (avoidance.hasAvoidance) {
      promptText = `The map shows avoidance around "${gap.name || gap.key}". What would it take to name what is being avoided?`;
      promptType = 'avoidance_name';
    } else if (metaReading.engagementType === 'performed') {
      promptText = `The gap "${gap.name || gap.key}" remains open. Honest material here would improve the map.`;
      promptType = 'direct_action';
    } else {
      promptText = gap.reason
        ? `To close the gap: ${gap.reason}`
        : `Address the open gap: "${gap.name || gap.key}".`;
    }

    return {
      action:  'gap-closure-prompt',
      payload: { promptType, promptText, gap },
      warnings: [],
    };
  }


  // ── Dispatch table ────────────────────────────────────────

  const _componentMap = {
    'hidden-agenda':              _hiddenAgenda,
    'trust-drift':                _trustDrift,
    'sly-planning':               _slyPlanning,
    'faction-memory':             _factionMemory,
    'dramatic-timing':            _dramaticTiming,
    'consequence-propagation':    _consequencePropagation,
    'escalation-timing':          _escalationTiming,
    'constraint-aware-hinting':   _constraintAwareHinting,
    'tool-routing':               _toolRouting,
    'confidence-gated-output':    _confidenceGatedOutput,
    'handover-trigger':           _handoverTrigger,
    'gap-closure-prompt':         _gapClosurePrompt,
  };


  // ── Public respond() ──────────────────────────────────────

  function respond(finalMap, componentConfig) {
    const componentId = componentConfig.id;
    const impl = _componentMap[componentId];

    if (!impl) {
      console.warn(`SorterRuntimeComponents: no respond() implementation for "${componentId}". Skipping.`);
      return { action: 'no-op', payload: null, warnings: [`No implementation for component "${componentId}".`] };
    }

    return impl(finalMap, componentConfig);
  }


  // ── Public API ────────────────────────────────────────────

  return {
    respond,
    _componentMap,
  };

})();
