/* @ds-bundle: {"format":4,"namespace":"MePreparoDesignSystem_20851d","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Mascot","sourcePath":"components/brand/Mascot.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"AnswerOption","sourcePath":"components/practice/AnswerOption.jsx"},{"name":"ExerciseCard","sourcePath":"components/practice/ExerciseCard.jsx"},{"name":"FeedbackBanner","sourcePath":"components/practice/FeedbackBanner.jsx"},{"name":"HintBox","sourcePath":"components/practice/HintBox.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"2d86685635e5","components/brand/Mascot.jsx":"a0b4479133f6","components/core/Badge.jsx":"e05a638763e5","components/core/Button.jsx":"aa4c045b4785","components/core/Card.jsx":"ff2f387a7d66","components/core/Icon.jsx":"23ceb9623b6e","components/core/IconButton.jsx":"da2e2be4b97e","components/core/Tag.jsx":"7702b56b57cb","components/feedback/Dialog.jsx":"e277fc12b153","components/feedback/ProgressBar.jsx":"8f22051d7a74","components/feedback/Toast.jsx":"4aaa15faf35d","components/feedback/Tooltip.jsx":"b9a4c582ce83","components/forms/Checkbox.jsx":"7704db48337a","components/forms/Input.jsx":"85b0f4e9fc0f","components/forms/Radio.jsx":"216c06d16ad4","components/forms/Select.jsx":"71f0adcae33f","components/forms/Switch.jsx":"bf9181ecdd51","components/navigation/BottomNav.jsx":"43e0d899ef70","components/navigation/Tabs.jsx":"10eeb1ab262d","components/practice/AnswerOption.jsx":"85378db4c72d","components/practice/ExerciseCard.jsx":"82e1feb28e65","components/practice/FeedbackBanner.jsx":"53847aa69430","components/practice/HintBox.jsx":"df80b4f5bfe9","ui_kits/app/Exercise.jsx":"1418f18bc771","ui_kits/app/Home.jsx":"d5906ae0086d","ui_kits/app/Summary.jsx":"d4d27242d8c9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MePreparoDesignSystem_20851d = window.MePreparoDesignSystem_20851d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function Logo({
  variant = 'lockup',
  height = 40,
  assetBase = 'assets/',
  style
}) {
  const src = {
    lockup: 'logo/mepreparo-lockup.png',
    icon: 'logo/mepreparo-icon.png',
    wordmark: 'logo/mepreparo-wordmark.png'
  }[variant];
  return /*#__PURE__*/React.createElement("img", {
    src: assetBase + src,
    alt: "MePreparo",
    style: {
      height,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Mascot.jsx
try { (() => {
const POSES = {
  saludo: 'equis-saludo',
  pensando: 'equis-pensando',
  senalando: 'equis-senalando',
  aja: 'equis-aja',
  explicando: 'equis-explicando',
  celebrando: 'equis-celebrando',
  estudiando: 'equis-estudiando',
  descansando: 'equis-descansando',
  frontal: 'equis-frontal',
  'tres-cuartos': 'equis-3-4',
  perfil: 'equis-perfil',
  curioso: 'expr-curioso',
  'aja-cara': 'expr-aja',
  tranquilo: 'expr-tranquilo',
  apoyo: 'expr-apoyo',
  mini: 'equis-32'
};
function Mascot({
  pose = 'saludo',
  size = 120,
  assetBase = 'assets/',
  alt,
  style
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: assetBase + 'mascot/' + (POSES[pose] || POSES.saludo) + '.png',
    alt: alt || 'Equis',
    style: {
      height: size,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Mascot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Mascot.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  sky: ['var(--mp-sky-100)', 'var(--mp-sky-700)', 'var(--mp-sky-200)'],
  ink: ['var(--mp-ink)', 'var(--mp-white)', 'var(--mp-ink)'],
  coral: ['var(--mp-coral-50)', 'var(--mp-coral-600)', 'var(--mp-coral-100)'],
  green: ['var(--success-soft)', 'var(--success-text)', 'var(--mp-green-100)'],
  neutral: ['var(--surface-sunken)', 'var(--text-muted)', 'var(--border-default)']
};
function Badge({
  tone = 'sky',
  children,
  style
}) {
  const [bg, fg, bd] = T[tone] || T.sky;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 26,
      padding: '0 10px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      border: '1px solid ' + bd,
      font: 'var(--fw-semibold) 13px/1 var(--font-sans)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  padding = 24,
  elevated = true,
  tone = 'white',
  children,
  style,
  onClick
}) {
  const bg = {
    white: 'var(--surface-card)',
    paper: 'var(--surface-page)',
    sky: 'var(--mp-sky-50)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: bg,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      boxShadow: elevated ? 'var(--shadow-card)' : 'none',
      padding,
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const CDN = 'https://unpkg.com/lucide-static@0.460.0/icons/';
const cache = {};
function load(name) {
  if (!cache[name]) cache[name] = fetch(CDN + name + '.svg').then(r => r.ok ? r.text() : '').then(t => t.replace(/<!--[\s\S]*?-->/g, '').replace(/width="24"/, 'width="100%"').replace(/height="24"/, 'height="100%"')).catch(() => '');
  return cache[name];
}
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  label,
  style
}) {
  const [svg, setSvg] = React.useState(() => typeof cache[name] === 'string' ? cache[name] : '');
  React.useEffect(() => {
    let on = true;
    load(name).then(t => {
      if (on) setSvg(t);
    });
    return () => {
      on = false;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("span", {
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    dangerouslySetInnerHTML: {
      __html: svg
    },
    style: {
      display: 'inline-flex',
      flex: 'none',
      width: size,
      height: size,
      color,
      lineHeight: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 36,
    px: 16,
    fs: 15,
    ic: 16
  },
  md: {
    h: 44,
    px: 22,
    fs: 16,
    ic: 18
  },
  lg: {
    h: 56,
    px: 32,
    fs: 18,
    ic: 20
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  style
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const V = {
    primary: {
      bg: h ? 'var(--interactive-hover)' : 'var(--interactive)',
      fg: 'var(--text-on-interactive)',
      bd: 'transparent'
    },
    secondary: {
      bg: h ? 'var(--surface-hover)' : 'var(--surface-card)',
      fg: 'var(--text-body)',
      bd: 'var(--border-ink)'
    },
    ghost: {
      bg: h ? 'var(--surface-hover)' : 'transparent',
      fg: 'var(--text-body)',
      bd: 'transparent'
    },
    dark: {
      bg: h ? 'var(--mp-ink-700)' : 'var(--mp-ink)',
      fg: 'var(--mp-white)',
      bd: 'transparent'
    }
  }[variant] || {};
  const dis = disabled ? {
    bg: 'var(--disabled-bg)',
    fg: 'var(--disabled-fg)',
    bd: 'transparent'
  } : null;
  const c = dis || V;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: 'var(--radius-pill)',
      border: 'var(--stroke) solid ' + c.bd,
      background: c.bg,
      color: c.fg,
      font: 'var(--fw-semibold) ' + s.fs + 'px/1 var(--font-sans)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: p && !disabled ? 'scale(.97)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.ic
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 44,
  active = false,
  disabled = false,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  const V = {
    ghost: {
      bg: h || active ? 'var(--surface-hover)' : 'transparent',
      fg: active ? 'var(--interactive-press)' : 'var(--text-body)',
      bd: 'transparent'
    },
    outline: {
      bg: h ? 'var(--surface-hover)' : 'var(--surface-card)',
      fg: 'var(--text-body)',
      bd: 'var(--border-strong)'
    },
    solid: {
      bg: h ? 'var(--interactive-hover)' : 'var(--interactive)',
      fg: 'var(--mp-white)',
      bd: 'transparent'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill)',
      border: 'var(--stroke) solid ' + V.bd,
      background: V.bg,
      color: disabled ? 'var(--disabled-fg)' : V.fg,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out)',
      padding: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.46)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  selected = false,
  onClick,
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-pressed": selected,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 36,
      padding: '0 16px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      background: selected ? 'var(--surface-selected)' : h ? 'var(--surface-hover)' : 'var(--surface-card)',
      border: '1.5px solid ' + (selected ? 'var(--interactive)' : 'var(--border-strong)'),
      color: selected ? 'var(--mp-sky-700)' : 'var(--text-body)',
      font: 'var(--fw-medium) 15px/1 var(--font-sans)',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  children,
  actions,
  illustration,
  onClose,
  inline = false,
  style
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 420,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-raised)',
      padding: '32px 28px 24px',
      textAlign: 'center',
      animation: 'mp-fade-up var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Cerrar",
    size: 40,
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 12,
      right: 12
    }
  }), illustration && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 12
    }
  }, illustration), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      font: 'var(--type-h3)',
      color: 'var(--text-body)',
      textWrap: 'balance'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      textWrap: 'pretty'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 24
    }
  }, actions));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-scrim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 100
    },
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  tone = 'sky',
  label,
  showValue = false,
  height = 8,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const c = tone === 'green' ? 'var(--mp-green)' : 'var(--interactive)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--fw-medium) 13px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", null, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      height,
      borderRadius: 999,
      background: 'var(--mp-graphite-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 999,
      background: c,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'neutral',
  icon,
  children,
  action,
  style
}) {
  const ic = icon || {
    neutral: 'info',
    success: 'check',
    aja: 'sparkles'
  }[tone];
  const c = {
    neutral: 'var(--mp-sky)',
    success: 'var(--mp-green)',
    aja: 'var(--mp-coral)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 48,
      padding: '10px 12px 10px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--mp-ink)',
      color: 'var(--mp-white)',
      boxShadow: 'var(--shadow-raised)',
      font: 'var(--fw-medium) 15px/1.35 var(--font-sans)',
      animation: 'mp-fade-up var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), action);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  placement = 'top',
  tone = 'ink',
  forceOpen = false
}) {
  const [o, setO] = React.useState(false);
  const open = forceOpen || o;
  const ink = tone === 'ink';
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setO(true),
    onMouseLeave: () => setO(false),
    onFocus: () => setO(true),
    onBlur: () => setO(false)
  }, children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      whiteSpace: 'nowrap',
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      background: ink ? 'var(--mp-ink)' : 'var(--mp-sky-100)',
      color: ink ? 'var(--mp-white)' : 'var(--mp-ink)',
      font: 'var(--fw-medium) 13px/1.2 var(--font-sans)',
      boxShadow: 'var(--shadow-card)',
      zIndex: 50,
      pointerEvents: 'none'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked ?? c;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      font: 'var(--fw-regular) 16px/1.3 var(--font-sans)',
      color: 'var(--text-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: on,
    disabled: disabled,
    onChange: e => {
      setC(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: 'var(--radius-xs)',
      border: 'var(--stroke) solid ' + (on ? 'var(--interactive)' : 'var(--mp-ink)'),
      background: on ? 'var(--interactive)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16,
    color: "var(--mp-white)"
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  hint,
  error,
  value,
  defaultValue,
  placeholder,
  onChange,
  type = 'text',
  disabled = false,
  math = false,
  style
}) {
  const [f, setF] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) 15px/1.3 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      height: 48,
      padding: '0 16px',
      borderRadius: 'var(--radius-md)',
      border: 'var(--stroke) solid ' + (error ? 'var(--mp-coral)' : f ? 'var(--border-focus)' : 'var(--border-strong)'),
      boxShadow: f ? 'var(--focus-ring)' : 'none',
      outline: 'none',
      background: disabled ? 'var(--disabled-bg)' : 'var(--surface-card)',
      color: 'var(--text-body)',
      font: math ? 'italic 20px/1 var(--font-math)' : 'var(--fw-regular) 17px/1 var(--font-sans)',
      transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
    }
  }), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-regular) 13px/1.4 var(--font-sans)',
      color: error ? 'var(--mp-coral-600)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked ?? c;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      font: 'var(--fw-regular) 16px/1.3 var(--font-sans)',
      color: 'var(--text-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    checked: on,
    disabled: disabled,
    onChange: e => {
      setC(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: '50%',
      border: 'var(--stroke) solid ' + (on ? 'var(--interactive)' : 'var(--mp-ink)'),
      background: on ? 'var(--surface-card)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, on && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--interactive)'
    }
  })), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) 15px/1.3 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 48,
      padding: '0 44px 0 16px',
      borderRadius: 'var(--radius-md)',
      border: 'var(--stroke) solid var(--border-strong)',
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      font: 'var(--fw-regular) 17px/1 var(--font-sans)',
      cursor: 'pointer'
    }
  }, options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--text-muted)",
    style: {
      position: 'absolute',
      right: 14,
      top: 14,
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked ?? c;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      cursor: 'pointer',
      font: 'var(--fw-regular) 16px/1.3 var(--font-sans)',
      color: 'var(--text-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": on,
    onClick: () => {
      setC(!on);
      onChange && onChange(!on);
    },
    style: {
      width: 46,
      height: 28,
      flex: 'none',
      borderRadius: 999,
      border: 'none',
      padding: 3,
      background: on ? 'var(--interactive)' : 'var(--mp-graphite-200)',
      cursor: 'pointer',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'var(--mp-white)',
      boxShadow: 'var(--shadow-xs)',
      transform: on ? 'translateX(18px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
function BottomNav({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 8px 12px',
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-default)',
      ...style
    }
  }, items.map(it => {
    const on = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      onClick: () => onChange && onChange(it.value),
      style: {
        flex: 1,
        minHeight: 52,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: on ? 'var(--interactive-press)' : 'var(--text-muted)',
        font: (on ? 'var(--fw-semibold)' : 'var(--fw-medium)') + ' 12px/1 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 48,
        height: 30,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: on ? 'var(--surface-selected)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 22
    })), it.label);
  }));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const [v, setV] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const cur = value ?? v;
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      borderRadius: 999,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-default)',
      ...style
    }
  }, tabs.map(t => {
    const val = t.value ?? t,
      lab = t.label ?? t,
      on = val === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setV(val);
        onChange && onChange(val);
      },
      style: {
        height: 36,
        padding: '0 18px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        background: on ? 'var(--surface-card)' : 'transparent',
        boxShadow: on ? 'var(--shadow-xs)' : 'none',
        color: on ? 'var(--text-body)' : 'var(--text-muted)',
        font: (on ? 'var(--fw-semibold)' : 'var(--fw-medium)') + ' 15px/1 var(--font-sans)',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, lab);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/practice/AnswerOption.jsx
try { (() => {
function AnswerOption({
  letter,
  children,
  state = 'idle',
  onClick,
  disabled = false,
  style
}) {
  const [h, setH] = React.useState(false);
  const S = {
    idle: {
      bg: h ? 'var(--surface-hover)' : 'transparent',
      cb: 'var(--surface-card)',
      cf: 'var(--mp-ink)',
      cbd: 'var(--border-strong)'
    },
    selected: {
      bg: 'var(--surface-selected)',
      cb: 'var(--interactive)',
      cf: 'var(--mp-white)',
      cbd: 'var(--interactive)'
    },
    correct: {
      bg: 'var(--success-soft)',
      cb: 'var(--success)',
      cf: 'var(--mp-white)',
      cbd: 'var(--success)'
    },
    incorrect: {
      bg: 'var(--retry-soft)',
      cb: 'var(--mp-graphite)',
      cf: 'var(--mp-white)',
      cbd: 'var(--mp-graphite)'
    },
    dimmed: {
      bg: 'transparent',
      cb: 'var(--surface-card)',
      cf: 'var(--text-subtle)',
      cbd: 'var(--border-default)'
    }
  }[state];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    "aria-pressed": state === 'selected',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      width: '100%',
      minHeight: 56,
      padding: '8px 14px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: S.bg,
      cursor: disabled ? 'default' : 'pointer',
      textAlign: 'left',
      transition: 'background var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flex: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: S.cb,
      color: S.cf,
      border: '1.5px solid ' + S.cbd,
      font: 'var(--fw-semibold) 16px/1 var(--font-sans)'
    }
  }, state === 'correct' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 18
  }) : letter), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: '400 21px/1.3 var(--font-math)',
      color: state === 'dimmed' ? 'var(--text-subtle)' : 'var(--text-body)'
    }
  }, children));
}
Object.assign(__ds_scope, { AnswerOption });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/practice/AnswerOption.jsx", error: String((e && e.message) || e) }); }

