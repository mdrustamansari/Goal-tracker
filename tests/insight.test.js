const E = require('../engine.js'), I = require('../insight.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const D0 = k => new Date(k + 'T10:00:00').getTime();
let id = 1, ev = []; const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
const T0 = D0('2026-09-01'), G = g => Object.assign({ kind: 'piece' }, g);
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4 } }, T0);
const gs = [{ id: 1, kind: 'project', title: 'Ch1', chap: true }, { id: 2, kind: 'project', title: 'Drafting', parent: 1, grp: 'drafting' }];
for (let i = 0; i < 6; i++) gs.push(G({ id: 10 + i, title: 'P' + i, parent: 2, pdays: 4 }));
add({ t: 'goal', op: 'addmany', gs }, T0);
// finish three drafting pieces, each taking 6 days against 4 allotted
['2026-09-06', '2026-09-12', '2026-09-18'].forEach((d, i) => add({ t: 'fin', goal: 10 + i, day: d }, D0(d)));
const day = k => D0(k);
let d = E.derive(ev, day('2026-09-19')), A = I.analyse(ev, d, E);
t('learned ratio > 1.15', A.learned.drafting.ratio > 1.15);
t('needs 3', I.analyse(ev.slice(0, 4), E.derive(ev.slice(0, 4), day('2026-09-19')), E).learned.drafting.ratio === null);
t('suggestion for not started pieces', A.suggestions.length === 1 && A.suggestions[0].pieces.every(x => x.to > x.from));
// chain: logs on 3 days, one missed day forgiven, two missed breaks
[17, 18, 20].forEach(n => add({ t: 'log', goal: 99, qty: 5, day: '2026-09-' + n }, day('2026-09-' + n)));
d = E.derive(ev, day('2026-09-20')); A = I.analyse(ev, d, E);
t('one miss forgiven', A.streak >= 3 && A.workedToday);
d = E.derive(ev, day('2026-09-23')); A = I.analyse(ev, d, E);
t('two misses break', A.streak === 0 && A.best >= 3);
// leave day does not break
add({ t: 'leave', from: '2026-09-21', to: '2026-09-23' }, day('2026-09-21'));
d = E.derive(ev, day('2026-09-24')); A = I.analyse(ev, d, E);
t('leave days neutral', A.streak >= 3);
// void removes
const lg = ev.filter(e => e.t === 'log'); add({ t: 'void', target: lg[2].id }, day('2026-09-20'));
A = I.analyse(ev, E.derive(ev, day('2026-09-24')), E); t('void honoured', !A.workedToday || A.streak < 4);
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
