// Daily work flows up into the Plan pieces, chapters and the thesis
const E = require('../engine.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const near = (a, b, n) => t(n + ' (' + a + ' vs ' + b + ')', Math.abs(a - b) < 1e-6);
const D = k => new Date(k + 'T10:00:00').getTime();
let id = 1, ev = []; const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
const T0 = D('2026-10-01'), G = g => Object.assign({ kind: 'piece' }, g);

// A: one track over two pieces (Skim 3 d + Scan 5 d), 80 pages in all
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4 } }, T0);
add({ t: 'goal', op: 'addmany', gs: [
  { id: 1, kind: 'project', title: 'Ch1', chap: true },
  { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading', qty: 80, qunit: 'pages', qpace: 10 },
  { id: 3, kind: 'project', title: 'Drafting', parent: 1, grp: 'drafting' },
  G({ id: 4, title: 'Skim', parent: 2, pdays: 3 }), G({ id: 5, title: 'Scan', parent: 2, pdays: 5 }),
  G({ id: 6, title: 'Def', parent: 3, pdays: 2 }), G({ id: 7, title: 'TA', parent: 3, pdays: 5 }) ] }, T0);
add({ t: 'log', goal: 2, qty: 40, day: '2026-10-02' }, D('2026-10-02'));
let P = E.derive(ev, D('2026-10-05')).pieces;
near(P.byId.get(4).work, 1, 'skim share is full');
near(P.byId.get(5).work, 0.2, 'scan gets the rest in clock order');
t('skim is not marked done by pages alone', !P.byId.get(4).done);
near(P.byId.get(6).work, 0, 'drafting untouched');
const a = P.nodeAgg(1);
near(a.workDays, 4, 'chapter work days'); near(a.pct, 4 / 15, 'chapter pct is work based'); near(a.pctDone, 0, 'chapter pctDone counts finished pieces only');
near(a.openDays, 11, 'days still to do');
// finishing the track finishes the pieces as before
add({ t: 'log', goal: 2, qty: 40, day: '2026-10-05' }, D('2026-10-05'));
P = E.derive(ev, D('2026-10-05')).pieces;
t('both pieces done at 100%', P.byId.get(4).done && P.byId.get(5).done);
near(P.byId.get(5).work, 1, 'done = 1');

// B: one track on one piece; slower than the clock
id = 1; ev = [];
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4 } }, T0);
add({ t: 'goal', op: 'addmany', gs: [{ id: 1, kind: 'project', title: 'Ch1', chap: true }, { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading' },
  G({ id: 4, title: 'Skim', parent: 2, pdays: 3, qty: 30, qunit: 'pages', qpace: 10 }), G({ id: 5, title: 'Scan', parent: 2, pdays: 5 })] }, T0);
add({ t: 'log', goal: 4, qty: 10, day: '2026-10-01' }, D('2026-10-01')); add({ t: 'log', goal: 4, qty: 10, day: '2026-10-02' }, D('2026-10-02'));
P = E.derive(ev, D('2026-10-03')).pieces; const s = P.byId.get(4);
near(s.work, 2 / 3, 'two thirds done'); t('shows pages', s.workQty === 20 && s.workTotal === 30 && s.workUnit === 'pages');
near(s.workExp, 1, 'the clock expects all by day 3'); near(s.workAhead, -1, 'one day behind');
t('forecast follows the real pace', s.projN === E.dn('2026-10-05'));
t('next piece shifts later', P.byId.get(5).start === E.dn('2026-10-06'));
// ahead of the clock
add({ t: 'log', goal: 4, qty: 9, day: '2026-10-03' }, D('2026-10-03'));
P = E.derive(ev, D('2026-10-03')).pieces; const s2 = P.byId.get(4);
near(s2.work, 29 / 30, 'almost there'); t('projects to finish by tomorrow at most', s2.projN <= E.dn('2026-10-04'));
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
