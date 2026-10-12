const G = require('../engine.js');
let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.log('FAIL', m); } };
const near = (a, b, m) => ok(Math.abs(a - b) < 0.01, m + ' got ' + a + ' want ' + b);
let id = 1;
const ev = o => Object.assign({ id: id++ }, o);
const T = (k, h = 12) => { const p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], h).getTime(); };
const ALL = [0, 1, 2, 3, 4, 5, 6];
const cfg = ev({ t: 'cfg', ts: T('2026-10-01', 8), c: { start: '2026-10-01', years: 5, target: 4 } });
const task = ev({ t: 'goal', op: 'add', ts: T('2026-10-01', 9), g: { id: 1, kind: 'task', parent: 10, title: 'Gurnah novel', unit: 'pages', total: 250, perDay: 15, days: ALL, start: '2026-10-01', deadline0: '2026-10-17' } });
const proj = ev({ t: 'goal', op: 'add', ts: T('2026-10-01', 9), g: { id: 10, kind: 'project', title: 'Chapter 1', thesis: true } });
const base = [cfg, proj, task];
let D = G.derive(base, T('2026-10-01', 10));
let t = D.byId.get(1);
near(t.target, 15, 'day1 target'); ok(t.status === 'on', 'on schedule day1');
// day 1: read 8
const l1 = ev({ t: 'log', ts: T('2026-10-01', 18), goal: 1, qty: 8, day: '2026-10-01' });
D = G.derive([...base, l1], T('2026-10-02', 9)); t = D.byId.get(1);
near(t.target, 22, 'day2 target 15+7'); near(t.carried, 7, 'carried'); near(t.fresh, 15, 'fresh'); ok(t.status === 'behind', 'behind');
near(t.behindQty, 7, 'behind qty');
// day 2 nothing -> day 3 = 15+7+15=37
D = G.derive([...base, l1], T('2026-10-03', 9)); t = D.byId.get(1);
near(t.target, 37, 'day3 target accumulates'); 
ok(t.slip > 0, 'slip positive when behind: ' + t.slip);
// catch up day2: 22 -> on schedule
const l2 = ev({ t: 'log', ts: T('2026-10-02', 18), goal: 1, qty: 22, day: '2026-10-02' });
D = G.derive([...base, l1, l2], T('2026-10-03', 9)); t = D.byId.get(1);
near(t.target, 15, 'day3 target back to 15'); ok(t.status === 'on', 'recovered');
// ahead: day1 read 40
const la = ev({ t: 'log', ts: T('2026-10-01', 18), goal: 1, qty: 40, day: '2026-10-01' });
D = G.derive([...base, la], T('2026-10-02', 9)); t = D.byId.get(1);
near(t.target, 0, 'ahead: surplus covers today'); 
ok(t.status === 'ahead' || t.status === 'on', 'ahead status ' + t.status);
// steady 15/day for 10 days, finish on time -> slip 0
const logs = []; for (let d = 1; d <= 9; d++) logs.push(ev({ t: 'log', ts: T('2026-10-0' + d, 18), goal: 1, qty: 15, day: '2026-10-0' + d }));
D = G.derive([...base, ...logs], T('2026-10-10', 9)); t = D.byId.get(1);
ok(Math.abs(t.slip) <= 1, 'steady pace slip ~0: ' + t.slip); ok(t.status === 'on', 'steady on');
// leave pauses targets
const lv = ev({ t: 'leave', ts: T('2026-10-01', 9), from: '2026-10-02', to: '2026-10-03', reason: 'exams' });
D = G.derive([...base, l1, lv], T('2026-10-02', 9)); t = D.byId.get(1);
near(t.target, 7, 'leave day: only carried 7 remains? plan did not grow'); 
const pf0 = G.derive([...base], T('2026-10-01', 10)).byId.get(1).planFinishN, pf1 = D.byId.get(1).planFinishN;
ok(pf1 - pf0 === 2, 'leave pushes plan finish by 2 days: ' + (pf1 - pf0));
ok(D.byId.get(1).slip >= 2, 'leave is charged as slip');
// replan spreads backlog
const rp = ev({ t: 'replan', ts: T('2026-10-03', 9), goal: 1, day: '2026-10-03', spread: 7 });
D = G.derive([...base, l1, rp], T('2026-10-03', 9)); t = D.byId.get(1);
ok(t.target < 37 && t.target >= 15, 'replan reduces today target: ' + t.target); ok(t.ledger.length === 1 && t.ledger[0].backlog > 0, 'ledger entry');
// thesis buffer
D = G.derive([...base, l1], T('2026-10-10', 9));
ok(D.thesis && D.thesis.slip > 0 && D.thesis.buffer < D.thesis.planned, 'thesis buffer shrinks: ' + JSON.stringify([D.thesis.slip, D.thesis.buffer, D.thesis.planned]));
ok(D.jrf.planned === undefined && D.jrf.endN - D.jrf.targetN > 360, 'fifth year ~365');
// deadline cannot move after day one
const ed = ev({ t: 'goal', op: 'edit', ts: T('2026-10-05', 9), gid: 1, f: { deadline0: '2026-12-31' } });
D = G.derive([...base, ed], T('2026-10-06', 9)); ok(D.goals.get(1).deadline0 === '2026-10-17', 'deadline locked');
// preview + perDayFor
const pv = G.planPreview({ total: 250, perDay: 15, days: ALL, start: '2026-10-01' }, new Set(), '2026-10-01'); ok(pv.finish === '2026-10-17', 'preview finish ' + pv.finish);
near(G.perDayFor({ total: 250, days: ALL, start: '2026-10-01' }, '2026-10-17', new Set(), '2026-10-01'), 250 / 17, 'perDayFor');
// void log
const vv = ev({ t: 'void', ts: T('2026-10-02', 10), target: l1.id });
D = G.derive([...base, l1, vv], T('2026-10-02', 9)); near(D.byId.get(1).target, 30, 'void log restores backlog');
// life
const lg = ev({ t: 'goal', op: 'add', ts: T('2026-10-01', 9), g: { id: 20, kind: 'life', title: 'Family', cat: 'Marriage' } });
const ms = ev({ t: 'goal', op: 'add', ts: T('2026-10-01', 9), g: { id: 21, kind: 'ms', parent: 20, title: 'Talk to family', due: '2026-10-20' } });
const dd = ev({ t: 'done', ts: T('2026-10-05', 9), goal: 21, day: '2026-10-05' });
D = G.derive([...base, lg, ms], T('2026-10-10', 9)); ok(D.life[0].ms[0].daysLeft === 10 && !D.life[0].ms[0].done, 'life milestone');
D = G.derive([...base, lg, ms, dd], T('2026-10-10', 9)); ok(D.life[0].doneCount === 1, 'milestone done');

