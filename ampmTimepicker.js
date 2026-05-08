class AmPmTimePicker extends HTMLElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ['disabled', 'readonly', 'required', 'value'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._internals = this.attachInternals();

    this._handleGlobalScroll = (e) => {
      if (!this.dropdown || this.dropdown.classList.contains('ampm-hidden')) return;
      if (e.composedPath().includes(this.dropdown)) return;
      this.hideDropdown();
      this.commit();
    };

    this._handleDocumentMouseDown = (e) => {
      if (this.dropdown && !this.contains(e.target) && !this.dropdown.contains(e.target)) {
        if (!this.dropdown.classList.contains('ampm-hidden')) { this.hideDropdown(); this.commit(); }
      }
    };
  }

  connectedCallback() {
    this.useAmPm = this.getAttribute('use-ampm') === 'true';
    this.interval = parseInt(this.getAttribute('interval')) || 1;
    const margin = this.getAttribute('margin-right') || '0px';

    this.labelHour = this.getAttribute('hour-label');
    this.labelMin = this.getAttribute('min-label');
    this.labelAmPm = this.getAttribute('ampm-label');

    const startStr = this.getAttribute('start-time');
    const endStr = this.getAttribute('end-time');
    this.startMin = this.timeToMinutes(startStr) ?? 0;
    this.endMin = this.timeToMinutes(endStr) ?? 1439;

    this.prepareData();
    this._lastDispatchedValue = '';
    this.render(margin);
    this.cacheElements();
    this.init();

    // 외부 CSS 로드 등 시점 대응을 위해 아이콘 적용 여부 검사
    this._checkIcon = () => {
      if (!this.toggleBtn) return;
      const iconUrl = getComputedStyle(this).getPropertyValue('--toggle-icon-url').trim();
      this.toggleBtn.textContent = (iconUrl && iconUrl !== 'none') ? '' : '▼';
    };
    requestAnimationFrame(this._checkIcon);
    setTimeout(this._checkIcon, 100);

    if (this.hasAttribute('value')) {
      this.value = this.getAttribute('value');
    }

    if (this.input) {
      this.input.disabled = this.hasAttribute('disabled');
      this.input.readOnly = this.hasAttribute('readonly');
    }
    if (this.toggleBtn) {
      this.toggleBtn.disabled = this.hasAttribute('disabled') || this.hasAttribute('readonly');
    }
    this._internals.setFormValue(this.value);
    this.updateValidity();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (!this.input) return; // DOM이 생성되기 전이면 무시 (connectedCallback에서 초기화됨)


    if (name === 'disabled') {
      if (this.input) this.input.disabled = this.hasAttribute('disabled');
      if (this.toggleBtn) this.toggleBtn.disabled = this.hasAttribute('disabled') || this.hasAttribute('readonly');
      if (this.hasAttribute('disabled')) this.hideDropdown();
    } else if (name === 'readonly') {
      if (this.input) this.input.readOnly = this.hasAttribute('readonly');
      if (this.toggleBtn) this.toggleBtn.disabled = this.hasAttribute('disabled') || this.hasAttribute('readonly');
      if (this.hasAttribute('readonly')) this.hideDropdown();
    } else if (name === 'value') {
      this.value = newValue;
    } else if (name === 'required') {
      this.updateValidity();
    }
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get readOnly() { return this.hasAttribute('readonly'); }
  set readOnly(val) { val ? this.setAttribute('readonly', '') : this.removeAttribute('readonly'); }

  get required() { return this.hasAttribute('required'); }
  set required(val) { val ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  updateValidity() {
    if (!this._internals) return;
    const isRequired = this.hasAttribute('required');
    const hasValue = !!this.value;

    if (isRequired && !hasValue) {
      this._internals.setValidity({ valueMissing: true }, '이 필드는 필수입니다.', this.input);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    // 폼이 리셋될 때, 초기 HTML에 선언된 value 속성값으로 되돌림 (없으면 빈칸)
    this.value = this.getAttribute('value') || '';
  }

  disconnectedCallback() {
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown);
    }
    window.removeEventListener('scroll', this._handleGlobalScroll, { capture: true });
    window.removeEventListener('resize', this._handleGlobalScroll);
    document.removeEventListener('mousedown', this._handleDocumentMouseDown);
  }

  prepareData() {
    if (this.useAmPm) {
      this.hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i).toString().padStart(2, '0'));
      this.ampms = ['AM', 'PM'];
    } else {
      this.hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    }
    this.minutes = Array.from({ length: 60 / this.interval }, (_, i) => (i * this.interval).toString().padStart(2, '0'));
  }

  // --- Helpers ---
  timeToMinutes(str) {
    if (!str || !/^\d{1,2}:\d{2}$/.test(str)) return null;
    let [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  }

  get24hMinutes(valStr) {
    if (!valStr) return this.startMin;
    let { timePart, ampmPart } = this.parseInputString(valStr);
    let parts = timePart.split(':');
    let h = parseInt(parts[0]) || 0;
    let m = parseInt(parts[1]) || 0;
    if (this.useAmPm) {
      if (ampmPart === 'PM' && h < 12) h += 12;
      if (ampmPart === 'AM' && h === 12) h = 0;
    }
    return h * 60 + m;
  }

  clampMinutes(totalMins) {
    return Math.max(this.startMin, Math.min(this.endMin, totalMins));
  }

  formatFromMinutes(totalMins) {
    let h24 = Math.floor(totalMins / 60);
    let m = totalMins % 60;
    let mStr = m.toString().padStart(2, '0');
    if (this.useAmPm) {
      let ampm = h24 >= 12 ? 'PM' : 'AM';
      let h12 = h24 % 12 || 12;
      return `${ampm} ${h12.toString().padStart(2, '0')}:${mStr}`;
    }
    return `${h24.toString().padStart(2, '0')}:${mStr}`;
  }

  render(margin) {
    this.shadowRoot.innerHTML = `
      <style>
        :host { 
          display: inline-block; 
          margin-right: ${margin}; 
          box-sizing: border-box; 
          vertical-align: middle;
          --ampm-width: var(--width, 165px); 
          --ampm-height: var(--height, 42px);
          --ampm-border-radius: var(--border-radius, 8px);
          --ampm-bg-color: var(--bg-color, Field);
          --ampm-font-color: var(--font-color, FieldText);
          
          --ampm-primary-color: var(--primary-color, #007bff); 
          --ampm-border-color: var(--border-color, ButtonBorder); 
          --ampm-bg-hover: var(--bg-hover, #f1f7ff); 
          --ampm-toggle-border-left: var(--toggle-border-left, 1px solid var(--ampm-border-color));
          --ampm-toggle-icon-url: var(--toggle-icon-url, none);
          --ampm-toggle-icon-size: var(--toggle-icon-size, 16px);
          --ampm-invalid-color: var(--invalid-color, #dc3545);
          
          --ampm-dropdown-bg: var(--ampm-bg-color);
          --ampm-dropdown-border-color: var(--ampm-border-color);
          --ampm-dropdown-text-color: var(--ampm-font-color);
          --ampm-dropdown-hover-bg: var(--ampm-bg-hover);
          --ampm-dropdown-header-bg: rgba(0,0,0,0.04);
          --ampm-dropdown-divider-color: #eee;
          --ampm-dropdown-scrollbar-thumb: #ccc;
          
          --ampm-disabled-bg: var(--disabled-bg, #ddd);
          --ampm-disabled-opacity: var(--disabled-opacity, 0.6);
          --ampm-readonly-bg: var(--readonly-bg, #f0f0f0);
          
          width: var(--ampm-width);
          color: var(--ampm-font-color);
        }
        @media (prefers-color-scheme: dark) {
          :host {
            --ampm-bg-hover: var(--bg-hover, rgba(255, 255, 255, 0.1));
            --ampm-primary-color: var(--primary-color, #4da3ff);
            --ampm-dropdown-header-bg: rgba(255, 255, 255, 0.05);
            --ampm-dropdown-divider-color: #444;
            --ampm-dropdown-scrollbar-thumb: #555;
            --ampm-disabled-bg: var(--disabled-bg, #444);
            --ampm-readonly-bg: var(--readonly-bg, #2a2a2a);
          }
        }
        :host([disabled]) {
          opacity: var(--ampm-disabled-opacity);
          cursor: not-allowed;
        }
        :host([disabled]) .time-picker-container {
          background-color: var(--ampm-disabled-bg);
        }
        :host([readonly]) .time-picker-container {
          background-color: var(--ampm-readonly-bg);
        }
        :host(:invalid) .time-picker-container {
          border-color: var(--ampm-invalid-color);
        }
        :host(:invalid) .time-picker-container:focus-within {
          outline: 2px solid var(--ampm-invalid-color);
          outline-offset: -2px;
        }
        .time-picker-container { 
          position: relative; 
          display: flex; 
          width: 100%; 
          height: var(--ampm-height);
          align-items: center; 
          border: 1px solid var(--ampm-border-color); 
          border-radius: var(--ampm-border-radius); 
          background: var(--ampm-bg-color); 
          font-family: inherit; 
          box-sizing: border-box; 
          overflow: hidden;
        }
        .time-input { 
          border: none; 
          outline: none; 
          padding: 0 12px; 
          flex: 1; 
          width: 0;
          height: 100%;
          font-family: inherit;
          font-size: inherit; 
          background: transparent;
          color: inherit;
          box-sizing: border-box; 
          line-height: var(--ampm-height);
          border-top-left-radius: calc(var(--ampm-border-radius) - 1px);
          border-bottom-left-radius: calc(var(--ampm-border-radius) - 1px);
        }
        .time-input:focus-visible { 
          box-shadow: none;
          z-index: 1; 
        }
        .time-picker-container:focus-within {
          border-color: var(--ampm-primary-color);
          outline: 2px solid var(--ampm-primary-color);
          outline-offset: -2px;
        }
        .time-input::placeholder { color: var(--ampm-font-color); opacity: 0.4; font-size: 0.9em; }
        .toggle-btn { 
          background-color: transparent; 
          background-image: var(--ampm-toggle-icon-url);
          background-repeat: no-repeat;
          background-position: center;
          background-size: var(--ampm-toggle-icon-size);
          border: none; 
          border-left: var(--ampm-toggle-border-left); 
          width: 32px;
          padding: 0;
          cursor: pointer; 
          height: 100%; 
          color: inherit;
          opacity: 0.7;
          font-size: 10px; 
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-top-right-radius: calc(var(--ampm-border-radius) - 1px);
          border-bottom-right-radius: calc(var(--ampm-border-radius) - 1px);
          transition: background-color 0.2s;
        }
        .toggle-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .toggle-btn:not(:disabled):hover { background-color: rgba(0, 0, 0, 0.03); }
        .toggle-btn:not(:disabled):active { background-color: rgba(0, 0, 0, 0.06); }
      </style>
      <div class="time-picker-container" part="container">
        <input type="text" id="time-input" class="time-input" part="input" placeholder="${this.useAmPm ? "AM hh:mm" : "HH:mm"}" maxlength="${this.useAmPm ? '8' : '5'}" inputmode="text" autocomplete="off" spellcheck="false">
        <button id="toggle-btn" class="toggle-btn" type="button" part="toggle-btn">▼</button>
      </div>
      <div id="color-resolver" style="visibility: hidden; position: absolute; width: 0; height: 0; border-top-style: solid; outline-style: solid; text-decoration-line: underline; column-rule-style: solid; color: var(--ampm-dropdown-text-color); background-color: var(--ampm-dropdown-bg); border-top-color: var(--ampm-dropdown-border-color); outline-color: var(--ampm-primary-color); caret-color: var(--ampm-dropdown-hover-bg); column-rule-color: var(--ampm-dropdown-header-bg); text-decoration-color: var(--ampm-dropdown-divider-color); fill: var(--ampm-dropdown-scrollbar-thumb);"></div>
    `;
  }

  createBodyDropdown() {
    if (this.dropdown) return;
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'ampm-timepicker-dropdown ampm-hidden';

    Object.assign(this.dropdown.style, {
      position: 'absolute',
      zIndex: '2147483647',
      display: 'flex',
      backgroundColor: 'var(--local-dropdown-bg)',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
      border: '1px solid var(--local-border-color)',
      borderRadius: 'var(--local-border-radius)',
      overflow: 'hidden',
      fontFamily: 'inherit',
      color: 'var(--local-text-color)'
    });

    const ampmHeaderHTML = this.labelAmPm ? `<div class="ampm-header">${this.labelAmPm}</div>` : '';
    const ampmHTML = this.useAmPm ? `
      <div class="ampm-col-wrapper">
        ${ampmHeaderHTML}
        <div class="ampm-column ampm-period-column" style="height:220px; overflow-y:auto; outline:none;" tabindex="0"></div>
      </div>
    ` : '';

    const hourHeaderHTML = this.labelHour ? `<div class="ampm-header">${this.labelHour}</div>` : '';
    const minHeaderHTML = this.labelMin ? `<div class="ampm-header">${this.labelMin}</div>` : '';

    this.dropdown.innerHTML = `
      <style>
        .ampm-timepicker-dropdown .ampm-column::-webkit-scrollbar { width: 4px; }
        .ampm-timepicker-dropdown .ampm-column::-webkit-scrollbar-thumb { background: var(--local-scrollbar-thumb); border-radius: 4px; }
        .ampm-timepicker-dropdown .ampm-column:focus-visible { box-shadow: inset 0 0 0 2px var(--local-primary-color); border-radius: 4px; }
        .ampm-timepicker-dropdown .ampm-col-wrapper { flex:1; display:flex; flex-direction:column; }
        .ampm-timepicker-dropdown .ampm-column { border-right: 1px solid var(--local-divider-color); border-right-color: color-mix(in srgb, var(--local-divider-color) 50%, transparent); }
        .ampm-timepicker-dropdown .ampm-col-wrapper:last-child .ampm-column { border-right: none; }
        .ampm-timepicker-dropdown .ampm-header { padding:6px; font-size:0.7em; text-align:center; background:var(--local-header-bg); color:inherit; opacity:0.5; border-bottom:1px solid var(--local-divider-color); }
        .ampm-timepicker-dropdown .ampm-item { padding: 10px 5px; text-align: center; cursor: pointer; font-size: 1em; transition: 0.2s; user-select: none; color: inherit; }
        .ampm-timepicker-dropdown .ampm-item:hover:not(.ampm-disabled) { background-color: var(--local-hover-bg); }
        .ampm-timepicker-dropdown .ampm-item.ampm-active:not(.ampm-disabled) { background-color: var(--local-hover-bg); color: var(--local-primary-color); font-weight: bold; }
        .ampm-timepicker-dropdown .ampm-item.ampm-disabled { color: var(--local-scrollbar-thumb); cursor: not-allowed; opacity: 0.5; }
        .ampm-timepicker-dropdown.ampm-hidden { display: none !important; }
      </style>
      ${ampmHTML}
      <div class="ampm-col-wrapper">
        ${hourHeaderHTML}
        <div class="ampm-column ampm-hour-column" style="height:220px; overflow-y:auto; outline:none;" tabindex="0"></div>
      </div>
      <div class="ampm-col-wrapper" style="border-right: none;">
        ${minHeaderHTML}
        <div class="ampm-column ampm-minute-column" style="height:220px; overflow-y:auto; outline:none;" tabindex="0"></div>
      </div>
    `;

    document.body.appendChild(this.dropdown);
    this.hourCol = this.dropdown.querySelector('.ampm-hour-column');
    this.minCol = this.dropdown.querySelector('.ampm-minute-column');
    if (this.useAmPm) this.ampmCol = this.dropdown.querySelector('.ampm-period-column');

    this.renderList(this.hours, this.hourCol, 'hour');
    this.renderList(this.minutes, this.minCol, 'minute');
    if (this.useAmPm && this.ampmCol) this.renderList(this.ampms, this.ampmCol, 'ampm');

    // ★ 드롭다운이 생성된 직후에 키보드 네비게이션을 설정합니다.
    this.setupColumnNavigation();

    this.dropdown.addEventListener('scroll', (e) => e.stopPropagation(), { capture: true });
    this.dropdown.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  }

  cacheElements() {
    this.container = this.shadowRoot.querySelector('.time-picker-container');
    this.input = this.shadowRoot.querySelector('.time-input');
    this.toggleBtn = this.shadowRoot.querySelector('.toggle-btn');
  }

  init() {
    this.toggleBtn.onmousedown = (e) => e.preventDefault();
    this.toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.disabled || this.readOnly) return;
      this.dropdown?.classList.contains('ampm-hidden') === false ? (this.hideDropdown(), this.commit()) : (this.input.focus(), this.showDropdown());
    });

    this.input.addEventListener('focus', () => {
      if (this.disabled || this.readOnly) return;
      this.showDropdown()
    });

    // 사용자가 타이핑할 때마다 handleInput을 호출해서 드롭다운 하이라이트 동기화
    this.input.addEventListener('input', (e) => {
      if (this.disabled || this.readOnly) return;
      this.handleInput(e);
    });

    this.input.addEventListener('keydown', (e) => {
      if (this.disabled || this.readOnly) {
        if (e.key === 'Tab') return;
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') { this.hideDropdown(); this.input.blur(); }
      else if (e.key === 'Escape') { this.hideDropdown(); this.commit(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.stepTime(1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); this.stepTime(-1); }

      // 인풋에서 Tab: 드롭다운 내부로 강제 진입
      else if (e.key === 'Tab' && !e.shiftKey) {
        if (this.dropdown && !this.dropdown.classList.contains('ampm-hidden')) {
          e.preventDefault();
          (this.ampmCol || this.hourCol).focus();
        }
      }
    });

    this.input.addEventListener('blur', () => this.commit());

    document.addEventListener('mousedown', this._handleDocumentMouseDown);
  }

  positionDropdown() {
    if (!this.dropdown) return;
    const rect = this.container.getBoundingClientRect();
    const margin = 5;
    const actualHeight = this.dropdown.offsetHeight || 250;
    const hasSpaceBelow = (window.innerHeight - rect.bottom) > (actualHeight + margin);

    const resolver = this.shadowRoot.getElementById('color-resolver');
    const resStyles = getComputedStyle(resolver);

    this.dropdown.style.setProperty('--local-primary-color', resStyles.outlineColor);
    this.dropdown.style.setProperty('--local-hover-bg', resStyles.caretColor);
    this.dropdown.style.setProperty('--local-dropdown-bg', resStyles.backgroundColor);
    this.dropdown.style.setProperty('--local-text-color', resStyles.color);
    this.dropdown.style.setProperty('--local-border-color', resStyles.borderTopColor);
    this.dropdown.style.setProperty('--local-header-bg', resStyles.columnRuleColor);
    this.dropdown.style.setProperty('--local-divider-color', resStyles.textDecorationColor);
    this.dropdown.style.setProperty('--local-scrollbar-thumb', resStyles.fill);
    this.dropdown.style.setProperty('--local-border-radius', getComputedStyle(this.container).borderRadius);

    let top = hasSpaceBelow ? (rect.bottom + window.scrollY + margin) : (rect.top + window.scrollY - actualHeight - margin);
    this.dropdown.style.boxShadow = hasSpaceBelow ? '0px 8px 24px rgba(0, 0, 0, 0.15)' : '0px -8px 24px rgba(0, 0, 0, 0.15)';
    this.dropdown.style.top = `${top}px`;
    this.dropdown.style.left = `${rect.left + window.scrollX}px`;
    this.dropdown.style.minWidth = `${Math.max(180, rect.width)}px`;
  }

  showDropdown() {
    if (this._checkIcon) this._checkIcon(); // 드롭다운 열 때 다시 한 번 검증
    if (!this.dropdown) this.createBodyDropdown();
    this.dropdown.classList.remove('ampm-hidden');
    this.positionDropdown();
    this.syncScrollAndHighlight();
    window.addEventListener('scroll', this._handleGlobalScroll, { capture: true, passive: true });
    window.addEventListener('resize', this._handleGlobalScroll, { passive: true });
  }

  hideDropdown() {
    if (this.dropdown) {
      if (this.dropdown.parentNode) {
        this.dropdown.parentNode.removeChild(this.dropdown);
      }
      this.dropdown = null;
      this.hourCol = null;
      this.minCol = null;
      this.ampmCol = null;
    }
    window.removeEventListener('scroll', this._handleGlobalScroll, { capture: true });
    window.removeEventListener('resize', this._handleGlobalScroll);
  }

  renderList(data, container, type) {
    container.innerHTML = '';
    data.forEach(val => {
      const div = document.createElement('div');
      div.className = 'ampm-item';
      div.textContent = val;
      div.onmousedown = (e) => e.preventDefault();
      div.onclick = (e) => {
        e.stopPropagation();
        if (!div.classList.contains('ampm-disabled')) this.selectValue(val, type, true);
      };
      container.appendChild(div);
    });
  }

  syncScrollAndHighlight() {
    if (!this.dropdown) return;
    let val = this.input.value.trim().toUpperCase();
    if (!val) val = this.formatFromMinutes(this.clampMinutes(Math.ceil(this.startMin / this.interval) * this.interval));

    let total = this.get24hMinutes(val);
    let { timePart, ampmPart } = this.parseInputString(val);
    const [h, m] = timePart.split(':');

    if (h) this.scrollToTarget(h.padStart(2, '0'), 'hour');
    if (m) this.scrollToTarget(m.padStart(2, '0'), 'minute');
    if (this.useAmPm && ampmPart) this.scrollToTarget(ampmPart, 'ampm');

    const currH24 = Math.floor(total / 60);
    if (this.ampmCol) {
      Array.from(this.ampmCol.querySelectorAll('.ampm-item')).forEach(i => {
        const isP = i.textContent === 'PM';
        i.classList.toggle('ampm-disabled', !(this.startMin <= (isP ? 1439 : 719) && this.endMin >= (isP ? 720 : 0)));
      });
    }
    Array.from(this.hourCol.querySelectorAll('.ampm-item')).forEach(i => {
      let th = parseInt(i.textContent);
      if (this.useAmPm) {
        const isP = this.ampmCol?.querySelector('.ampm-active')?.textContent === 'PM';
        th = (th % 12) + (isP ? 12 : 0);
      }
      i.classList.toggle('ampm-disabled', !(this.startMin <= (th * 60 + 59) && this.endMin >= (th * 60)));
    });
    Array.from(this.minCol.querySelectorAll('.ampm-item')).forEach(i => {
      const t = currH24 * 60 + parseInt(i.textContent);
      i.classList.toggle('ampm-disabled', !(t >= this.startMin && t <= this.endMin));
    });
  }

  scrollToTarget(value, type) {
    const col = type === 'hour' ? this.hourCol : (type === 'minute' ? this.minCol : this.ampmCol);
    const target = Array.from(col.querySelectorAll('.ampm-item')).find(i => i.textContent === value);
    Array.from(col.querySelectorAll('.ampm-item')).forEach(i => i.classList.remove('ampm-active'));
    if (target) {
      target.classList.add('ampm-active');
      col.scrollTop = target.offsetTop - col.offsetTop - (col.clientHeight / 2) + (target.clientHeight / 2);
    }
  }

  selectValue(val, type, isClick = false) {
    let { timePart, ampmPart } = this.parseInputString(this.input.value.trim().toUpperCase());
    let [h, m] = timePart.split(':');
    h = h || (this.useAmPm ? '12' : '00'); m = m || '00';
    if (type === 'hour') h = val; else if (type === 'minute') m = val; else if (type === 'ampm') ampmPart = val;
    this.input.value = this.formatFromMinutes(this.clampMinutes(this.get24hMinutes(this.useAmPm ? `${ampmPart} ${h}:${m}` : `${h}:${m}`)));
    this.syncScrollAndHighlight();
    if (isClick && type === 'minute') { this.hideDropdown(); this.commit(); this.input.focus(); }
  }

  setupColumnNavigation() {
    const cols = [];
    if (this.useAmPm) cols.push({ el: this.ampmCol, type: 'ampm' });
    cols.push({ el: this.hourCol, type: 'hour' }, { el: this.minCol, type: 'minute' });

    cols.forEach((c, idx) => {
      if (!c.el) return;
      c.el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); this.navigateColumn(c.el, c.type, -1); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); this.navigateColumn(c.el, c.type, 1); }
        else if (e.key === 'ArrowLeft' && idx > 0) { e.preventDefault(); cols[idx - 1].el.focus(); }
        else if (e.key === 'ArrowRight' && idx < cols.length - 1) { e.preventDefault(); cols[idx + 1].el.focus(); }

        // ★ Tab 키 제어: 주소창으로 날아가는 현상 방지
        else if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab (역행)
            if (idx === 0) { // 첫 번째 컬럼에서 역행하면 인풋으로 복귀
              e.preventDefault();
              this.input.focus();
            } else { // 이전 컬럼으로
              e.preventDefault();
              cols[idx - 1].el.focus();
            }
          } else { // Tab (순행)
            if (idx === cols.length - 1) { // 마지막 컬럼에서 탈출 시
              e.preventDefault();
              this.hideDropdown();
              this.commit();

              // ★ 핵심: 현재 컴포넌트(this) 다음의 실제 포커스 가능한 요소를 찾아 이동
              this.focusNextElement();
            } else { // 다음 컬럼으로
              e.preventDefault();
              cols[idx + 1].el.focus();
            }
          }
        }
        else if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          this.hideDropdown();
          this.commit();
          this.input.focus();
        }
      });
    });
  }

  focusNextElement() {
    // 1. 문서 내의 모든 요소(*)를 문서 순서대로 가져옵니다.
    const allElements = Array.from(document.querySelectorAll('*'));
    let nextEl = null;

    // 포커스 가능한 요소의 조건 (비활성화된 요소 제외)
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    for (const el of allElements) {
      // 드롭다운(body에 붙어있음) 내부 요소는 무시합니다.
      if (this.dropdown && this.dropdown.contains(el)) continue;

      // 2. 현재 컴포넌트(this)보다 문서상 뒤(FOLLOWING)에 위치한 요소인지 확인
      if (this.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {

        // 3-1. 일반적인 포커스 가능 요소인지 확인 (Light DOM)
        if (el.matches(focusableSelector)) {
          nextEl = el;
          break;
        }

        // 3-2. 만약 다른 time-picker 등 Shadow DOM을 가진 커스텀 엘리먼트라면
        if (el.shadowRoot) {
          // 그 안(Shadow DOM)에 포커스 가능한 요소가 숨어있는지 탐색
          const innerFocusable = el.shadowRoot.querySelector(focusableSelector);
          if (innerFocusable) {
            nextEl = innerFocusable;
            break; // 찾았으면 반복문 종료
          }
        }
      }
    }

    // 4. 찾은 요소로 포커스 깔끔하게 이동!
    if (nextEl) {
      nextEl.focus();
    }
  }

  navigateColumn(col, type, dir) {
    const items = Array.from(col.querySelectorAll('.ampm-item:not(.ampm-disabled)'));
    const currentActive = col.querySelector('.ampm-item.ampm-active');
    let nextIndex = (items.indexOf(currentActive) + dir + items.length) % items.length;
    this.selectValue(items[nextIndex].textContent, type, false);
  }

  stepTime(dir) {
    this.input.value = this.formatFromMinutes(this.clampMinutes((this.get24hMinutes(this.input.value) + dir * this.interval + 1440) % 1440));
    this.syncScrollAndHighlight();
  }

  parseInputString(v) {
    let t = v || "", a = 'AM';
    if (this.useAmPm) {
      let p = v.trim().split(' ');
      if (p[0] === 'AM' || p[0] === 'PM') { a = p[0]; t = p[1] || ''; }
      else if (p[1] === 'AM' || p[1] === 'PM') { a = p[1]; t = p[0] || ''; }
      else { t = p[0] || ''; if (v.toUpperCase().includes('P')) a = 'PM'; }
    }
    return { timePart: t, ampmPart: a };
  }

  handleInput(e) {
    let v = e.target.value.toUpperCase(), n = v.replace(/[^0-9]/g, ''), a = this.useAmPm ? (v.includes('P') ? 'PM ' : 'AM ') : '', t = "";
    if (n.length > 0) {
      let h = n.substring(0, 2); if (parseInt(h) > 23) h = "23";
      if (this.useAmPm && h.length === 2) {
        let hi = parseInt(h);
        if (hi > 12) { h = (hi - 12).toString().padStart(2, '0'); a = 'PM '; }
        else if (hi === 0) { h = "12"; a = 'AM '; }
      }
      t = n.length >= 3 ? h + ":" + n.substring(2, 4) : h;
    }
    this.input.value = (a + t).trim();
    this.syncScrollAndHighlight();
  }

  commit() {
    let v = this.input.value.trim().toUpperCase();
    if (v) {
      let t = this.get24hMinutes(v);
      this.input.value = this.formatFromMinutes(this.clampMinutes(Math.floor(t / 60) * 60 + Math.floor((t % 60) / this.interval) * this.interval));
      this.syncScrollAndHighlight();
    }
    this.dispatchIfChanged();
  }

  dispatchIfChanged() {
    if (this.value !== this._lastDispatchedValue) {
      this._lastDispatchedValue = this.value;
      this._internals.setFormValue(this.value);
      this.updateValidity();
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true }));
    }
  }

  get value() {
    if (!this.input) return this.getAttribute('value') || '';
    let v = this.input.value.trim().toUpperCase(); if (!v) return '';
    let { timePart, ampmPart } = this.parseInputString(v);
    let p = timePart.split(':'), h = parseInt(p[0] || 0), m = parseInt(p[1] || 0);
    if (this.useAmPm) { if (ampmPart === 'PM' && h < 12) h += 12; else if (ampmPart === 'AM' && h === 12) h = 0; }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  set value(val) {
    if (!this.input) return;
    if (!val) {
      this.input.value = '';
      this._lastDispatchedValue = '';
      this._internals.setFormValue('');
      this.updateValidity();
      return;
    }
    this.input.value = this.formatFromMinutes(this.clampMinutes(this.get24hMinutes(val)));
    this.syncScrollAndHighlight();
    this._lastDispatchedValue = this.value;
    this._internals.setFormValue(this.value);
    this.updateValidity();
  }
}

customElements.define('time-picker', AmPmTimePicker);