// components/practice/ExerciseCard.jsx
try { (() => {
function ExerciseCard({
  axis = 'M1',
  topic,
  question,
  children,
  footer,
  saved = false,
  onToggleSave,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    padding: 28,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, null, axis), topic && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) 13px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, topic), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: saved ? 'bookmark-check' : 'bookmark',
    label: saved ? 'Guardado' : 'Guardar',
    active: saved,
    onClick: onToggleSave,
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-medium) 21px/1.45 var(--font-sans)',
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, question), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, children), footer);
}
Object.assign(__ds_scope, { ExerciseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/practice/ExerciseCard.jsx", error: String((e && e.message) || e) }); }

// components/practice/FeedbackBanner.jsx
try { (() => {
const T = {
  correct: ['var(--success-soft)', 'var(--success)', 'check', 'var(--success-text)'],
  retry: ['var(--retry-soft)', 'var(--mp-graphite)', 'rotate-ccw', 'var(--mp-ink)'],
  aja: ['var(--accent-soft)', 'var(--mp-coral)', 'sparkles', 'var(--mp-ink)']
};
function FeedbackBanner({
  tone = 'correct',
  title,
  children,
  sparkle,
  style
}) {
  const [bg, c, ic, tc] = T[tone];
  const sp = sparkle ?? tone !== 'retry';
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 18px',
      borderRadius: 'var(--radius-md)',
      background: bg,
      animation: 'mp-fade-up var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flex: 'none',
      borderRadius: '50%',
      background: c,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'mp-pop var(--dur-slow) var(--ease-pop)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 18,
    color: "var(--mp-white)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) 17px/1.3 var(--font-sans)',
      color: tc
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-regular) 15px/1.45 var(--font-sans)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, children)), sp && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkle",
    size: 22,
    color: tone === 'correct' ? 'var(--success)' : 'var(--mp-coral)'
  }));
}
Object.assign(__ds_scope, { FeedbackBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/practice/FeedbackBanner.jsx", error: String((e && e.message) || e) }); }

// components/practice/HintBox.jsx
try { (() => {
function HintBox({
  title = 'Pista',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      paddingTop: 16,
      borderTop: '1px solid var(--border-default)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lightbulb",
    size: 22,
    color: "var(--mp-ink)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) 15px/1.3 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-regular) 15px/1.5 var(--font-sans)',
      color: 'var(--text-muted)',
      marginTop: 2,
      textWrap: 'pretty'
    }
  }, children)));
}
Object.assign(__ds_scope, { HintBox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/practice/HintBox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Exercise.jsx
try { (() => {
const {
  ExerciseCard: EXCard,
  AnswerOption: EXOpt,
  HintBox: EXHint,
  FeedbackBanner: EXFb,
  Button: EXBtn,
  IconButton: EXIcon,
  ProgressBar: EXProg,
  Mascot: EXMascot
} = window.MePreparoDesignSystem_20851d;
const Q = [{
  q: /*#__PURE__*/React.createElement(React.Fragment, null, "La funci\xF3n ", /*#__PURE__*/React.createElement("span", {
    className: "mp-math"
  }, "f(x) = x\xB2 \u2212 4x + 3"), ", \xBFcu\xE1l es su v\xE9rtice?"),
  o: ['(1, 2)', '(2, −1)', '(2, 3)', '(4, −1)'],
  a: 1,
  h: /*#__PURE__*/React.createElement(React.Fragment, null, "El v\xE9rtice se encuentra en ", /*#__PURE__*/React.createElement("span", {
    className: "mp-math"
  }, "x = \u2212b / 2a"), "."),
  t: 'Funciones cuadráticas'
}, {
  q: /*#__PURE__*/React.createElement(React.Fragment, null, "Si ", /*#__PURE__*/React.createElement("span", {
    className: "mp-math"
  }, "3x \u2212 5 = 10"), ", \xBFcu\xE1nto vale ", /*#__PURE__*/React.createElement("span", {
    className: "mp-math"
  }, "x"), "?"),
  o: ['3', '5', '15', '−5'],
  a: 1,
  h: /*#__PURE__*/React.createElement(React.Fragment, null, "Suma 5 a ambos lados y luego divide por 3."),
  t: 'Ecuaciones lineales'
}];
function ExerciseScreen({
  onExit,
  onFinish
}) {
  const [i, setI] = React.useState(0);
  const [sel, setSel] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [hint, setHint] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const q = Q[i];
  const ok = sel === q.a;
  const st = k => !checked ? sel === k ? 'selected' : 'idle' : k === q.a && ok ? 'correct' : k === sel ? 'incorrect' : 'dimmed';
  const next = () => {
    if (i + 1 < Q.length) {
      setI(i + 1);
      setSel(null);
      setChecked(false);
      setHint(false);
      setSaved(false);
    } else onFinish();
  };
  const retry = () => {
    setChecked(false);
    setSel(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(EXIcon, {
    icon: "x",
    label: "Salir",
    onClick: onExit
  }), /*#__PURE__*/React.createElement(EXProg, {
    value: 3 + i,
    max: 10,
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, 3 + i, "/10")), /*#__PURE__*/React.createElement(EXCard, {
    axis: "M1",
    topic: q.t,
    question: q.q,
    saved: saved,
    onToggleSave: () => setSaved(!saved),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, hint && /*#__PURE__*/React.createElement(EXHint, null, q.h), checked && (ok ? /*#__PURE__*/React.createElement(EXFb, {
      tone: "correct",
      title: "\xA1Correcto!"
    }, "Encontraste el v\xE9rtice sin atajos.") : /*#__PURE__*/React.createElement(EXFb, {
      tone: "retry",
      title: "Casi. Revisa el signo."
    }, "Vuelve a intentarlo, vas bien.")))
  }, q.o.map((t, k) => /*#__PURE__*/React.createElement(EXOpt, {
    key: k,
    letter: 'ABCD'[k],
    state: st(k),
    disabled: checked,
    onClick: () => setSel(k)
  }, t))), !checked && !hint && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(EXMascot, {
    pose: "pensando",
    size: 64,
    assetBase: "../../assets/"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 20px/1.15 var(--font-hand)',
      transform: 'rotate(-3deg)'
    }
  }, "\xBFTe doy una pista?")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, !checked && /*#__PURE__*/React.createElement(EXBtn, {
    variant: "secondary",
    size: "lg",
    iconLeft: "lightbulb",
    onClick: () => setHint(true),
    disabled: hint
  }, "Pista"), !checked && /*#__PURE__*/React.createElement(EXBtn, {
    size: "lg",
    fullWidth: true,
    disabled: sel === null,
    onClick: () => setChecked(true)
  }, "Revisar"), checked && !ok && /*#__PURE__*/React.createElement(EXBtn, {
    size: "lg",
    fullWidth: true,
    variant: "secondary",
    onClick: retry
  }, "Intentar de nuevo"), checked && ok && /*#__PURE__*/React.createElement(EXBtn, {
    size: "lg",
    fullWidth: true,
    iconRight: "arrow-right",
    onClick: next
  }, "Siguiente")));
}
window.ExerciseScreen = ExerciseScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Exercise.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Home.jsx
try { (() => {
const {
  Card: HCard,
  Badge: HBadge,
  Button: HButton,
  ProgressBar: HProgress,
  Mascot: HMascot,
  Logo: HLogo,
  IconButton: HIconBtn,
  Icon: HIcon
} = window.MePreparoDesignSystem_20851d;
const A = '../../assets/';
function HomeScreen({
  onStart
}) {
  const topics = [['balanza', 'Ecuaciones', 'Álgebra · M1', 64], ['funcion', 'Funciones', 'Funciones · M1', 38], ['triangulo', 'Triángulos', 'Geometría · M1', 12]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(HLogo, {
    variant: "icon",
    height: 36,
    assetBase: A
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: '600 14px/1 var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(HIcon, {
    name: "flame",
    size: 18,
    color: "var(--mp-coral)"
  }), "4 d\xEDas")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2)',
      letterSpacing: 'var(--ls-heading)'
    }
  }, "Hola, Cata."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-small)',
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, "Hoy toca funciones. Diez ejercicios, a tu ritmo.")), /*#__PURE__*/React.createElement(HMascot, {
    pose: "saludo",
    size: 96,
    assetBase: A
  })), /*#__PURE__*/React.createElement(HCard, {
    padding: 20,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(HBadge, null, "M1"), /*#__PURE__*/React.createElement(HBadge, {
    tone: "neutral"
  }, "Sesi\xF3n de hoy")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)'
    }
  }, "Funciones cuadr\xE1ticas"), /*#__PURE__*/React.createElement(HProgress, {
    value: 3,
    max: 10,
    label: "3 de 10 ejercicios"
  }), /*#__PURE__*/React.createElement(HButton, {
    size: "lg",
    fullWidth: true,
    iconRight: "arrow-right",
    onClick: onStart
  }, "Continuar")), /*#__PURE__*/React.createElement("div", {
    className: "mp-overline"
  }, "Tus temas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, topics.map(([ic, t, s, v]) => /*#__PURE__*/React.createElement(HCard, {
    key: t,
    padding: 14,
    onClick: onStart,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'icons/' + ic + '-tile.png',
    style: {
      width: 52,
      height: 44,
      objectFit: 'cover',
      borderRadius: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 16px/1.2 var(--font-sans)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.3 var(--font-sans)',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, s), /*#__PURE__*/React.createElement(HProgress, {
    value: v,
    height: 6,
    tone: v > 60 ? 'green' : 'sky'
  })), /*#__PURE__*/React.createElement(HIcon, {
    name: "chevron-right",
    size: 20,
    color: "var(--text-muted)"
  })))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Summary.jsx
