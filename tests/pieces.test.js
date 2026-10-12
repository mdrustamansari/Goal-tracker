const E = require('../engine.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const D = k => new Date(k + 'T10:00:00').getTime();
let id = 1, ev = [];
const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
const T0 = D('2026-10-01');
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4 } }, T0);
const G = (g) => Object.assign({ kind: 'piece' }, g);
add({ t: 'goal', op: 'addmany', gs: [
  { id: 1, kind: 'project', title: 'Ch1', chap: true },
  { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading' },
  { id: 3, kind: 'project', title: 'Drafting', parent: 1, grp: 'drafting' },
  G({ id: 4, title: 'Skim', parent: 2, pdays: 3 }), G({ id: 5, title: 'Scan', parent: 2, pdays: 5 }),
  G({ id: 6, title: 'Def', parent: 3, pdays: 2 }), G({ id: 7, title: 'TA', parent: 3, pdays: 5 }) ] }, T0);
let d = E.derive(ev, D('2026-10-01'));
let P = d.pieces;
t('7 pieces order', P.list.map(p => p.id).join() === '4,5,6,7');
t('chain starts', P.byId.get(4).start === E.dn('2026-10-01') && P.byId.get(5).start === E.dn('2026-10-04') && P.byId.get(6).start === E.dn('2026-10-09'));
t('due', P.byId.get(4).due === E.dn('2026-10-03'));
t('drafting locked', P.byId.get(6).locked && !P.byId.get(4).locked);
t('final', P.projFinal === E.dn('2026-10-15'));
// lock baseline after 24h
let dd = E.derive(ev, D('2026-10-03')); t('needs lock', dd.pieces.needLock.length === 4);
const map = {}; dd.pieces.needLock.forEach(p => map[p.id] = E.keyOf(p.projN));
add({ t: 'lock', map }, T0 + 86400000);
// skim done on day 5 (2 late)
add({ t: 'fin', goal: 4, day: '2026-10-05' }, D('2026-10-05'));
d = E.derive(ev, D('2026-10-05')); P = d.pieces;
t('skim over 2', P.byId.get(4).took === 5 && P.byId.get(4).over === 2);
t('scan starts after', P.byId.get(5).start === E.dn('2026-10-06'));
t('slip propagates', P.byId.get(5).slip === 2 && d.thesis.slip === 2);
t('buffer', d.thesis.buffer === E.dn('2028-02-11') - E.dn('2026-10-17'));
// open overdue grows daily
d = E.derive(ev, D('2026-10-14')); P = d.pieces;
t('late grows', P.byId.get(5).status === 'late' && P.byId.get(5).lateDays === 14 - 10 && P.byId.get(5).projN === E.dn('2026-10-14'));
t('later pieces shift', P.byId.get(6).start === E.dn('2026-10-15'));
// finish early banks
add({ t: 'fin', goal: 5, day: '2026-10-14' }, D('2026-10-14'));
add({ t: 'fin', goal: 6, day: '2026-10-14' }, D('2026-10-14'));
d = E.derive(ev, D('2026-10-14')); P = d.pieces;
t('unlocked', !P.byId.get(7).locked);
t('def took 1 early 1', P.byId.get(6).took === 1 && P.earlyDays >= 1);
// undated done
let id2 = 100; add({ t: 'fin', goal: 7, day: null }, D('2026-10-14'));
d = E.derive(ev, D('2026-10-14')); t('undated ok', d.pieces.byId.get(7).doneUndated && d.pieces.open.length === 0);
// unfin
add({ t: 'unfin', goal: 7 }, D('2026-10-14') + 1);
d = E.derive(ev, D('2026-10-14') + 5); t('unfin reopens', !d.pieces.byId.get(7).done);
// pace ratio needs 3 timed
t('ratio computed', d.pieces.paced === 3 && d.pieces.ratio > 1);
// manual start earlier
add({ t: 'pstart', goal: 7, day: '2026-10-10' }, D('2026-10-14') + 6);
// void a fin
add({ t: 'void', target: ev.find(e => e.t === 'fin' && e.goal === 6).id }, D('2026-10-14') + 7);
d = E.derive(ev, D('2026-10-14') + 8); t('void reopens', !d.pieces.byId.get(6).done && d.pieces.byId.get(7).locked === false);
// mirror piece removed when theme deleted
add({ t: 'goal', op: 'addmany', gs: [{ id: 20, kind: 'project', title: 'Theme X', parent: 3 }, G({ id: 21, title: 'x', parent: 3, pdays: 1, mirror: 20 })] }, D('2026-10-14') + 9);
d = E.derive(ev, D('2026-10-14') + 10); t('mirror present', d.pieces.byId.has(21) && d.pieces.byId.get(21).title === 'Edit: Theme X');
add({ t: 'goal', op: 'del', gid: 20 }, D('2026-10-14') + 11);
d = E.derive(ev, D('2026-10-14') + 12); t('mirror dropped', !d.pieces.byId.has(21));
// ---- daily pace tracks and custom order ----
{
  const ev2 = []; let i2 = 1; const A = (e, ts) => { e.id = i2++; e.ts = ts; ev2.push(e); return e; };
  const T1 = D('2026-10-07');
  A({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4 } }, T1);
  A({ t: 'goal', op: 'addmany', gs: [
    { id: 1, kind: 'project', title: 'By the Sea', chap: true },
    { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading', qty: 246, qunit: 'pages', qpace: 15 },
    { id: 3, kind: 'project', title: 'Drafting', parent: 1, grp: 'drafting' },
    { id: 4, kind: 'piece', title: 'Skim', parent: 2, pdays: 15 }, { id: 5, kind: 'piece', title: 'Scan', parent: 2, pdays: 1, fixedEnd: '2026-10-19' },
    { id: 6, kind: 'piece', title: 'Orientation', parent: 3, pdays: 4 }, { id: 7, kind: 'piece', title: 'Synthesis', parent: 3, pdays: 5 } ] }, T1);
  A({ t: 'log', goal: 2, qty: 30, day: '2026-10-07' }, T1 + 1000);
  let d = E.derive(ev2, D('2026-10-07') + 5000), tr = d.pieces.tracks[0];
  t('track done 30', tr.done === 30 && tr.remaining === 216);
  t('track pace projection', tr.projN === E.dn('2026-10-07') + 15 && tr.behind === true);
  t('track needs pages/day', tr.deadline === E.dn('2026-10-19') && tr.need === Math.ceil(216 / 12));
  t('pieces open', d.pieces.byId.get(4).done === false);
  A({ t: 'log', goal: 2, qty: 216, day: '2026-10-09' }, D('2026-10-09'));
  d = E.derive(ev2, D('2026-10-09') + 5000);
  t('auto-finish both', d.pieces.byId.get(4).done && d.pieces.byId.get(5).done && d.pieces.byId.get(4).finN === E.dn('2026-10-09'));
  t('auto-fin early banked', d.pieces.byId.get(4).over < 0);
  t('next starts after', d.pieces.byId.get(6).start === E.dn('2026-10-10'));
  // custom order
  A({ t: 'cfg', c: { order: 'custom' } }, D('2026-10-09') + 6000);
  A({ t: 'next', goal: 7 }, D('2026-10-09') + 7000);
  d = E.derive(ev2, D('2026-10-09') + 9000);
  t('custom picks synthesis first', d.pieces.open[0].id === 7 && d.pieces.byId.get(7).start === E.dn('2026-10-10') && d.pieces.byId.get(6).start === E.dn('2026-10-15'));
  const nx = A({ t: 'next', goal: 6 }, D('2026-10-09') + 8000);
  d = E.derive(ev2, D('2026-10-09') + 9500);
  t('custom repick', d.pieces.open[0].id === 6);
  A({ t: 'void', target: 4 }, D('2026-10-09') + 9600);   // void of an unrelated id must not break
  A({ t: 'void', target: ev2.find(e => e.t === 'log' && e.qty === 216).id }, D('2026-10-09') + 9700);
  d = E.derive(ev2, D('2026-10-09') + 9800);
  t('void log reopens', !d.pieces.byId.get(4).done);
}
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
