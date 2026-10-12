const E = require('../engine.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const D = k => new Date(k + 'T10:00:00').getTime();
let id = 1, ev = [];
const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
const T0 = D('2026-10-01'), G = g => Object.assign({ kind: 'piece' }, g);
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4 } }, T0);
const chap = (c, base) => [
  { id: base, kind: 'project', title: 'Ch' + c, chap: true },
  { id: base + 1, kind: 'project', title: 'Reading', parent: base, grp: 'reading' },
  { id: base + 2, kind: 'project', title: 'Drafting', parent: base, grp: 'drafting' },
  { id: base + 3, kind: 'project', title: 'Editing', parent: base, grp: 'editing' },
  G({ id: base + 4, title: 'Skim' + c, parent: base + 1, pdays: 2 }),
  G({ id: base + 5, title: 'Draft' + c, parent: base + 2, pdays: 3 }),
  G({ id: base + 6, title: 'Edit' + c, parent: base + 3, pdays: 2 })];
add({ t: 'goal', op: 'addmany', gs: chap(1, 1).concat(chap(2, 11)) }, T0);
let P = E.derive(ev, D('2026-10-01')).pieces;
t('chapter mode: editing last', P.list.map(p => p.id).join() === '5,6,15,16,7,17');
t('edit locked', P.byId.get(7).locked && P.byId.get(7).lockWhy === 'edit' && P.byId.get(17).locked);
t('draft locked by reading', P.byId.get(6).lockWhy === 'reading');
add({ t: 'cfg', c: { order: 'phase' } }, T0 + 1);
P = E.derive(ev, D('2026-10-01')).pieces;
t('phase mode', P.list.map(p => p.id).join() === '5,15,6,16,7,17');
add({ t: 'cfg', c: { order: 'custom' } }, T0 + 2); add({ t: 'next', goal: 7 }, T0 + 3);
P = E.derive(ev, D('2026-10-01')).pieces;
t('custom: locked edit pick ignored', P.list[P.list.length - 1].grp === 'editing' && P.list[0].id === 5);
['5', '6', '15', '16'].forEach((g, i) => add({ t: 'fin', goal: +g, day: '2026-10-0' + (2 + i) }, T0 + 10 + i));
P = E.derive(ev, D('2026-10-08')).pieces;
t('unlocks when all reading+drafting done', !P.byId.get(7).locked && !P.byId.get(17).locked && P.rdOpen === 0);
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
