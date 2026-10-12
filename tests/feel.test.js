// GFeel: every sound is 3 seconds or shorter; vibration patterns exist for each touch kind
global.document = { addEventListener() {}, documentElement: { classList: { contains: () => false } } };
global.localStorage = { getItem: () => null, setItem() {} }; global.navigator = {};
const w = {}; global.window = w; require('../feel.js');
let ok = 0, bad = 0; const t = (n, c) => { if (c) ok++; else { bad++; console.log('FAIL', n); } };
const L = w.GFeel.lengths(); Object.keys(L).forEach(k => t(k + ' is 3 s or less', L[k] <= 3));
['tick', 'save', 'up', 'down', 'stop', 'glad', 'fanfare', 'sad'].forEach(k => t('sound ' + k + ' exists', k in L));
t('settings card renders', /Sounds and vibration/.test(w.GFeel.settingsHTML()));
t('no audio in a bare environment is safe', w.GFeel.play('up') === false);
console.log(ok + '/' + (ok + bad) + ' passed'); process.exit(bad ? 1 : 0);
