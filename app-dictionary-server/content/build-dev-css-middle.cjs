// CSS module, level MIDDLE (the Middle column of the CSS roadmap). Run: node content/build-dev-css-middle.cjs
// The labs need a real browser to run (web pages/cssLab.ts), so here only their number is checked.
const lab = (title, task, setup, solution, tests, hint) => ({
  title, task, starter: '/* CSS ni shu yerga yozing */\n', solution, tests: tests.map(([call, expect]) => ({ call, expect: JSON.stringify(expect) })), hint, kind: 'css', setup,
});
const labs = {};
['./css-mid-labs1.cjs', './css-mid-labs2.cjs', './css-mid-labs3.cjs'].forEach((p) => Object.assign(labs, require(p)(lab)));
require('./dev-middle.cjs')('css', 'fe-css-md', ['./css-mid-part1.cjs', './css-mid-part2.cjs', './css-mid-part3.cjs'], labs);
