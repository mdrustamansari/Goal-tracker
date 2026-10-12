// Pick, then start: pieces start when you press Start; waiting is not counted as late
const E = require('../engine.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const D = k => new Date(k + 'T10:00:00').getTime(), N = E.dn;
let id = 1, ev = []; const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
const T0 = D('2026-10-01'), G = g => Object.assign({ kind: 'piece' }, g);
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4, startMode: 'pick' } }, T0);
add({ t: 'goal', op: 'addmany', gs: [
  { id: 1, kind: 'project', title: 'Ch1', chap: true }, { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading' }, { id: 3, kind: 'project', title: 'Drafting', parent: 1, grp: 'drafting' },
  G({ id: 4, title: 'Skim', parent: 2, pdays: 3 }), G({ id: 5, title: 'Scan', parent: 2, pdays: 5 }), G({ id: 6, title: 'Def', parent: 3, pdays: 2 }) ] }, T0);
let P = E.derive(ev, D('2026-10-05')).pieces;
t('pick mode on', P.pickMode);
t('nothing picked: none working', P.active.length === 0);
t('recommended is the first unlocked', P.upcoming.length === 2 && P.upcoming[0].id === 4 && P.upcoming[1].id === 5);
t('waiting is not late', P.byId.get(4).status === 'ready' && P.byId.get(4).lateDays === 0 && P.byId.get(4).start === N('2026-10-05'));
t('drafting is not recommended while locked', !P.upcoming.some(p => p.id === 6));
// press Start on day 5
add({ t: 'begin', goal: 4, day: '2026-10-05' }, D('2026-10-05'));
P = E.derive(ev, D('2026-10-05')).pieces;
t('started: working on it', P.active.map(p => p.id).join() === '4' && P.byId.get(4).status === 'on' && P.byId.get(4).start === N('2026-10-05') && P.byId.get(4).due === N('2026-10-07'));
t('it leaves the recommended list', P.upcoming.map(p => p.id).join() === '5');
// a few days later it is late by the clock, from the day it started
P = E.derive(ev, D('2026-10-09')).pieces; t('late from its own start', P.byId.get(4).status === 'late' && P.byId.get(4).lateDays === 2);
// second piece picked at the same time
add({ t: 'begin', goal: 5, day: '2026-10-06' }, D('2026-10-06'));
P = E.derive(ev, D('2026-10-06')).pieces; t('two at once', P.active.length === 2 && P.byId.get(5).start === N('2026-10-06'));
// stop working on a piece that has no work
add({ t: 'unbegin', goal: 5 }, D('2026-10-06'));
P = E.derive(ev, D('2026-10-06')).pieces; t('unbegin returns it to recommended', P.active.map(p => p.id).join() === '4' && P.upcoming.some(p => p.id === 5));
// finishing a begun piece measures the real time
add({ t: 'fin', goal: 4, day: '2026-10-08' }, D('2026-10-08'));
P = E.derive(ev, D('2026-10-08')).pieces; t('took counts from Start', P.byId.get(4).took === 4 && P.byId.get(4).over === 1);
// legacy mode is unchanged
const ev2 = ev.map(e => e.t === 'cfg' ? Object.assign({}, e, { c: { start: '2023-02-11', years: 5, target: 4 } }) : e);
t('without startMode the clock starts pieces itself', !E.derive(ev2, D('2026-10-05')).pieces.pickMode);
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
