/**
 * ══════════════════════════════════════════════════════
 * MERCATOR ENGINE  v3.1.0
 * ══════════════════════════════════════════════════════
 *
 * A standalone analysis engine for LACE V cartridge-based tools.
 * Reads free-text entries against a domain cartridge and produces
 * structured map output: gaps, skills, contradictions, direction,
 * pressure, movement, confidence, and next useful move.
 *
 * USAGE
 * ─────
 * 1. Load this file before the shell and cartridge:
 *      <script src="mercator-core.js"></script>
 *      <script src="cartridge-grief.js"></script>
 *      <script src="shell.js"></script>
 *
 * 2. In the shell, call:
 *      MercatorEngine.mountCartridge(window.SORTER_CARTRIDGE);
 *      MercatorEngine.restore();
 *
 * 3. Use the public API for all state and report operations.
 *
 * CARTRIDGE SCHEMA
 * ────────────────
 * A cartridge is a plain object assigned to window.SORTER_CARTRIDGE:
 * {
 *   id:                  string,         // unique slug, used as localStorage key
 *   name:                string,         // display name
 *   tagline:             string,         // short descriptor
 *   desc:                string,         // onboarding description
 *   accent:              string,         // CSS colour (hex), e.g. "#2d5a3d"
 *   accentLight:         string,         // CSS colour for light tint
 *
 *   baselineTitle:       string,
 *   baselineDesc:        string,
 *   baselinePlaceholder: string,
 *   entryTitle:          string,
 *   entryDesc:           string,
 *   entryPlaceholder:    string,
 *   reportDesc:          string,
 *   reportEmptyDesc:     string,
 *
 *   crisisCheck:         boolean,        // whether to scan entries for crisis language
 *   crisisRx:            RegExp,         // pattern to detect crisis language
 *
 *   gaps: [
 *     {
 *       key:    string,   // unique identifier
 *       name:   string,   // display name
 *       rx:     RegExp,   // detects presence of this topic in text
 *       reason: string,   // why the gap matters — shown to the user
 *     }
 *   ],
 *
 *   skills: [
 *     {
 *       key:             string,
 *       name:            string,
 *       rx:              RegExp,
 *       loadSensitive:   boolean, // true = this skill tends to break under pressure
 *       isStructureSkill:boolean, // true = a foundational structural skill
 *       works:           string,  // description of the skill in action
 *       breaks:          string,  // description of what causes the skill to break
 *     }
 *   ],
 *
 *   contradictions: [
 *     {
 *       a:    RegExp,   // first pattern
 *       b:    RegExp,   // second pattern — tension when both present
 *       text: string,  // explanation shown to user when both fire
 *     }
 *   ],
 *
 *   directionPatterns: [
 *     {
 *       rx:    RegExp,
 *       label: string,  // "toward X" — shown in Direction visible block
 *     }
 *   ],
 *
 *   pressureSignals: [
 *     {
 *       key:   string,
 *       rx:    RegExp,
 *       label: string,
 *     }
 *   ],
 *
 *   stuckRx:        RegExp,           // detects stuck/circular language
 *   sampleBaseline: string,           // pre-filled demo baseline
 *   sampleEntries:  [{ daysAgo: number, text: string }],
 *   sampleCorrection: string,         // optional pre-filled demo correction
 * }
 *
 * CHANGELOG
 * ─────────
 * v3.1.0  — Extracted from embedded shell. No functional changes.
 *           Added JSDoc and cartridge schema documentation.
 *           Version bumped to distinguish from embedded v3.0.x builds.
 * v3.0.2  — Internal: stable embedded engine used across all existing
 *           assembled cartridge files.
 *
 * ══════════════════════════════════════════════════════
 */

