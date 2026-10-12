// "Last page I finished": fixes where you are, never counts as work done
const E = require('../engine.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const D = k => new Date(k + 'T10:00:00').getTime();
let id = 1, ev = []; const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4, startMode: 'pick' } }, D('2026-09-01'));
add({ t: 'goal', op: 'addmany', gs: [{ id: 1, kind: 'project', title: 'Ch1', chap: true }, { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading' },
  { kind: 'piece', id: 4, title: 'Skim', parent: 2, pdays: 10, qty: 100, qunit: 'pages', qpace: 10 }, { kind: 'piece', id: 5, title: 'Draft', parent: 1, pdays: 40 }] }, D('2026-09-01'));
add({ t: 'begin', goal: 4, day: '2026-09-20' }, D('2026-09-20'));
add({ t: 'log', goal: 4, qty: 10, day: '2026-09-21' }, D('2026-09-21'));
add({ t: 'log', goal: 4, qty: 5, day: '2026-09-22' }, D('2026-09-22'));
const NOW = D('2026-09-28'), tr = () => E.derive(ev, NOW).pieces.tracks.find(x => x.id === 4);
t('15 pages from logs', tr().done === 15 && tr().lastLogN === E.dn('2026-09-22'));
const w7 = E.derive(ev, NOW).pieces.rhythm.w7.days;
const pos = add({ t: 'pos', goal: 4, page: 40, day: '2026-09-28' }, D('2026-09-28'));
t('the note moves you to page 40', tr().done === 40);
t('it is not work: the week total is unchanged', Math.abs(E.derive(ev, NOW).pieces.rhythm.w7.days - w7) < 1e-9);
t('it is not work: today shows no pages', E.derive(ev, NOW).pieces.rhythm.todayWD === 0);
add({ t: 'log', goal: 4, qty: 5, day: '2026-09-28' }, D('2026-09-28') + 1000);
t('logging after the note adds on top', tr().done === 45);
add({ t: 'void', target: pos.id }, D('2026-09-28') + 2000);
t('undoing the note goes back to the logs', tr().done === 20);
add({ t: 'pos', goal: 4, page: 12, day: '2026-09-28' }, D('2026-09-28') + 3000);
t('a lower page is allowed (you counted too many)', tr().done === 12);
add({ t: 'pos', goal: 4, page: 100, day: '2026-09-28' }, D('2026-09-28') + 4000);
t('reaching the end finishes the track', tr().finished === true);
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