// ---- outline: phases, chapters, items, derived plans ----
{
  const g = (id, o) => ev({ t: 'goal', op: 'add', ts: T('2026-10-01', 9), g: Object.assign({ id }, o) });
  const evs = [cfg,
    g(100, { kind: 'project', title: 'Drafting', isPhase: true, phase: 'drafting' }),
    g(101, { kind: 'project', title: 'Chapter 3', parent: 100, phase: 'drafting', thesis: true }),
    g(102, { kind: 'project', title: 'Part 2: Analysis', parent: 101, phase: 'drafting' }),
    g(103, { kind: 'project', title: 'Theme 1', parent: 102, phase: 'drafting' }),
    g(104, { kind: 'item', title: 'Definition', parent: 103, unit: 'words', total: 400 }),
    g(105, { kind: 'item', title: 'Instances and Ramifications', parent: 103, unit: 'words', total: 1000 }),
    g(106, { kind: 'item', title: 'Theoretical Application', parent: 103, unit: 'words', total: 800 }),
    g(107, { kind: 'task', title: 'Draft Theme 1', parent: 103, over: 103, unit: 'words', perDay: 220, days: ALL, start: '2026-10-01', deadline0: '2026-10-10' }),
    g(108, { kind: 'project', title: 'Part 3', parent: 101, phase: 'drafting' }),
    g(109, { kind: 'item', title: 'Synthesis', parent: 108, unit: 'words', total: 2000 })];
  let D = G.derive(evs, T('2026-10-01', 10));
  const th = D.byId.get(107);
  ok(th && th.derived && th.total === 2200, 'derived task total = items under node: ' + (th && th.total));
  near(th.target, 220, 'derived target day1'); ok(th.next && th.next.title === 'Definition', 'next up is Definition');
  // log 400 words against Definition on day 1 -> ahead (220 planned)
  const l = ev({ t: 'log', ts: T('2026-10-01', 18), goal: 104, qty: 400, day: '2026-10-01' });
  D = G.derive([...evs, l], T('2026-10-02', 9));
  const t2 = D.byId.get(107);
  near(t2.done, 400, 'derived done from item logs'); ok(G.derive([...evs, l], T('2026-10-01', 20)).byId.get(107).status === 'ahead', 'derived ahead same day');
  ok(t2.next.title === 'Instances and Ramifications', 'next item advances');
  const p = D.pById.get(103); near(p.pct, 400 / 2200, 'theme pct');
  const ch = D.pById.get(101); ok(ch.chapter === true && ch.total === 4200, 'chapter total includes synthesis: ' + ch.total);
  ok(D.pById.get(100).isPhase && D.pById.get(100).chapter === false, 'phase is not a chapter');
  // synthesis is not covered by any plan
  const u = D.uncovered.get(101); ok(u && u.total === 2000 && u.count === 1, 'uncovered words reported');
  // thesis counts chapters only
  ok(D.thesis.projects.length === 1 && D.thesis.projects[0].id === 101, 'thesis counts chapter-level only');
  // recursive delete
  const del = ev({ t: 'goal', op: 'del', ts: T('2026-10-02', 10), gid: 102 });
  D = G.derive([...evs, del], T('2026-10-02', 11)); ok(!D.goals.has(104) && !D.goals.has(107) && D.goals.has(108), 'recursive delete');
  // behind on derived plan carries
  D = G.derive(evs, T('2026-10-03', 9)); const t3 = D.byId.get(107); near(t3.target, 660, 'derived carry accumulates: 3 days x 220'); 
  // addmany
  const am = ev({ t: 'goal', op: 'addmany', ts: T('2026-10-01', 9), gs: [{ id: 200, kind: 'project', title: 'X' }, { id: 201, kind: 'item', title: 'Y', parent: 200, total: 10, unit: 'words' }] });
  D = G.derive([cfg, am], T('2026-10-02', 9)); ok(D.goals.has(200) && D.items.get(201).total === 10 && D.nextGoalId === 202, 'addmany');
}
console.log(n - bad + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