try { (() => {
const {
  Dialog: SDialog,
  Button: SButton,
  Mascot: SMascot
} = window.MePreparoDesignSystem_20851d;
function SummaryScreen({
  onHome,
  onAgain
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(SDialog, {
    inline: true,
    title: "\xA1Terminaste la sesi\xF3n!",
    illustration: /*#__PURE__*/React.createElement(SMascot, {
      pose: "celebrando",
      size: 150,
      assetBase: "../../assets/"
    }),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SButton, {
      size: "lg",
      fullWidth: true,
      onClick: onAgain
    }, "Seguir practicando"), /*#__PURE__*/React.createElement(SButton, {
      size: "lg",
      fullWidth: true,
      variant: "ghost",
      onClick: onHome
    }, "Volver al inicio"))
  }, "Resolviste 8 de 10. Lo que te cost\xF3 queda guardado para repasar ma\xF1ana.", /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 22px/1.1 var(--font-hand)',
      color: 'var(--mp-ink)',
      marginTop: 16,
      transform: 'rotate(-3deg)'
    }
  }, "T\xFA puedes. Vamos paso a paso.")));
}
function ProgressScreen() {
  const {
    Card: PC,
    Tabs: PT,
    ProgressBar: PB,
    Badge: PBd,
    Mascot: PM
  } = window.MePreparoDesignSystem_20851d;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2)'
    }
  }, "Tu progreso"), /*#__PURE__*/React.createElement(PT, {
    tabs: ['Semana', 'Mes', 'Todo']
  }), /*#__PURE__*/React.createElement(PC, {
    padding: 20,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 36px/1 var(--font-sans)'
    }
  }, "46"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-small)',
      color: 'var(--text-muted)'
    }
  }, "ejercicios esta semana")), /*#__PURE__*/React.createElement(PM, {
    pose: "estudiando",
    size: 90,
    assetBase: "../../assets/"
  })), /*#__PURE__*/React.createElement(PC, {
    padding: 20,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, [['Álgebra', 72], ['Funciones', 48], ['Geometría', 21], ['Probabilidad', 9]].map(([t, v]) => /*#__PURE__*/React.createElement(PB, {
    key: t,
    label: t,
    value: v,
    showValue: true,
    tone: v > 60 ? 'green' : 'sky'
  }))));
}
window.SummaryScreen = SummaryScreen;
window.ProgressScreen = ProgressScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Summary.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Mascot = __ds_scope.Mascot;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.AnswerOption = __ds_scope.AnswerOption;

__ds_ns.ExerciseCard = __ds_scope.ExerciseCard;

__ds_ns.FeedbackBanner = __ds_scope.FeedbackBanner;

__ds_ns.HintBox = __ds_scope.HintBox;

})();
