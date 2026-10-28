/* Ilustraciones de alimentos (SVG 64×64, estilo plano) y armado de platos. */
(function () {
  const V = (window.VASCO = window.VASCO || {});

  const shine = (cx, cy, rx, ry, rot = 0, o = 0.38) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="#fff" opacity="${o}"/>`;
  const leaf = (x, y, rot, s = 1, c = '#5DAE4B') =>
    `<path d="M0 0c4-5 11-5 14 0-3 5-10 5-14 0z" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${c}"/>`;
  const line = (d, c, w = 2.4, extra = '') =>
    `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  /* Cuenco con granos o menestras: mound = color del montón, dot = granito */
  const DOTS = [
    [19, 33], [24, 30], [29, 28], [34, 27.5], [39, 28.5], [44, 31], [48, 34],
    [16, 35], [22, 35], [27, 32], [32, 31], [37, 31.5], [42, 34], [30, 35],
    [35, 35], [25, 35.5], [40, 35.5], [33, 23.5], [28, 24.5], [38, 24.5], [24, 27], [43, 27.5], [33, 21.5],
  ];
  function bowl(o) {
    const r = o.r || 1.6;
    const wood = o.wood || '#C9884F';
    const inside = o.inside || '#8E5A30';
    const dots = (o.dot ? DOTS : [])
      .map(([x, y], i) => {
        const rot = (i * 53) % 180;
        if (o.shape === 'oval')
          return `<ellipse cx="${x}" cy="${y}" rx="${r * 1.5}" ry="${r}" transform="rotate(${rot} ${x} ${y})" fill="${o.dot}"/>`;
        if (o.shape === 'chunk')
          return `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 1.6}" rx="${r * 0.4}" transform="rotate(${rot} ${x} ${y})" fill="${o.dot}"/>`;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.dot}"/>`;
      })
      .join('');
    return (
      `<ellipse cx="32" cy="35" rx="23" ry="5" fill="${inside}"/>` +
      `<path d="M11 36c1-19 41-19 42 0z" fill="${o.mound}"/>` +
      dots +
      `<path d="M9 35c0 12 10 21 23 21s23-9 23-21c-4 3-12 5.4-23 5.4S13 38 9 35z" fill="${wood}"/>` +
      line('M15 43c2.6 5.4 7 8.6 12 9.6', '#fff', 2.4, 'opacity=".3"')
    );
  }

  /* El mismo alimento como montoncito (sin cuenco), para servirlo dentro de un plato */
  function heap(o) {
    const r = o.r || 1.6;
    const dots = (o.dot ? DOTS : [])
      .map(([x0, y0], i) => {
        const x = 32 + (x0 - 32) * 1.05;
        const y = y0 + 7;
        const rot = (i * 53) % 180;
        if (o.shape === 'oval')
          return `<ellipse cx="${x}" cy="${y}" rx="${r * 1.5}" ry="${r}" transform="rotate(${rot} ${x} ${y})" fill="${o.dot}"/>`;
        if (o.shape === 'chunk')
          return `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 1.6}" rx="${r * 0.4}" transform="rotate(${rot} ${x} ${y})" fill="${o.dot}"/>`;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.dot}"/>`;
      })
      .join('');
    return (
      `<ellipse cx="32" cy="47" rx="24" ry="4.6" fill="#000" opacity=".08"/>` +
      `<path d="M8 46c2-31 46-31 48 0-8 3-40 3-48 0z" fill="${o.mound}"/>` +
      dots +
      shine(22, 34, 2.4, 6, 30, 0.3)
    );
  }
  const BOWLS = {};
  const bowlOf = (id, o) => {
    BOWLS[id] = o;
    return bowl(o);
  };

  /* Ramita de hierbas */
  function sprig(color, stemColor, kind) {
    const pts = [
      [32, 14, 0], [24, 22, -40], [40, 22, 40], [22, 33, -60], [42, 33, 60], [28, 42, -30], [37, 42, 30],
    ];
    let leaves = '';
    pts.forEach(([x, y, r], i) => {
      if (kind === 'lobe') {
        leaves += `<g transform="translate(${x} ${y}) rotate(${r})" fill="${color}"><circle cx="0" cy="-3.6" r="4.4"/><circle cx="-3.8" cy="1" r="4.2"/><circle cx="3.8" cy="1" r="4.2"/></g>`;
      } else if (kind === 'frill') {
        leaves += `<g transform="translate(${x} ${y}) rotate(${r})" fill="${color}"><circle cx="0" cy="-4" r="3"/><circle cx="-3.6" cy="-1" r="3"/><circle cx="3.6" cy="-1" r="3"/><circle cx="-2" cy="2.6" r="3"/><circle cx="2" cy="2.6" r="3"/></g>`;
      } else {
        const s = kind === 'round' ? 1.1 : 0.95;
        const d = kind === 'round' ? 'M0 0c2-8 13-9 16 0-3 8-14 8-16 0z' : 'M0 0c4-6 12-6 16 0-4 6-12 6-16 0z';
        leaves += `<g transform="translate(${x} ${y}) rotate(${r - 90}) scale(${s}) translate(-8 0)"><path d="${d}" fill="${color}"/>${line('M2 0h12', '#fff', 1, 'opacity=".45"')}</g>`;
      }
    });
    return line('M32 58V16M32 28l-8-6M32 28l8-6M32 38l-10-5M32 38l10-5M32 47l-4-5M32 47l5-5', stemColor, 2.2) + leaves;
  }

  /* Pez (pescado azul o trucha) */
  function fish(body, belly, fin, extra = '') {
    return (
      `<path d="M10 32L2 22.5v19z" fill="${fin}"/>` +
      `<path d="M9 32c8-12 22-16 34-12 6 2 10 6 12 12-2 6-6 10-12 12-12 4-26 0-34-12z" fill="${body}"/>` +
      `<path d="M11 33.5c9 7 22 10.4 32 7.6 5-1.4 8.6-4.4 10.8-8.2-10 3.8-29 4.6-42.8.6z" fill="${belly}"/>` +
      `<path d="M25 21.4c4-6 10-7.6 15-6.4l-2 5.6z" fill="${fin}"/>` +
      extra +
      line('M40 24.5c2.2 4 2.2 11 0 15', fin, 1.8) +
      `<circle cx="47" cy="29" r="2.8" fill="#fff"/><circle cx="47.6" cy="29" r="1.5" fill="#26233A"/>` +
      shine(24, 26, 7, 2, -12, 0.3)
    );
  }

  /* Mazorca (choclo o maíz morado) */
  function cob(base, kernel, husk, husk2) {
    let k = '';
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 3; col++) {
        const x = 26.5 + col * 5.5;
        const y = 15 + row * 5.4;
        k += `<ellipse cx="${x}" cy="${y}" rx="2.5" ry="2.3" fill="${kernel}"/>`;
      }
    }
    return (
      `<path d="M21 58c-7-13-7-30 2-45 2 15 6 30 9 45z" fill="${husk2}"/>` +
      `<path d="M43 58c7-13 7-30-2-45-2 15-6 30-9 45z" fill="${husk2}"/>` +
      `<rect x="22" y="9" width="20" height="44" rx="10" fill="${base}"/>` +
      k +
      `<path d="M32 59c-11-6-15-17-13-30 7 8 11 19 13 30z" fill="${husk}"/>` +
      `<path d="M32 59c11-6 15-17 13-30-7 8-11 19-13 30z" fill="${husk}"/>`
    );
  }

  const ART = {
    /* ---------- Frutas ---------- */
    platano:
      `<path d="M9 35c3 17 33 25 46-6 .8-2-1.4-3.8-3.2-2.6C42 39 23 41 14 32c-2-1.8-5.3.4-5 3z" fill="#F6CA45"/>` +
      line('M14 39c9 8 26 9 37-5', '#E2A62A', 2, 'opacity=".75"') +
      `<path d="M51 27l2.6-7.4 4 1.4-3 7.2z" fill="#7A5A2A"/><circle cx="10" cy="34.4" r="2" fill="#5B4321"/>` +
      shine(22, 45, 6, 1.8, 24),
    'platano-isla':
      `<path d="M6 30c2 20 36 30 52-4 .8-2.2-1.6-4-3.6-2.8C44 38 22 40 11 28c-2-2-5.2-.6-5 2z" fill="#D7C247"/>` +
      `<path d="M9 31c5 16 33 22 45-5" stroke="#B9A53A" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>` +
      `<circle cx="22" cy="44" r="1.6" fill="#6B5422"/><circle cx="34" cy="47" r="1.2" fill="#6B5422"/><circle cx="44" cy="42" r="1.5" fill="#6B5422"/>` +
      `<path d="M54.4 23.2l2.4-7 4 1.4-2.8 6.8z" fill="#4E3A1C"/><circle cx="7" cy="29.6" r="2.2" fill="#3E2E15"/>` +
      shine(20, 39, 6, 1.8, 30),
    manzana:
      `<path d="M32 21c-5-4-15-4-19 4-5 10 1 25 9 28 4 1.6 7 .6 10-1.4 3 2 6 3 10 1.4 8-3 14-18 9-28-4-8-14-8-19-4z" fill="#E5463C"/>` +
      line('M32 21c-1-5 1-9 4-11', '#6B4423', 2.6) +
      `<path d="M35 14c4-5 11-5 13-2-3 5-9 6-13 2z" fill="#5DAE4B"/>` +
      shine(20, 32, 3.5, 6.5, 20),
    pera:
      `<path d="M32 14c-4.5 0-6 4.5-6 9.5 0 4.5-11 8-11 19 0 8 7.5 13.5 17 13.5s17-5.5 17-13.5c0-11-11-14.5-11-19 0-5-1.5-9.5-6-9.5z" fill="#B8D04E"/>` +
      `<ellipse cx="39" cy="46" rx="6" ry="5" fill="#E9A23B" opacity=".35"/>` +
      line('M32 14c0-4 1-6 3-8', '#6B4423', 2.4) +
      `<path d="M34 9c3-4 9-4 11-1-3 4-8 4-11 1z" fill="#5DAE4B"/>` +
      shine(24, 42, 3.5, 6.5, 15),
    papaya:
      `<g transform="rotate(-24 32 34)"><ellipse cx="32" cy="34" rx="16" ry="23" fill="#8DB83A"/>` +
      `<ellipse cx="32" cy="34" rx="13.6" ry="20.6" fill="#F38A3E"/>` +
      `<ellipse cx="32" cy="36" rx="6" ry="11" fill="#F9B068"/>` +
      [[30, 29], [34, 30], [31, 34], [34.6, 35], [30, 39], [33.6, 40], [32, 44], [32, 26]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#2B2230"/>`)
        .join('') +
      shine(24, 26, 2.4, 6, 0, 0.32) +
      `</g>`,
    mango:
      `<path d="M13 33c2-15 22-24 35-14 10 8 7 27-7 33-14 6-30-2-28-19z" fill="#F9B233"/>` +
      `<path d="M30 18c8-3 15-1 19 3 3 3 4 8 3 12-6-8-14-12-22-15z" fill="#EF5A2B" opacity=".45"/>` +
      `<path d="M14 40c2 6 7 10 13 12-7-1-12-5-13-12z" fill="#9BBE3C" opacity=".6"/>` +
      line('M40 16c1-4 4-7 8-8', '#6B4423', 2.4) +
      `<path d="M46 9c5-4 12-2 13 1-4 4-10 4-13-1z" fill="#5DAE4B"/>` +
      shine(22, 34, 3.6, 7.6, 25),
    granadilla:
      `<circle cx="32" cy="36" r="19" fill="#F3A83A"/>` +
      [[24, 30], [36, 26], [42, 36], [28, 44], [38, 46], [22, 38], [32, 34], [44, 28]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#FFF3D1" opacity=".8"/>`)
        .join('') +
      `<path d="M26 18.5c2-3.4 10-3.4 12 0-4 1.6-8 1.6-12 0z" fill="#9AAE47"/>` +
      line('M32 17c0-4 2-7 5-9', '#7E8F3A', 3) +
      shine(24, 30, 4, 7, 25),
    chirimoya:
      `<path d="M32 12c-12 0-20 10-20 22 0 12 9 20 20 20s20-8 20-20c0-12-8-22-20-22z" fill="#8FC15A"/>` +
      line(
        'M20 26q3 3 6 0M28 23q3 3 6 0M36 26q3 3 6 0M16 34q3 3 6 0M24 33q3 3 6 0M32 33q3 3 6 0M40 34q3 3 6 0M19 42q3 3 6 0M27 41q3 3 6 0M35 42q3 3 6 0M25 49q3 3 6 0M33 49q3 3 6 0',
        '#5E9437',
        1.7
      ) +
      line('M32 12c0-3 1-5 3-6', '#6B4423', 2.4) +
      shine(22, 28, 3, 6, 20, 0.3),
    lucuma:
      `<circle cx="32" cy="34" r="20" fill="#7E8A3A"/>` +
      `<circle cx="32" cy="34" r="16.5" fill="#F3B23C"/>` +
      `<ellipse cx="37" cy="36" rx="7" ry="9" fill="#7A4520"/>` +
      shine(35, 32.5, 2, 3.2, 0, 0.45) +
      shine(24, 28, 3, 5, 25, 0.3),
    fresa:
      `<path d="M32 57c-10-4-19-16-18-26 1-6 7-9 18-9s17 3 18 9c1 10-8 22-18 26z" fill="#E8394A"/>` +
      [[24, 30], [32, 28], [40, 30], [22, 38], [29, 36], [36, 36], [43, 38], [26, 44], [33, 44], [39, 45], [30, 51], [35, 51]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1" ry="1.5" fill="#FFE08A"/>`)
        .join('') +
      `<path d="M18 23c4-3 8-2 10 0 1-4 3-6 4-6s3 2 4 6c2-2 6-3 10 0-3 4-8 6-12 5-1 1-3 2-4 2s-3-1-4-2c-4 1-9-1-8-5z" fill="#4FA34A"/>` +
      shine(23, 33, 2.4, 5, 20, 0.35),
    mandarina:
      `<ellipse cx="32" cy="37" rx="20" ry="17" fill="#F68B1F"/>` +
      [[22, 32], [30, 28], [40, 31], [45, 39], [36, 44], [26, 45], [20, 40], [33, 37]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#D9700F"/>`)
        .join('') +
      line('M32 21c0-3 1-5 3-6', '#6B4423', 2.2) +
      `<path d="M34 18c5-5 12-4 14-1-4 5-10 5-14 1z" fill="#4FA34A"/>` +
      shine(22, 31, 4, 6, 30),
    naranja:
      `<circle cx="32" cy="32" r="21" fill="#F7941D"/><circle cx="32" cy="32" r="18" fill="#FFF3D6"/><circle cx="32" cy="32" r="16.4" fill="#FDB54A"/>` +
      line('M32 16v32M16 32h32M20.4 20.4l23.2 23.2M43.6 20.4L20.4 43.6', '#FFF3D6', 1.8) +
      `<circle cx="32" cy="32" r="2.2" fill="#FFF3D6"/>`,
    aguaymanto:
      `<path d="M32 9c-9 6-17 15-18 28 6-4 12-6 18-6s12 2 18 6c-1-13-9-22-18-28z" fill="#D9C08A"/>` +
      line('M32 10v20M24 17l4 13M40 17l-4 13', '#BFA26A', 1.4) +
      `<circle cx="32" cy="41" r="13" fill="#F6A21E"/>` +
      shine(27, 37, 3, 4.6, 25, 0.45),
    palta:
      `<path d="M32 8c-7 0-10 7-11 13-1 6-9 10-9 21 0 9 9 15 20 15s20-6 20-15c0-11-8-15-9-21-1-6-4-13-11-13z" fill="#3E6B2E"/>` +
      `<path d="M32 12c-5 0-7 6-8 11-1 5-8 9-8 19 0 7 7 12 16 12s16-5 16-12c0-10-7-14-8-19-1-5-3-11-8-11z" fill="#CBE07B"/>` +
      `<circle cx="32" cy="40" r="8" fill="#8A5A2B"/>` +
      shine(29.6, 37, 2.2, 3, 20, 0.4),
    sandia:
      `<path d="M8 25h48c0 14-11 27-24 27S8 39 8 25z" fill="#3E9B48"/>` +
      `<path d="M11 25h42c0 12-9.5 23-21 23S11 37 11 25z" fill="#F2F6E4"/>` +
      `<path d="M13.4 25h37.2c0 10.5-8.4 20.4-18.6 20.4S13.4 35.5 13.4 25z" fill="#F0444F"/>` +
      [[22, 30], [30, 33], [38, 30], [26, 38], [36, 38], [32, 28.5], [42, 34], [20, 34]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1" ry="1.7" fill="#2B2230"/>`)
        .join(''),
    melon:
      `<g transform="rotate(-14 32 34)"><path d="M8 25h48c0 14-11 27-24 27S8 39 8 25z" fill="#B9C66A"/>` +
      `<path d="M11 25h42c0 12-9.5 23-21 23S11 37 11 25z" fill="#F7A65A"/>` +
      `<path d="M20 25h24c0 6-5 11-12 11s-12-5-12-11z" fill="#FBC98C"/></g>`,
    pina:
      `<path d="M32 26l-7-17 7 7 7-7z" fill="#4FA34A"/><path d="M32 26l-13-10 10 3z" fill="#3E8E47"/><path d="M32 26l13-10-10 3z" fill="#3E8E47"/>` +
      `<ellipse cx="32" cy="42" rx="14" ry="16" fill="#F2B233"/>` +
      line(
        'M24 33l3 3 3-3M34 33l3 3 3-3M20 41l3 3 3-3M29 41l3 3 3-3M38 41l3 3 3-3M24 49l3 3 3-3M34 49l3 3 3-3',
        '#C98A1C',
        1.7
      ) +
      shine(24, 38, 2.6, 6, 15, 0.3),
    uva:
      line('M33 9c0 4-1 7-3 9', '#6B4423', 2.4) +
      `<path d="M34 12c4-4 11-4 13 0-4 4-9 4-13 0z" fill="#5DAE4B"/>` +
      [[24, 22], [32, 21], [40, 23], [20, 30], [28, 30], [36, 30], [44, 31], [24, 38], [32, 38], [40, 39], [28, 46], [36, 46], [32, 53]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#7B3F98"/>` + shine(x - 1.6, y - 1.6, 1.4, 1.4, 0, 0.45))
        .join(''),
    limon:
      `<circle cx="27" cy="35" r="15" fill="#7DBE3C"/>` +
      shine(22, 30, 3, 5, 25, 0.35) +
      `<circle cx="43" cy="40" r="12" fill="#5FA22F"/><circle cx="43" cy="40" r="10" fill="#E4F2B5"/>` +
      line('M43 31v18M34 40h18M36.6 33.6l12.8 12.8M49.4 33.6L36.6 46.4', '#7DBE3C', 1.4),

    /* ---------- Verduras ---------- */
    zapallo:
      `<ellipse cx="21" cy="39" rx="12" ry="15" fill="#E06F27"/><ellipse cx="43" cy="39" rx="12" ry="15" fill="#E06F27"/>` +
      `<ellipse cx="32" cy="39" rx="11" ry="16" fill="#F59034"/>` +
      `<path d="M30 24c0-5 2-8 5-10l3 2c-2 2-3 5-3 8z" fill="#5E7D2E"/>` +
      shine(29, 33, 2.6, 7, 0, 0.3),
    zanahoria:
      `<path d="M41 19c4 3 6 8 3 12L17 55c-2 1.5-4.5-.5-3.5-3L33 21c2-4 5-4 8-2z" fill="#F57C1F"/>` +
      line('M27 35l4 2M21.6 43l4 2M32 27l3 2', '#D8601A', 1.8) +
      `<path d="M39 20c-3-6-2-12 1-14 3 4 3 10 1 15z" fill="#4FA34A"/><path d="M42 22c3-6 9-8 13-6-2 4-7 7-12 7z" fill="#5DB84F"/>`,
    brocoli:
      `<path d="M28 35h8l3 19h-14z" fill="#9CCB6B"/>` +
      `<circle cx="21" cy="30" r="9" fill="#3E8E47"/><circle cx="43" cy="30" r="9" fill="#3E8E47"/><circle cx="32" cy="23" r="11" fill="#45994D"/>` +
      `<circle cx="27" cy="35" r="7" fill="#357F3E"/><circle cx="37" cy="35" r="7" fill="#357F3E"/>` +
      [[19, 27], [29, 19], [36, 21], [44, 27], [32, 29], [25, 33], [39, 33]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#6DBA5F"/>`)
        .join(''),
    espinaca:
      line('M32 58c-.6-10-.6-18 0-26', '#7FB55A', 3) +
      `<path d="M31 36c-12-2-19-12-15-25 10 2 17 13 15 25z" fill="#2F7D3A"/>` +
      `<path d="M33 36c12-2 19-12 15-25-10 2-17 13-15 25z" fill="#3A8E44"/>` +
      `<path d="M32 40c-6-8-6-21 0-30 6 9 6 22 0 30z" fill="#45A04E"/>` +
      line('M32 38V14M30 34c-5-4-8-9-10-16M34 34c5-4 8-9 10-16', '#8CCB7A', 1.2, 'opacity=".8"'),
    acelga:
      `<path d="M30 59l1.4-30h3.2l1.4 30z" fill="#F1EDE0"/>` +
      `<path d="M33 31C19 31 11 21 15 8c7-2 15 1 18 9 3-8 11-11 18-9 4 13-4 23-18 23z" fill="#4E9A3E"/>` +
      line('M33 30V12M33 22l-9-7M33 22l9-7M33 27l-12-5M33 27l12-5', '#E7F3D8', 1.6),
    vainita:
      line('M12 26c9 9 19 18 31 24', '#6CBF57', 7) +
      line('M15 16c9 11 19 22 33 28', '#4A9A3E', 7) +
      line('M22 10c8 12 18 22 32 27', '#5DAE4B', 7) +
      `<circle cx="43.4" cy="50.2" r="1.6" fill="#3E7D33"/><circle cx="48.4" cy="44.2" r="1.6" fill="#3E7D33"/><circle cx="54.4" cy="37.2" r="1.6" fill="#3E7D33"/>`,
    arveja:
      `<path d="M7 34c10-13 39-17 51-8-8 15-39 19-51 8z" fill="#5DAE4B"/>` +
      `<path d="M12 33c10-8.6 32-11.6 42-6.4-8 9-32 12.4-42 6.4z" fill="#A6D774"/>` +
      [[20, 32], [28, 30], [36, 29], [44, 28]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.3" fill="#4CA03F"/>` + shine(x - 1.4, y - 1.4, 1.2, 1.2, 0, 0.5))
        .join('') +
      line('M58 26c2-2 3-5 2-8', '#3E7D33', 2.2),
    tomate:
      `<circle cx="32" cy="37" r="19" fill="#E8402F"/>` +
      [0, 72, 144, 216, 288].map((r) => `<ellipse cx="32" cy="15.6" rx="2.6" ry="5.4" transform="rotate(${r} 32 20)" fill="#3E8E47"/>`).join('') +
      `<circle cx="32" cy="20" r="2.4" fill="#3E8E47"/>` +
      shine(23, 33, 3.6, 6.4, 25),
    cebolla:
      `<path d="M32 12c2 6 4 8 10 12 8 5 10 12 10 18 0 9-9 14-20 14s-20-5-20-14c0-6 2-13 10-18 6-4 8-6 10-12z" fill="#A23E7A"/>` +
      line('M32 19c-8 8-12 18-8 34M32 19c8 8 12 18 8 34M32 20v35', '#C86DA0', 1.6) +
      line('M28 56l-2 3M32 56v4M36 56l2 3', '#CDB89A', 1.6) +
      shine(21, 38, 2.6, 6, 15, 0.3),
    'cebolla-china':
      [
        [22, '#5DB84F'],
        [32, '#4CA645'],
        [42, '#5DB84F'],
      ]
        .map(
          ([x, c]) =>
            `<path d="M${x - 3} 42V14c0-3 1.4-5 3-5s3 2 3 5v28z" fill="${c}"/><path d="M${x - 3.6} 42h7.2v8c0 2.4-1.6 4-3.6 4s-3.6-1.6-3.6-4z" fill="#F4F1E6"/>` +
            line(`M${x - 2} 54l-1 4M${x} 54v4.6M${x + 2} 54l1 4`, '#CDB89A', 1.2)
        )
        .join(''),
    ajo:
      `<path d="M32 12c1 6 3 9 9 13 7 5 10 10 10 16 0 9-8 14-19 14S13 50 13 41c0-6 3-11 10-16 6-4 8-7 9-13z" fill="#F4EEDF"/>` +
      line('M32 22c-6 6-8 18-4 32M32 22c6 6 8 18 4 32M24 28c-4 6-5 16-1 24M40 28c4 6 5 16 1 24', '#D3C5A8', 1.6) +
      `<path d="M30 13h4l-1-5h-2z" fill="#D3C5A8"/>` +
      line('M28 55l-1 3M32 55v3M36 55l1 3', '#CDB89A', 1.4),
    choclo: cob('#E2C35C', '#F8E7A6', '#5DA040', '#7DB84A'),
    zapallito:
      `<path d="M11 47c-2-4 0-7 4-9l29-21c5-3 10 3 6 8L22 51c-4 3-9 1-11-4z" fill="#3E8E47"/>` +
      line('M17 43l27-20M20 48l27-19', '#7FC06A', 2, 'opacity=".75"') +
      `<path d="M47 19l5-5 3 3-5 5z" fill="#8BAE5A"/>`,
    culantro: sprig('#4CAF50', '#6E9E40', 'lobe'),
    perejil: sprig('#2E8B3A', '#5E8E35', 'frill'),
    hierbabuena: sprig('#56B95A', '#5E9437', 'point'),
    albahaca: sprig('#2F8F3E', '#4E7E2E', 'round'),
    kion:
      `<path d="M12 40c0-6 6-8 10-7 1-5 7-7 11-4 3-4 10-4 12 1 5-1 9 3 8 8-1 6-8 7-12 5-3 4-10 5-14 2-4 3-11 3-14-1-1 0-1-2-1-4z" fill="#D9B27A"/>` +
      line('M22 33c0 3 1 6 0 9M33 29c1 4 1 8 0 12M45 30c-1 4 0 8 1 11', '#B88C55', 1.6) +
      shine(26, 36, 4, 1.6, -10, 0.35),

    /* ---------- Tubérculos ---------- */
    papa:
      `<ellipse cx="32" cy="36" rx="21" ry="15" transform="rotate(-14 32 36)" fill="#C9A26B"/>` +
      [[22, 34], [33, 30], [42, 37], [30, 43], [40, 29]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1" fill="#8E6B3D"/>`).join('') +
      shine(24, 30, 6, 2.6, -18, 0.32),
    'papa-amarilla':
      `<path d="M14 36c0-11 8-18 18-18 4 0 6 2 9 2 6 0 10 6 10 13 0 11-9 19-20 19-10 0-17-6-17-16z" fill="#E9C258"/>` +
      [[24, 32], [36, 28], [42, 40], [30, 44], [22, 42]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.5" ry="1" fill="#B48A2C"/>`).join('') +
      shine(24, 28, 5, 2.6, -25, 0.35),
    camote:
      `<path d="M7 42c4-12 17-21 31-22 9-.6 16 3 18 7-1 8-10 15-23 18-11 2.4-21 1-26-3z" fill="#B5425A"/>` +
      `<ellipse cx="51" cy="27" rx="5.4" ry="6.4" transform="rotate(-30 51 27)" fill="#F59A3A"/>` +
      `<ellipse cx="51" cy="27" rx="3.4" ry="4.2" transform="rotate(-30 51 27)" fill="#F9B867"/>` +
      line('M18 36c2 2 3 4 3 6M30 30c2 2 3 5 2 8', '#8E2F45', 1.4) +
      shine(22, 34, 7, 2, -24, 0.3),
    yuca:
      `<path d="M7 45c0-4 4-6 8-8l30-14c6-3 12 0 12 6 0 4-3 7-8 9L18 51c-5 2-11-1-11-6z" fill="#8A5A34"/>` +
      line('M17 41l4 6M26 37l4 6M35 33l4 5M44 28l3 5', '#6B4223', 1.6) +
      `<ellipse cx="52.6" cy="28" rx="5" ry="6.6" transform="rotate(-25 52.6 28)" fill="#F7F1E1"/>` +
      `<ellipse cx="52.6" cy="28" rx="1.4" ry="2" transform="rotate(-25 52.6 28)" fill="#E5D7B5"/>`,
    olluco:
      [
        [22, 38, 11, 8, -20],
        [42, 34, 12, 9, 15],
        [33, 48, 9, 6.4, 0],
      ]
        .map(
          ([x, y, rx, ry, r]) =>
            `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#F2D04A"/>` +
            `<ellipse cx="${x + 3}" cy="${y - 1}" rx="${rx * 0.4}" ry="${ry * 0.45}" fill="#E2558A" opacity=".75"/>` +
            `<circle cx="${x - rx * 0.45}" cy="${y + 1.6}" r="1.4" fill="#E2558A" opacity=".75"/>`
        )
        .join(''),
    'papa-seca': bowlOf('papa-seca', { mound: '#B9874A', dot: '#8E5E2C', shape: 'chunk', r: 2, wood: '#D06A4C', inside: '#8E3F2A' }),

    /* ---------- Cereales y granos ---------- */
    quinua: bowlOf('quinua', { mound: '#EADBB5', dot: '#F8EED6', r: 1.7 }),
    kiwicha: bowlOf('kiwicha', { mound: '#F0D9A0', dot: '#FCEBC0', r: 1.2 }),
    canihua: bowlOf('canihua', { mound: '#9A5A3C', dot: '#C17A55', r: 1.2 }),
    avena: bowlOf('avena', { mound: '#E3C79A', dot: '#F4E2BF', shape: 'oval', r: 1.9 }),
    arroz: bowlOf('arroz', { mound: '#F3F1EA', dot: '#FFFFFF', shape: 'oval', r: 1.3, wood: '#6FA8DC', inside: '#3F78AE' }),
    chuno: bowlOf('chuno', { mound: '#FAFAF6', dot: '#E8E6DD', r: 0.8, wood: '#6FA8DC', inside: '#3F78AE' }),
    fideos:
      `<ellipse cx="32" cy="38" rx="21" ry="14" fill="#F6D477"/>` +
      line(
        'M14 38c4-8 30-10 36 0M16 42c6-7 26-8 32 0M18 34c6-6 22-7 28 0M20 46c6-5 18-5 24 0M22 30c5-4 14-4 20 0',
        '#E3AE36',
        2.6
      ) +
      shine(24, 33, 6, 1.6, -8, 0.4),
    pan:
      `<ellipse cx="32" cy="39" rx="22" ry="14" fill="#C9813F"/>` +
      `<ellipse cx="32" cy="35" rx="20" ry="11.5" fill="#E8AE62"/>` +
      line('M17 34c6-5 24-5 30 0', '#F7DCA4', 3.4) +
      shine(22, 30, 5, 1.8, -10, 0.4),
    'maiz-morado': cob('#3A1F4A', '#7A3F9E', '#D9C08A', '#E8D6A8'),

    /* ---------- Menestras ---------- */
    lentejas: bowlOf('lentejas', { mound: '#8C7A3E', dot: '#B2A05A', shape: 'oval', r: 1.6, wood: '#D06A4C', inside: '#8E3F2A' }),
    frejol: bowlOf('frejol', { mound: '#E0B94A', dot: '#F2D677', shape: 'oval', r: 2, wood: '#D06A4C', inside: '#8E3F2A' }),
    garbanzo: bowlOf('garbanzo', { mound: '#DDB675', dot: '#F0D4A0', r: 2.4, wood: '#D06A4C', inside: '#8E3F2A' }),
    'arveja-partida': bowlOf('arveja-partida', { mound: '#8DB84A', dot: '#B3D872', r: 2, wood: '#D06A4C', inside: '#8E3F2A' }),

    /* ---------- Carnes, pescado y huevos ---------- */
    pollo:
      line('M27 37L15 49', '#F4EEDF', 5.4) +
      `<circle cx="11.6" cy="48" r="3.8" fill="#F4EEDF"/><circle cx="16" cy="52.4" r="3.8" fill="#F4EEDF"/>` +
      `<path d="M40 9c10 0 17 8 17 17 0 10-8 18-18 18-4 0-7.4-1.2-10.4-3.4l-2-2C24 35.6 23 32.4 23 28.6 23 18 31 9 40 9z" fill="#E39A48"/>` +
      `<circle cx="44" cy="31" r="2" fill="#C97A2E"/><circle cx="36" cy="35" r="1.4" fill="#C97A2E"/><circle cx="48" cy="22" r="1.4" fill="#C97A2E"/>` +
      shine(34, 18, 6, 3, -35, 0.4),
    higado:
      `<path d="M9 31c0-10 10-14 20-12 6 1 10-3 16-2 8 1 12 8 10 15-2 9-10 13-20 13-6 0-8 4-14 4-8 0-12-8-12-18z" fill="#8E2F2A"/>` +
      line('M30 19c-2 8 0 18 6 26', '#6E1F1C', 2) +
      shine(18, 28, 5, 2.4, -20, 0.3) +
      shine(44, 24, 4, 2, 10, 0.25),
    sangrecita: bowlOf('sangrecita', { mound: '#6B2421', dot: '#8E3A33', shape: 'chunk', r: 1.6, wood: '#F4F1E8', inside: '#CFC7B3' }),
    bazo:
      `<path d="M7 39c2-11 15-17 29-17 13 0 22 4 22 11s-10 11-23 13C21 48 8 47 7 39z" fill="#7A2340"/>` +
      shine(20, 32, 7, 2.2, -12, 0.3),
    res:
      `<path d="M13 23c8-8 27-11 37-4 8 5 8 16 2 24-6 8-20 12-30 8-11-4-17-20-9-28z" fill="#C8414A"/>` +
      `<path d="M13 23c8-8 27-11 37-4" stroke="#F4E3D6" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      line('M22 31c6-2 12 0 16 4M28 42c4-1 8 0 11 2', '#F09AA0', 1.8) +
      shine(24, 26, 5, 2, -15, 0.3),
    pescado: fish('#5B8DB8', '#C8DCEB', '#466F96'),
    trucha: fish(
      '#7E9C76',
      '#F1D2C8',
      '#61805A',
      `<path d="M14 31c10 3 24 3.4 38-.4" stroke="#EE8B86" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>` +
        [[20, 26], [27, 24], [33, 25], [24, 29], [31, 28.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#3E4F38"/>`).join('')
    ),
    huevo:
      `<path d="M23 13c-8 0-14 14-14 24 0 9 6 15 14 15s14-6 14-15c0-10-6-24-14-24z" fill="#E8C49A"/>` +
      shine(17, 28, 2.6, 6, 15, 0.45) +
      `<ellipse cx="44" cy="41" rx="12" ry="14" fill="#FFFFFF"/>` +
      `<ellipse cx="44" cy="41" rx="12" ry="14" fill="none" stroke="#E6DCCB" stroke-width="1.4"/>` +
      `<circle cx="44" cy="42" r="6.6" fill="#F7B92B"/>` +
      shine(42, 40, 1.8, 1.8, 0, 0.5),

    /* ---------- Lácteos ---------- */
    leche:
      `<path d="M18 13h28l-3 41c-.3 3-2.5 4-5 4H26c-2.5 0-4.7-1-5-4z" fill="#DCE8F2"/>` +
      `<path d="M19.6 24h24.8l-2.3 30c-.2 2-1.6 2.6-3.4 2.6H25.3c-1.8 0-3.2-.6-3.4-2.6z" fill="#FFFFFF"/>` +
      `<path d="M18 13h28l-3 41c-.3 3-2.5 4-5 4H26c-2.5 0-4.7-1-5-4z" fill="none" stroke="#B9CDE0" stroke-width="1.6"/>` +
      line('M24 28l1.4 22', '#E8F0F7', 2.4),
    queso:
      `<path d="M10 29v13c0 5 10 9 22 9s22-4 22-9V29z" fill="#EFE5CA"/>` +
      `<ellipse cx="32" cy="29" rx="22" ry="9" fill="#FFFCF2"/>` +
      `<path d="M32 29l22-1.6c0 2.6-3 5-8 6.6z" fill="#EFE5CA"/>` +
      [[22, 27], [30, 25], [38, 27], [26, 31]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#E6DCC0"/>`).join(''),
    yogurt:
      `<path d="M16 23h32l-4 30c-.4 3-3 5-6 5H26c-3 0-5.6-2-6-5z" fill="#FFFFFF"/>` +
      `<path d="M16 23h32l-4 30c-.4 3-3 5-6 5H26c-3 0-5.6-2-6-5z" fill="none" stroke="#D6DEE8" stroke-width="1.4"/>` +
      `<path d="M18.4 33h27.2l-1.3 10H19.7z" fill="#6FA8DC"/>` +
      `<path d="M21 23c1-6 5-9 11-9s10 3 11 9z" fill="#FFFFFF" stroke="#D6DEE8" stroke-width="1.4"/>` +
      `<ellipse cx="32" cy="23" rx="16" ry="2.4" fill="#F1F5FA"/>`,
    mantequilla:
      `<ellipse cx="32" cy="46" rx="25" ry="8" fill="#BFD7EA"/>` +
      `<path d="M14 36l10-8h26l-8 8z" fill="#FFE58A"/>` +
      `<path d="M14 36h28v9H14z" fill="#F7D35A"/><path d="M42 36l8-8v9l-8 8z" fill="#E9BE3E"/>`,

    /* ---------- Despensa ---------- */
    aceite:
      `<rect x="28" y="6" width="8" height="5" rx="1.4" fill="#3E8E47"/>` +
      `<path d="M28.6 11h6.8v6c6 2 9 6 9 12v23c0 3-2 5-5 5H24.6c-3 0-5-2-5-5V29c0-6 3-10 9-12z" fill="#F7E3A0"/>` +
      `<path d="M20.6 33h22.8v19c0 2.2-1.6 4-4 4H24.6c-2.4 0-4-1.8-4-4z" fill="#F2C14E"/>` +
      `<rect x="23" y="38" width="18" height="9" rx="2" fill="#FFFFFF" opacity=".75"/>` +
      shine(24, 26, 1.6, 4, 0, 0.5),
    canela: [
      [16, '#9A5B2E', '#7A4422'],
      [28, '#B06B38', '#8A522A'],
      [40, '#9A5B2E', '#7A4422'],
    ]
      .map(
        ([x, c, d]) =>
          `<rect x="${x}" y="12" width="9" height="42" rx="4.5" fill="${c}" transform="rotate(12 ${x + 4.5} 33)"/>` +
          `<ellipse cx="${x + 4.5}" cy="12.6" rx="4.4" ry="2" transform="rotate(12 ${x + 4.5} 33)" fill="${d}"/>`
      )
      .join(''),
    mani:
      `<path d="M20 15c7 0 11 6 10 12-.4 3 1 4 3 6 5 4 5 12-1 16-6 5-15 2-17-5-1-3 0-5-1-7-5-6-1-22 6-22z" fill="#D9AE6E" transform="rotate(-25 26 33)"/>` +
      `<path d="M41 22c6 0 10 5 9 11-.4 2.6 1 3.6 2.6 5.4 4 3.6 4 10.6-1 14-5 4.4-13 1.8-14.6-4.4-.8-2.6 0-4.4-.8-6.2-4.4-5.2-.8-19.8 4.8-19.8z" fill="#E3BC80" transform="rotate(20 44 38)"/>` +
      line('M18 24l6 2M17 33l7 1M38 32l6 1M39 42l7-1', '#B88A4A', 1.4),
    pecanas:
      `<ellipse cx="25" cy="34" rx="12" ry="18" transform="rotate(-20 25 34)" fill="#8A4F24"/>` +
      `<ellipse cx="42" cy="36" rx="11" ry="16" transform="rotate(18 42 36)" fill="#A3602E"/>` +
      line('M20 22c4 8 6 18 8 26M38 24c2 8 4 16 3 24', '#6A3818', 1.6) +
      shine(21, 28, 2, 5, -20, 0.3),
    palillo: bowlOf('palillo', { mound: '#F2A51A', dot: '#F8C04C', r: 0.9, wood: '#F4F1E8', inside: '#CFC7B3' }),
    agua:
      `<path d="M32 8c-8 12-16 21-16 31 0 9 7 16 16 16s16-7 16-16C48 29 40 20 32 8z" fill="#5BB4E5"/>` +
      shine(25, 38, 3, 7, 15, 0.45),
  };

  /* Íconos de interfaz (trazo, color heredado) */
  const UI = {
    menu: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    recetas: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5c-.8 0-1.5-.7-1.5-1.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
    compras: '<path d="M4 9h16l-1.6 9.4c-.2 1.4-1.4 2.6-2.8 2.6H8.4c-1.4 0-2.6-1.2-2.8-2.6z"/><path d="M8.5 9l3.5-5 3.5 5"/>',
    guia: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    ajustes:
      '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3"/>',
    atras: '<path d="M15 5l-7 7 7 7"/>',
    corazon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    cambiar: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
    compartir: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 13v5.5c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5V13"/>',
    dado: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>',
    chispa: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
    canasta: '<path d="M4 9h16l-1.6 9.4c-.2 1.4-1.4 2.6-2.8 2.6H8.4c-1.4 0-2.6-1.2-2.8-2.6z"/><path d="M8.5 9l3.5-5 3.5 5M9 13v4M15 13v4M12 13v4"/>',
    instalar: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19h14"/>',
    hoja: '<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14z"/><path d="M5 19l8-8"/>',
  };

  V.icon = function (id, size, cls) {
    const art = ART[id] || ART.agua;
    const s = size || 40;
    return `<svg class="food ${cls || ''}" viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true" focusable="false">${art}</svg>`;
  };
  V.hasIcon = (id) => !!ART[id];
  V.ui = function (name, size) {
    const s = size || 22;
    return `<svg class="ui" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${UI[name] || ''}</svg>`;
  };

  /* Plato ilustrado: combina 2–3 ingredientes sobre un plato, cuenco o vaso */
  const MEAL_TINT = {
    desayuno: ['#FFE9B8', '#F4B63F'],
    refrigerio: ['#DDF0CB', '#7DBB4B'],
    almuerzo: ['#FFD9C4', '#E8632B'],
    cena: ['#E6DAF3', '#7B4FA8'],
  };
  const nest = (id, x, y, s) =>
    `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 64 64">${BOWLS[id] ? heap(BOWLS[id]) : ART[id] || ''}</svg>`;

  V.dishArt = function (r, opts) {
    const o = opts || {};
    const tipo = r.tipo[0];
    const [tint, deep] = MEAL_TINT[tipo] || MEAL_TINT.almuerzo;
    const h = r.hero || [];
    let body = '';
    if (r.plato === 'taza') {
      body +=
        `<ellipse cx="80" cy="106" rx="30" ry="6" fill="#000" opacity=".08"/>` +
        `<path d="M56 34h48l-6 62c-.4 5-4 8-9 8H71c-5 0-8.6-3-9-8z" fill="#FFFFFF"/>` +
        `<path d="M58.6 50h42.8l-4.4 45c-.3 3-2.6 4.6-5.4 4.6H68.4c-2.8 0-5.1-1.6-5.4-4.6z" fill="${deep}" opacity=".25"/>` +
        `<path d="M56 34h48l-6 62c-.4 5-4 8-9 8H71c-5 0-8.6-3-9-8z" fill="none" stroke="${deep}" stroke-opacity=".35" stroke-width="2"/>`;
      if (h[0]) body += nest(h[0], 8, 48, 52);
      if (h[1]) body += nest(h[1], 102, 50, 50);
    } else if (r.plato === 'bowl') {
      body +=
        `<ellipse cx="80" cy="106" rx="50" ry="6" fill="#000" opacity=".08"/>` +
        `<ellipse cx="80" cy="60" rx="54" ry="12" fill="${deep}" opacity=".3"/>`;
      if (h[1]) body += nest(h[1], 20, 14, 56);
      if (h[2]) body += nest(h[2], 84, 14, 56);
      if (h[0]) body += nest(h[0], 46, 0, 68);
      body +=
        `<path d="M26 60c0 4.4 24 9 54 9s54-4.6 54-9c0 25-24 44-54 44S26 85 26 60z" fill="#FFFFFF"/>` +
        `<path d="M26 60c0 4.4 24 9 54 9s54-4.6 54-9" fill="none" stroke="${deep}" stroke-opacity=".35" stroke-width="2"/>` +
        `<path d="M40 78c6 12 18 19 32 21" stroke="${deep}" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (r.plato === 'snack') {
      body +=
        `<ellipse cx="80" cy="104" rx="60" ry="6" fill="#000" opacity=".07"/>` +
        `<rect x="14" y="66" width="132" height="34" rx="17" fill="#FFFFFF"/>` +
        `<rect x="14" y="66" width="132" height="34" rx="17" fill="none" stroke="${deep}" stroke-opacity=".3" stroke-width="2"/>`;
      if (h[2]) body += nest(h[2], 108, 14, 40);
      if (h[0]) body += nest(h[0], 18, 18, 66);
      if (h[1]) body += nest(h[1], 76, 24, 60);
    } else {
      body +=
        `<ellipse cx="80" cy="68" rx="66" ry="40" fill="#000" opacity=".07"/>` +
        `<ellipse cx="80" cy="64" rx="66" ry="41" fill="#FFFFFF"/>` +
        `<ellipse cx="80" cy="64" rx="51" ry="31" fill="${deep}" opacity=".14"/>` +
        `<ellipse cx="80" cy="64" rx="66" ry="41" fill="none" stroke="${deep}" stroke-opacity=".28" stroke-width="2"/>`;
      if (h[3]) body += nest(h[3], 102, 14, 36);
      if (h[1]) body += nest(h[1], 20, 40, 56);
      if (h[2]) body += nest(h[2], 86, 42, 54);
      if (h[0]) body += nest(h[0], 48, 12, 66);
    }
    const bg = (o.tinted ? `<rect width="160" height="120" fill="${tint}"/>` : '') + dotsPattern(deep);
    return `<svg class="dish" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${bg}${body}</svg>`;
  };

  function dotsPattern(c) {
    let s = '';
    const pts = [[12, 14], [148, 18], [20, 104], [140, 100], [150, 60], [8, 60], [40, 8], [120, 8]];
    pts.forEach(([x, y], i) => {
      s += i % 2 ? `<circle cx="${x}" cy="${y}" r="3" fill="${c}" opacity=".18"/>` : `<path d="M${x - 4} ${y}h8M${x} ${y - 4}v8" stroke="${c}" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>`;
    });
    return s;
  }

  V.ART_IDS = Object.keys(ART);
})();