const MercatorEngine = (() => {

  let _cartridge = null;
  let _state = {
    baseline: '',
    crisisContact: '',
    entries: [],
    corrections: [],
    connections: [],
    exitReportGenerated: false,
    crisisPaused: false,
    crisisResumedAt: null,
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const todayISO    = () => new Date().toISOString().slice(0, 10);
  const daysAgoISO  = n  => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
  const daysBetween = (a, b) => Math.abs((new Date(a) - new Date(b)) / 86400000);
  const escapeHTML  = s  => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const shorten     = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;
  const uid         = () => Math.random().toString(36).slice(2, 9);
  const safe        = escapeHTML;

  function _testRx(rx, text) {
    if (!rx) return false;
    try {
      return (rx instanceof RegExp ? rx : new RegExp(rx.source || rx, rx.flags || 'i')).test(text);
    } catch (e) {
      return false;
    }
  }

  // ── State management ─────────────────────────────────────────────────────

  function mountCartridge(c) { _cartridge = c; }
  function getCartridge()    { return _cartridge; }
  function getState()        { return { ..._state, entries: [..._state.entries], corrections: [..._state.corrections] }; }

  function saveBaseline(text)    { _state.baseline = text; _persist(); }
  function saveCrisisContact(c)  { _state.crisisContact = c; _persist(); }

  function addEntry(date, text) {
    _state.entries.push({ id: uid(), date, text, flagged: false, createdAt: new Date().toISOString() });
    _persist();
    _checkCrisis(text);
  }

  function editEntry(id, text) {
    const e = _state.entries.find(e => e.id === id);
    if (e) { e.text = text; e.editedAt = new Date().toISOString(); }
    _persist();
  }

  function deleteEntry(id) {
    _state.entries = _state.entries.filter(e => e.id !== id);
    _persist();
  }

  function toggleFlag(id) {
    const e = _state.entries.find(e => e.id === id);
    if (e) e.flagged = !e.flagged;
    _persist();
  }

  function addCorrection(text) {
    _state.corrections.push({ id: uid(), date: todayISO(), text });
    _persist();
  }

  function deleteCorrection(id) {
    _state.corrections = _state.corrections.filter(c => c.id !== id);
    _persist();
  }

  function clearAll() {
    _state = {
      baseline: '', crisisContact: '', entries: [], corrections: [],
      connections: [], exitReportGenerated: false,
      crisisPaused: false, crisisResumedAt: null,
    };
    _persist();
  }

  function exportJSON() {
    return JSON.stringify({
      cartridge: _cartridge?.id,
      exportedAt: new Date().toISOString(),
      state: _state,
    }, null, 2);
  }

  function loadSample() {
    if (!_cartridge) return;
    const c = _cartridge;
    _state.baseline = c.sampleBaseline || '';
    _state.crisisContact = '';
    _state.entries = (c.sampleEntries || []).map(e => ({
      id: uid(),
      date: daysAgoISO(e.daysAgo || 0),
      text: e.text,
      flagged: false,
      createdAt: new Date().toISOString(),
    }));
    _state.corrections = c.sampleCorrection
      ? [{ id: uid(), date: todayISO(), text: c.sampleCorrection }]
      : [];
    _persist();
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  function _persist() {
    try {
      localStorage.setItem('sorter-map-' + (_cartridge?.id || 'default'), JSON.stringify(_state));
    } catch (e) {}
  }

  function _restore() {
    try {
      const saved = localStorage.getItem('sorter-map-' + (_cartridge?.id || 'default'));
      if (saved) { const p = JSON.parse(saved); Object.assign(_state, p); }
    } catch (e) {}
  }

  // ── Crisis detection ──────────────────────────────────────────────────────

  function _checkCrisis(text) {
    if (!_cartridge?.crisisCheck || !_cartridge?.crisisRx) return;
    if (_testRx(_cartridge.crisisRx, text)) {
      const banner = document.getElementById('crisis-banner');
      if (banner) {
        const contactEl = document.getElementById('crisis-contact-display');
        if (contactEl && _state.crisisContact) contactEl.textContent = ' ' + _state.crisisContact;
        banner.style.display = 'block';
      }
    }
  }

  // ── Analysis core ─────────────────────────────────────────────────────────

  function _allText(entries) {
    return entries.map(e => e.text || '').join('\n');
  }

  function _independentDays(entries, rx) {
    const days = new Set();
    entries.forEach(e => {
      if (_testRx(rx, e.text || '') && e.date) days.add(e.date.slice(0, 10));
    });
    return days.size;
  }

  function _confidenceTier(independentDays, entryCount) {
    if (entryCount === 0)       return 'not_readable';
    if (independentDays >= 5)   return 'strong';
    if (independentDays >= 3)   return 'supported';
    if (independentDays >= 2)   return 'partial';
    if (independentDays === 1)  return 'thin';
    if (entryCount > 0)         return 'inferred';
    return 'not_readable';
  }

  function _readGaps(baseline, entries) {
    const gaps = _cartridge?.gaps || [];
    const allText = _allText(entries);
    return gaps.filter(g => !_testRx(g.rx, baseline) && !_testRx(g.rx, allText));
  }

  function _readSkills(entries) {
    const skills = _cartridge?.skills || [];
    const present = [], absent = [], loadSensitivePresent = [];
    skills.forEach(s => {
      const days = _independentDays(entries, s.rx);
      if (days > 0) {
        present.push({ ...s, independentDays: days });
        if (s.loadSensitive) loadSensitivePresent.push(s);
      } else {
        absent.push(s);
      }
    });
    return { present, absent, loadSensitivePresent };
  }

  function _readContradictions(baseline, entries) {
    const contradictions = _cartridge?.contradictions || [];
    const allText = baseline + '\n' + _allText(entries);
    return contradictions.filter(c => _testRx(c.a, allText) && _testRx(c.b, allText));
  }

  function _readDirection(baseline, entries) {
    const patterns = _cartridge?.directionPatterns || [];
    const allText = baseline + '\n' + _allText(entries);
    return patterns.filter(p => _testRx(p.rx, allText)).map(p => p.label);
  }

  function _readPressure(entries) {
    const signals = _cartridge?.pressureSignals || [];
    const allText = _allText(entries);
    return signals.filter(s => _testRx(s.rx, allText)).map(s => s.label);
  }

  function _readMovement(entries) {
    if (!entries.length) return { isMoving: false, signals: [], independentDays: 0 };
    const skills = _cartridge?.skills || [];
    let totalDays = 0;
    const signals = [];
    skills.forEach(s => {
      const days = _independentDays(entries, s.rx);
      if (days > 0) { signals.push(s.name); totalDays += days; }
    });
    return {
      isMoving: signals.length > 0,
      signals,
      independentDays: Math.min(totalDays, entries.length),
    };
  }

  function _readStuck(entries) {
    const rx = _cartridge?.stuckRx;
    if (!rx) return { signals: [] };
    return { signals: _testRx(rx, _allText(entries)) ? ['Stuck language present.'] : [] };
  }

  function _overallConfidence(openGaps, movement, entries) {
    const n = entries.length;
    if (n === 0) return 'not_readable';
    if (openGaps.length >= 4) return 'thin';
    if (movement.independentDays >= 3 && openGaps.length <= 1) return 'supported';
    if (movement.independentDays >= 2) return 'partial';
    if (n > 0 && openGaps.length <= 2) return 'partial';
    return 'thin';
  }

  function _nextUsefulMove(openGaps, movement, stuck, pressure) {
    if (openGaps.length > 0) {
      const g = openGaps[0];
      return g.reason
        ? `Address the open gap: ${g.reason}`
        : `Name what is not yet described: ${g.name}.`;
    }
    if (stuck.signals.length > 0)
      return 'The map is reading a stuck pattern. Name specifically what has not moved and what is getting in the way.';
    if (pressure.length > 0)
      return `Pressure is active (${pressure[0]}). Name what that pressure is doing to the map — what it is stopping or changing.`;
    if (movement.isMoving)
      return 'Movement is visible. The next entry should describe what the movement is building toward, not just that it is happening.';
    return 'Add honest material — the map cannot produce a reliable next move yet.';
  }

  // ── Report rendering ──────────────────────────────────────────────────────

  function _confidenceBadge(level) {
    const labels = {
      strong: 'strong read', supported: 'supported', partial: 'partial',
      thin: 'thin', inferred: 'inferred', not_readable: 'not readable',
    };
    return `<span class="confidence-badge ${level}">${labels[level] || level}</span>`;
  }

  function _renderBlock(title, items, cls = '') {
    if (!items.length) return '';
    const itemsHTML = items.map(i => `<div class="report-item ${cls}">${safe(i)}</div>`).join('');
    return `<div class="report-block">
      <p class="report-block-title">${safe(title)}</p>
      ${itemsHTML}
    </div>`;
  }

  function generateReport(start, end, outputEl, emptyEl) {
    const entries = _state.entries.filter(e => {
      if (!e.date) return true;
      if (start && e.date < start) return false;
      if (end   && e.date > end)   return false;
      return true;
    });

    if (!_state.baseline && !entries.length) {
      if (emptyEl) { emptyEl.style.display = 'flex'; outputEl.style.display = 'none'; }
      return;
    }

    const baseline      = _state.baseline || '';
    const openGaps      = _readGaps(baseline, entries);
    const skills        = _readSkills(entries);
    const contradictions= _readContradictions(baseline, entries);
    const directions    = _readDirection(baseline, entries);
    const pressure      = _readPressure(entries);
    const movement      = _readMovement(entries);
    const stuck         = _readStuck(entries);
    const confidence    = _overallConfidence(openGaps, movement, entries);
    const nextMove      = _nextUsefulMove(openGaps, movement, stuck, pressure);
    const corrections   = _state.corrections;

    // Summary capstone
    const movementSummary  = movement.signals.length ? movement.signals.slice(0, 3).join(', ') : 'Not yet visible — more entries needed.';
    const gapSummary       = openGaps.length ? openGaps.map(g => g.name).slice(0, 3).join(', ') : 'No critical gaps detected.';
    const directionSummary = directions.length ? directions[0] : 'Not yet stated.';
    const pressureSummary  = pressure.length ? pressure.slice(0, 2).join(', ') : 'Not visible in current entries.';

    let html = `<div class="summary-capstone">
      <p class="summary-title">Current read</p>
      <div class="summary-row"><strong>Movement</strong><span>${safe(movementSummary)}</span></div>
      <div class="summary-row"><strong>Load</strong><span>${safe(pressureSummary)}</span></div>
      <div class="summary-row"><strong>Main gap</strong><span>${safe(gapSummary)}</span></div>
      <div class="summary-row"><strong>Direction</strong><span>${safe(directionSummary)}</span></div>
      <div class="summary-row"><strong>Confidence</strong><span>${_confidenceBadge(confidence)}</span></div>
    </div>`;

    // Corrections applied
    if (corrections.length) {
      html += `<div class="report-block">
        <p class="report-block-title">Corrections applied</p>
        ${corrections.map(c => `<div class="report-item">${safe(c.date)} — ${safe(c.text)}</div>`).join('')}
      </div>`;
    }

    // What is moving
    if (movement.signals.length) {
      html += `<div class="report-block">
        <p class="report-block-title">What is moving</p>
        ${movement.signals.map(s => `<div class="report-item moving">${safe(s)}</div>`).join('')}
      </div>`;
    } else {
      html += `<div class="report-block">
        <p class="report-block-title">What is moving</p>
        <div class="report-item">Movement is not yet visible in the current entries. The map needs more material to read this.</div>
      </div>`;
    }

    // Stuck
    if (stuck.signals.length) {
      html += `<div class="report-block">
        <p class="report-block-title">What is not moving</p>
        <div class="report-item warn">Stuck language is present in the material. Something is not moving — the entries describe circling or repetition.</div>
      </div>`;
    }

    // Pressure / Direction / Contradictions
    if (pressure.length)      html += _renderBlock('What is under load', pressure, 'warn');
    if (directions.length)    html += _renderBlock('Direction visible', directions, 'moving');

    if (contradictions.length) {
      html += `<div class="report-block">
        <p class="report-block-title">Unresolved tensions</p>
        ${contradictions.map(c => `<div class="report-item held">${safe(c.text)}</div>`).join('')}
      </div>`;
    }

    // Skills present
    if (skills.present.length) {
      html += `<div class="report-block">
        <p class="report-block-title">Skills visible in the material</p>
        ${skills.present.map(s => `<div class="report-item moving">
          <strong>${safe(s.name)}</strong> — ${safe(s.works)}
          ${_confidenceBadge(_confidenceTier(s.independentDays, entries.length))}
        </div>`).join('')}
      </div>`;
    }

    // Open gaps
    if (openGaps.length) {
      html += `<div class="report-block">
        <p class="report-block-title">Open gaps</p>
        ${openGaps.map(g => `<div class="gap-notice">
          <strong>${safe(g.name)}</strong> — ${safe(g.reason)}
        </div>`).join('')}
      </div>`;
    }

    // Next useful move
    html += `<div class="next-move-block">
      <p class="report-block-title">Next useful move</p>
      <p>${safe(nextMove)}</p>
    </div>`;

    // Confidence and limits
    html += `<div class="report-block">
      <p class="report-block-title">Map confidence and limits</p>
      <div class="report-item">Overall: ${_confidenceBadge(confidence)}</div>
      <div class="report-item">Based on ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} in the selected period.</div>
      ${openGaps.length ? `<div class="report-item gap">${openGaps.length} open gap${openGaps.length > 1 ? 's' : ''} — the map cannot read what was not written.</div>` : ''}
      <div class="report-item">This map reads what was written. It cannot see what was held back. It does not diagnose, assess risk, or produce a legal finding.</div>
    </div>`;

    if (emptyEl) emptyEl.style.display = 'none';
    outputEl.style.display = 'block';
    outputEl.innerHTML = html;
  }

  function generateExitReport(outputEl) {
    generateReport(null, null, outputEl, null);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  return {
    // Cartridge / state
    mountCartridge,
    getCartridge,
    getState,
    // Data operations
    saveBaseline,
    saveCrisisContact,
    addEntry,
    editEntry,
    deleteEntry,
    toggleFlag,
    addCorrection,
    deleteCorrection,
    clearAll,
    exportJSON,
    loadSample,
    // Report
    generateReport,
    generateExitReport,
    // Utilities (used by shells)
    escapeHTML,
    shorten,
    restore: _restore,
  };

})();
