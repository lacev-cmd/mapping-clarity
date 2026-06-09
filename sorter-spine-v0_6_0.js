// ══════════════════════════════════════════════════════════
// SORTER SPINE  v0.6.0
//
// Patch over v0.5.1.
//
// v0.6.0 additions:
//
//   — 'horizon-reading' added to PROCESSING_ORDER at
//     position 17, after 'meta-reading'. Runs last —
//     reads the completed map from all prior behaviours.
//
//   — horizonEnabled: false added to deployment config.
//     Opt-in per deployment. Skipped silently when false.
//
//   — Spine header reference updated to
//     sorter-runtime-v0_4_0.
//
// All v0.5.1 functionality preserved. Backwards compatible.
// ══════════════════════════════════════════════════════════

const SorterSpine = (() => {

  // ── Internal registry ─────────────────────────────────────

  let _behaviours       = {};
  let _guides           = {};
  let _components       = {};
  let _input            = null;
  let _state            = {};
  let _runtime          = null;
  let _componentRuntime = null;

  // ── Deployment config ─────────────────────────────────────

  let _config = {
    allowSimulationComponents: false,
    deploymentId:              null,
    highStakes:                false,
    horizonEnabled:            false,   // Opt-in. Set true to run horizon-reading.
  };

  function configure(options = {}) {
    _config = { ..._config, ...options };
    return SorterSpine;
  }


  // ── Simulation component tags ─────────────────────────────
  // Components carrying these tags are blocked in real-world
  // deployments unless allowSimulationComponents is true.

  const SIMULATION_TAGS = ['gaming', 'simulation', 'narrative'];


  // ── Attachment contracts ──────────────────────────────────

  const BEHAVIOUR_REQUIRED   = ['id', 'version', 'purpose', 'coreRule', 'boundary'];
  const GUIDE_REQUIRED       = ['id', 'version', 'type', 'purpose', 'sector', 'steer'];
  const COMPONENT_REQUIRED   = ['id', 'version', 'tags', 'purpose', 'coreRule', 'boundary'];
  const INPUT_REQUIRED       = ['baseline', 'entries'];
  const BEHAVIOUR_INTERFACE  = ['read'];
  const COMPONENT_INTERFACE  = ['respond'];


  // ── Validation ────────────────────────────────────────────

  function _validateBehaviour(b) {
    const missing = BEHAVIOUR_REQUIRED.filter(k => !b[k]);
    if (missing.length) throw new Error(`Behaviour "${b.id || '?'}" missing required fields: ${missing.join(', ')}`);
    return true;
  }

  function _validateGuide(g) {
    const missing = GUIDE_REQUIRED.filter(k => !(k in g));
    if (missing.length) throw new Error(`Guide "${g.id || '?'}" missing required fields: ${missing.join(', ')}`);
    if (!['sector', 'subsector', 'output'].includes(g.type)) throw new Error(`Guide "${g.id}" type must be 'sector', 'subsector', or 'output'.`);
    if (g.type === 'subsector' && !g.parent) throw new Error(`Guide "${g.id}" is type 'subsector' but has no parent id.`);
    if (g.type === 'subsector' && !_guides[g.parent]) throw new Error(`Guide "${g.id}" parent "${g.parent}" must be attached before the sub-guide.`);
    return true;
  }

  function _validateComponent(c) {
    const missing = COMPONENT_REQUIRED.filter(k => !(k in c));
    if (missing.length) throw new Error(`Adaptive Component "${c.id || '?'}" missing required fields: ${missing.join(', ')}`);
    if (!Array.isArray(c.tags) || c.tags.length === 0) throw new Error(`Adaptive Component "${c.id}" must have at least one tag.`);

    // ── Simulation isolation check ──────────────────────────
    if (!_config.allowSimulationComponents) {
      const simTags = c.tags.filter(t => SIMULATION_TAGS.includes(t));
      if (simTags.length > 0) {
        throw new Error(
          `Adaptive Component "${c.id}" carries simulation tags [${simTags.join(', ')}] ` +
          `and cannot be attached to a real-world deployment. ` +
          `To allow simulation components, call SorterSpine.configure({ allowSimulationComponents: true }) first. ` +
          `WARNING: simulation components must never be used in clinical, legal, or criminal justice contexts.`
        );
      }
    }

    return true;
  }

  function _validateInput(input) {
    const missing = INPUT_REQUIRED.filter(k => !(k in input));
    if (missing.length) throw new Error(`Input missing required fields: ${missing.join(', ')}`);
    if (!Array.isArray(input.entries)) throw new Error('Input entries must be an array.');
    return true;
  }

  function _validateRuntime(adapter) {
    const missing = BEHAVIOUR_INTERFACE.filter(k => typeof adapter[k] !== 'function');
    if (missing.length) throw new Error(`Behaviour runtime adapter missing required methods: ${missing.join(', ')}`);
    return true;
  }

  function _validateComponentRuntime(adapter) {
    const missing = COMPONENT_INTERFACE.filter(k => typeof adapter[k] !== 'function');
    if (missing.length) throw new Error(`Component runtime adapter missing required methods: ${missing.join(', ')}`);
    return true;
  }


  // ── Registration — Behaviours ─────────────────────────────

  function attachBehaviour(behaviour) {
    _validateBehaviour(behaviour);
    _behaviours[behaviour.id] = behaviour;
    return SorterSpine;
  }

  function detachBehaviour(id) { delete _behaviours[id]; return SorterSpine; }


  // ── Registration — Guides ─────────────────────────────────

  function attachGuide(guide) {
    _validateGuide(guide);
    if (guide.type === 'subsector') {
      const parent = _guides[guide.parent];
      _guides[guide.id] = guide.composeFrom ? guide.composeFrom(parent) : _mergeGuide(parent, guide);
    } else {
      _guides[guide.id] = guide;
    }
    return SorterSpine;
  }

  function detachGuide(id) { delete _guides[id]; return SorterSpine; }


  // ── Registration — Adaptive Components ───────────────────

  function attachComponent(component) {
    _validateComponent(component);
    _components[component.id] = component;
    return SorterSpine;
  }

  function detachComponent(id) { delete _components[id]; return SorterSpine; }


  // ── Runtime Adapters ──────────────────────────────────────

  function setRuntime(adapter)          { _validateRuntime(adapter);          _runtime = adapter;          return SorterSpine; }
  function setComponentRuntime(adapter) { _validateComponentRuntime(adapter); _componentRuntime = adapter; return SorterSpine; }


  // ── Guide merge ───────────────────────────────────────────

  const ARRAY_EXTEND_FIELDS = [
    'movementEvidence', 'notMovement', 'defaultLoadSignals', 'notAvoidance', 'priorityGaps',
    'requiredCaveats', 'prevents', 'failureModes', 'watchPatterns', 'keyEventTypes', 'hintTypes',
    'costSignals', 'readinessSignals', 'thinningIndicators', 'deepeningIndicators', 'honestySignals',
    'performanceSignals', 'constraintTypes', 'competitionTypes', 'changeTypes', 'confidenceTiers', 'enables',
  ];

  function _mergeSteer(parent, child) {
    const merged = Object.assign({}, parent, child);
    ARRAY_EXTEND_FIELDS.forEach(field => {
      if (Array.isArray(parent[field]) && Array.isArray(child[field])) merged[field] = [...parent[field], ...child[field]];
    });
    return merged;
  }

  function _mergeGuide(parent, child) {
    const merged = Object.assign({}, child);
    merged.steer = {};
    const allKeys = new Set([...Object.keys(parent.steer || {}), ...Object.keys(child.steer || {})]);
    allKeys.forEach(behaviourId => {
      const p = parent.steer[behaviourId] || {};
      const c = child.steer[behaviourId]  || {};
      merged.steer[behaviourId] = _mergeSteer(p, c);
    });
    return merged;
  }


  // ── Input ─────────────────────────────────────────────────

  function setInput(input) {
    _validateInput(input);
    _input = { baseline: input.baseline || '', entries: input.entries || [], corrections: input.corrections || [], connections: input.connections || [], meta: input.meta || {} };
    return SorterSpine;
  }


  // ── Composition ───────────────────────────────────────────

  function _compose() {
    const composed = {};
    const sectorGuides    = Object.values(_guides).filter(g => g.type === 'sector');
    const subsectorGuides = Object.values(_guides).filter(g => g.type === 'subsector');
    const outputGuides    = Object.values(_guides).filter(g => g.type === 'output');

    Object.values(_behaviours).forEach(behaviour => {
      const effective = Object.assign({}, behaviour);
      [sectorGuides, subsectorGuides, outputGuides].forEach(layer => {
        layer.forEach(guide => {
          const steer = guide.steer[behaviour.id];
          if (steer) {
            Object.keys(steer).forEach(field => {
              if (ARRAY_EXTEND_FIELDS.includes(field) && Array.isArray(effective[field]) && Array.isArray(steer[field])) {
                effective[field] = [...effective[field], ...steer[field]];
              } else {
                effective[field] = steer[field];
              }
            });
          }
        });
      });
      composed[behaviour.id] = effective;
    });
    return composed;
  }


  // ── Component order resolution ────────────────────────────

  function _resolveComponentOrder() {
    const components = Object.values(_components);
    const resolved = [], visited = new Set();
    function visit(component) {
      if (visited.has(component.id)) return;
      visited.add(component.id);
      if (Array.isArray(component.runAfter)) {
        component.runAfter.forEach(depId => { if (_components[depId]) visit(_components[depId]); });
      }
      resolved.push(component);
    }
    [...components].sort((a, b) => (a.priority || 50) - (b.priority || 50)).forEach(visit);
    return resolved;
  }


  // ── Component dependency check ────────────────────────────

  function _checkComponentDependencies() {
    const warnings = [];
    Object.values(_components).forEach(component => {
      if (Array.isArray(component.behaviourInputs)) {
        component.behaviourInputs.forEach(depId => {
          if (!_behaviours[depId]) warnings.push(`Component "${component.id}" declares behaviour dependency "${depId}" — not attached.`);
        });
      }
      if (Array.isArray(component.componentInputs)) {
        component.componentInputs.forEach(depId => {
          if (!_components[depId]) warnings.push(`Component "${component.id}" declares component dependency "${depId}" — not attached.`);
        });
      }
    });
    return warnings;
  }


  // ── Processing Order ──────────────────────────────────────

  const PROCESSING_ORDER = [
    'correction-as-governance',
    'baseline-vs-live-material',
    'open-gap-discipline',
    'independent-signal-counting',
    'external-constraint-reading',
    'movement-non-movement-reading',
    'avoidance-detection',
    'load-sensitive-capability',
    'contradiction-holding',
    'competing-priorities',
    'connections-across-time',
    'state-change-detection',
    'confidence-calibration',
    'next-useful-move',
    'private-record-to-optional-handover',
    'meta-reading',
    'horizon-reading',   // Position 17. Opt-in. Runs last — reads completed map.
  ];


  // ── Output gate ───────────────────────────────────────────

  const CONFIDENCE_RANK = { 'not_readable': 0, 'inferred': 1, 'thin': 2, 'partial': 3, 'supported': 4, 'strong': 5 };

  function _applyOutputGate(responses, map, gateConfig) {
    if (!gateConfig) return responses;
    const minRank  = CONFIDENCE_RANK[gateConfig.minConfidenceLevel] ?? 0;
    const mapRank  = CONFIDENCE_RANK[map.confidence?.overall] ?? 0;
    const fallback = gateConfig.fallbackAction || 'hold';
    return responses.map(response => {
      if (response.action === 'output' && mapRank < minRank) {
        return { ...response, action: fallback, gateTriggered: true, gateReason: `Confidence "${map.confidence?.overall || 'unknown'}" below minimum "${gateConfig.minConfidenceLevel}". Rerouted to "${fallback}".` };
      }
      return response;
    });
  }


  // ── Execute ───────────────────────────────────────────────

  function execute(options = {}) {
    if (!_input)    throw new Error('No input set. Call SorterSpine.setInput() before execute().');
    if (!_runtime)  throw new Error('No runtime set. Call SorterSpine.setRuntime() before execute().');

    const traceEnabled = options.trace === true;
    const gateConfig   = options.gateConfig || (_config.highStakes ? { minConfidenceLevel: 'supported', fallbackAction: 'hold' } : null);
    const trace        = [];
    const warnings     = _checkComponentDependencies();

    const composed = _compose();

    let map = {
      confidence: { overall: 'not_readable', byBehaviour: {} },
      gaps: { open: [], closed: [], count: 0, highestPriority: null },
      signals: {}, movement: {}, avoidance: {}, constraints: {}, contradictions: {},
      competingPriorities: {}, connections: {}, stateChanges: {},
      nextMove: null, handover: null, metaReading: null,
      corrections: _input.corrections || [], load: {}, baseline: {},
    };

    const behaviourOrder = options.behaviourOrder || PROCESSING_ORDER;

    for (const behaviourId of behaviourOrder) {
      const behaviourConfig = composed[behaviourId];
      if (!behaviourConfig) continue;

      // Horizon-reading is opt-in — skip unless explicitly enabled.
      if (behaviourId === 'horizon-reading' && !_config.horizonEnabled) continue;

      const before = traceEnabled ? JSON.parse(JSON.stringify(map)) : null;
      try {
        map = _runtime.read(_input, map, behaviourConfig);
      } catch (err) {
        warnings.push(`Behaviour "${behaviourId}" threw during read(): ${err.message}`);
        if (traceEnabled) trace.push({ step: behaviourId, status: 'error', error: err.message, mapSnapshot: null });
        continue;
      }
      if (traceEnabled) trace.push({ step: behaviourId, status: 'ok', changes: _diffMap(before, map), mapSnapshot: JSON.parse(JSON.stringify(map)) });
    }

    const responses      = [];
    const componentOrder = options.componentOrder ? options.componentOrder.map(id => _components[id]).filter(Boolean) : _resolveComponentOrder();

    if (_componentRuntime) {
      for (const component of componentOrder) {
        const before = traceEnabled ? JSON.parse(JSON.stringify(map)) : null;
        let response;
        try {
          response = _componentRuntime.respond(map, component);
        } catch (err) {
          warnings.push(`Component "${component.id}" threw during respond(): ${err.message}`);
          if (traceEnabled) trace.push({ step: `component:${component.id}`, status: 'error', error: err.message });
          continue;
        }
        responses.push({ componentId: component.id, ...response });
        if (response.mapUpdate) map = { ...map, ...response.mapUpdate };
        if (traceEnabled) trace.push({ step: `component:${component.id}`, status: 'ok', response, changes: before ? _diffMap(before, map) : null });
      }
    }

    const gatedResponses = _applyOutputGate(responses, map, gateConfig);
    const result = { map, responses: gatedResponses, warnings };
    if (traceEnabled) result.trace = trace;

    _state = { ...result, composed, input: _input, behaviourIds: Object.keys(_behaviours), guideIds: Object.keys(_guides), componentIds: Object.keys(_components), processingOrder: PROCESSING_ORDER, meta: _input.meta };

    return result;
  }


  // ── Map diff ──────────────────────────────────────────────

  function _diffMap(before, after) {
    if (!before) return null;
    const changes = {};
    Object.keys(after).forEach(key => {
      const bVal = JSON.stringify(before[key]);
      const aVal = JSON.stringify(after[key]);
      if (bVal !== aVal) changes[key] = { before: before[key], after: after[key] };
    });
    return Object.keys(changes).length ? changes : null;
  }


  // ── run() — compose only ──────────────────────────────────

  function run() {
    if (!_input) throw new Error('No input set.');
    const dependencyWarnings = _checkComponentDependencies();
    _state = { composed: _compose(), input: _input, behaviourIds: Object.keys(_behaviours), guideIds: Object.keys(_guides), componentIds: Object.keys(_components), processingOrder: PROCESSING_ORDER, dependencyWarnings, meta: _input.meta };
    if (dependencyWarnings.length) console.warn('SorterSpine dependency warnings:', dependencyWarnings);
    return _state;
  }


  // ── saveState() and loadState() ───────────────────────────
  //
  // Serialise the current map and input for persistent storage.
  // Use to save state after execute() and restore it in the next session.
  //
  // saveState() returns a JSON string.
  // loadState() restores map state for introspection and continued execution.
  //
  // Note: runtime adapters, behaviours, guides, and components are NOT
  // serialised — they must be re-attached in each session. Only the
  // map state and input are persisted.

  function saveState() {
    if (!_state.map && !_state.composed) {
      throw new Error('No state to save. Call execute() or run() first.');
    }
    return JSON.stringify({
      version:     '0.5.1',
      savedAt:     new Date().toISOString(),
      deploymentId: _config.deploymentId || null,
      map:         _state.map    || null,
      input:       _state.input  || _input,
      warnings:    _state.warnings || [],
    }, null, 2);
  }

  function loadState(stateJSON) {
    let saved;
    try {
      saved = typeof stateJSON === 'string' ? JSON.parse(stateJSON) : stateJSON;
    } catch (e) {
      throw new Error(`loadState: invalid JSON — ${e.message}`);
    }

    if (saved.input) {
      _validateInput(saved.input);
      _input = saved.input;
    }

    if (saved.map) {
      _state.map = saved.map;
    }

    _state.savedAt      = saved.savedAt;
    _state.deploymentId = saved.deploymentId;

    return SorterSpine;
  }


  // ── Cartridge serialisation ───────────────────────────────

  function exportCartridge() {
    return JSON.stringify({
      version:    '0.5.1',
      exportedAt: new Date().toISOString(),
      deploymentConfig: _config,
      behaviours: Object.values(_behaviours).map(b => ({ id: b.id, version: b.version, purpose: b.purpose, coreRule: b.coreRule, boundary: b.boundary })),
      guides:     Object.values(_guides).map(g => ({ id: g.id, version: g.version, type: g.type, sector: g.sector, purpose: g.purpose, parent: g.parent || null, steer: g.steer })),
      components: Object.values(_components).map(c => ({ id: c.id, version: c.version, tags: c.tags, purpose: c.purpose, coreRule: c.coreRule, boundary: c.boundary, behaviourInputs: c.behaviourInputs || [], componentInputs: c.componentInputs || [], priority: c.priority || 50, runAfter: c.runAfter || [] })),
    }, null, 2);
  }

  function loadCartridge(cartridgeJSON) {
    let cartridge;
    try { cartridge = typeof cartridgeJSON === 'string' ? JSON.parse(cartridgeJSON) : cartridgeJSON; }
    catch (e) { throw new Error(`loadCartridge: invalid JSON — ${e.message}`); }

    // Apply deployment config from cartridge if present
    if (cartridge.deploymentConfig) configure(cartridge.deploymentConfig);

    if (cartridge.behaviours) cartridge.behaviours.forEach(b => { _validateBehaviour(b); _behaviours[b.id] = b; });

    if (cartridge.guides) {
      const sector    = cartridge.guides.filter(g => g.type === 'sector');
      const subsector = cartridge.guides.filter(g => g.type === 'subsector');
      const output    = cartridge.guides.filter(g => g.type === 'output');
      [...sector, ...output, ...subsector].forEach(g => attachGuide(g));
    }

    if (cartridge.components) {
      cartridge.components.forEach(c => {
        // Simulation isolation applies here too
        try { attachComponent(c); }
        catch (e) {
          console.warn(`loadCartridge: skipped component "${c.id}" — ${e.message}`);
        }
      });
    }

    return SorterSpine;
  }


  // ── Introspection ─────────────────────────────────────────

  function getBehaviour(id)  { return _behaviours[id] || null; }
  function getGuide(id)      { return _guides[id]     || null; }
  function getComponent(id)  { return _components[id] || null; }

  function listBehaviours() { return Object.values(_behaviours).map(b => ({ id: b.id, version: b.version, purpose: b.purpose })); }
  function listGuides()     { return Object.values(_guides).map(g => ({ id: g.id, version: g.version, type: g.type, sector: g.sector, purpose: g.purpose, parent: g.parent || null })); }
  function listComponents() { return Object.values(_components).map(c => ({ id: c.id, version: c.version, tags: c.tags, purpose: c.purpose, behaviourInputs: c.behaviourInputs || [], componentInputs: c.componentInputs || [], priority: c.priority || 50, runAfter: c.runAfter || [] })); }

  function describe() {
    const guides     = listGuides();
    const components = listComponents();
    const componentsByTag = {};
    components.forEach(c => { c.tags.forEach(tag => { if (!componentsByTag[tag]) componentsByTag[tag] = []; componentsByTag[tag].push(c); }); });
    const attachedIds     = new Set(Object.keys(_behaviours));
    const orderedAttached = PROCESSING_ORDER.filter(id => attachedIds.has(id));
    const unordered       = [...attachedIds].filter(id => !PROCESSING_ORDER.includes(id));
    const warnings        = _checkComponentDependencies();
    return {
      assembly: { behaviourCount: Object.keys(_behaviours).length, guideCount: Object.keys(_guides).length, componentCount: Object.keys(_components).length, hasInput: !!_input, hasRuntime: !!_runtime, hasComponentRuntime: !!_componentRuntime, inputEntries: _input ? _input.entries.length : 0, inputCorrections: _input ? _input.corrections.length : 0 },
      behaviours: { inProcessingOrder: orderedAttached, notInOrder: unordered, all: listBehaviours() },
      guides: { sector: guides.filter(g => g.type === 'sector'), subsector: guides.filter(g => g.type === 'subsector'), output: guides.filter(g => g.type === 'output') },
      components: { all: components, byTag: componentsByTag, order: _resolveComponentOrder().map(c => c.id) },
      processingOrder: PROCESSING_ORDER,
      dependencyWarnings: warnings,
      deploymentConfig: { ..._config },
    };
  }


  // ── Reset ─────────────────────────────────────────────────

  function reset() {
    _behaviours = {}; _guides = {}; _components = {}; _input = null; _state = {}; _runtime = null; _componentRuntime = null;
    _config = { allowSimulationComponents: false, deploymentId: null, highStakes: false };
    return SorterSpine;
  }


  // ── Public API ────────────────────────────────────────────

  return {
    configure,
    attachBehaviour, attachGuide, attachComponent,
    detachBehaviour, detachGuide, detachComponent,
    setRuntime, setComponentRuntime,
    setInput,
    execute, run,
    saveState, loadState,
    exportCartridge, loadCartridge,
    getBehaviour, getGuide, getComponent,
    listBehaviours, listGuides, listComponents,
    describe, reset,
    contracts: {
      behaviour:          BEHAVIOUR_REQUIRED,
      guide:              GUIDE_REQUIRED,
      component:          COMPONENT_REQUIRED,
      input:              INPUT_REQUIRED,
      processingOrder:    PROCESSING_ORDER,
      behaviourInterface: BEHAVIOUR_INTERFACE,
      componentInterface: COMPONENT_INTERFACE,
      simulationTags:     SIMULATION_TAGS,
    },
  };

})();
