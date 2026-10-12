// Rhythm: week against week, month against month, and where the current speed leads
const E = require('../engine.js'); let ok = 0, bad = 0;
const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const near = (a, b, n) => t(n + ' (' + a + ' vs ' + b + ')', Math.abs(a - b) < 1e-6);
const D = k => new Date(k + 'T10:00:00').getTime(), N = E.dn;
let id = 1, ev = []; const add = (e, ts) => { e.id = id++; e.ts = ts; ev.push(e); return e; };
const T0 = D('2026-09-01'), G = g => Object.assign({ kind: 'piece' }, g);
add({ t: 'cfg', c: { start: '2023-02-11', years: 5, target: 4, startMode: 'pick' } }, T0);
add({ t: 'goal', op: 'addmany', gs: [{ id: 1, kind: 'project', title: 'Ch1', chap: true }, { id: 2, kind: 'project', title: 'Reading', parent: 1, grp: 'reading' },
  G({ id: 4, title: 'Skim', parent: 2, pdays: 10, qty: 100, qunit: 'pages', qpace: 10 }), G({ id: 5, title: 'Draft', parent: 1, pdays: 40 })] }, T0);
add({ t: 'begin', goal: 4, day: '2026-09-20' }, D('2026-09-20'));
// 100 pages = 10 plan days. 5 pages a day in the earlier week, 10 a day in the latest week
for (let d = 15; d <= 21; d++) add({ t: 'log', goal: 4, qty: 5, day: '2026-09-' + d }, D('2026-09-' + d));
for (let d = 22; d <= 28; d++) add({ t: 'log', goal: 4, qty: 5, day: '2026-09-' + d }, D('2026-09-' + d));
add({ t: 'log', goal: 4, qty: 5, day: '2026-09-29' }, D('2026-09-29'));
let R = E.derive(ev, D('2026-09-29')).pieces.rhythm;
near(R.w7.days, 0.5 * 7 / 1 * 1, 'last 7 days: 7 logs of 5 pages = 3.5 plan days'); // 5 pages = 0.5 plan day
near(R.p7.days, 3.5, 'week before: 7 logs of 5 pages = 3.5 plan days');
t('earlier period exists', R.hasP7 && !R.hasP30);
t('basis is 30 days once there are two weeks of history', R.basisDays === 30); near(R.speed, 0.5, 'speed counts only the days since you began');
t('finish date at speed is after today', R.atSpeedN > N('2026-09-29'));
near(R.todayWD, 0.5, 'today counts');
t('end and target are carried', R.endN > R.targetN && R.targetN === E.derive(ev, D('2026-09-29')).jrf.targetN);
// no history: no forecast
const e0 = ev.filter(e => e.t === 'cfg' || e.t === 'goal'); R = E.derive(e0, D('2026-09-29')).pieces.rhythm;
t('no history, no speed forecast', R.atSpeedN === null && !R.hasP7 && R.w7.days === 0);
R = E.derive(ev, D('2026-09-29')).pieces.rhythm; t('14 days of bars, the last is today', R.days14.length === 14 && R.days14[13].n === N('2026-09-29') && Math.abs(R.days14[13].v - R.todayWD) < 1e-9);
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
