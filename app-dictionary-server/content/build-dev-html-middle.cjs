// HTML module, level MIDDLE. Run: node content/build-dev-html-middle.cjs
// The labs need a real browser to run (web pages/htmlLab.ts), so here only their number is checked.
// A test is [requirement, call, expected]: the learner sees the requirement, not the call.
const lab = (title, task, starter, solution, tests, hint) => ({
  title, task, starter, solution, tests: tests.map(([label, call, expect]) => ({ label, call, expect: JSON.stringify(expect) })), hint, kind: 'html',
});
const labs = {};
['./html-mid-labs1.cjs', './html-mid-labs2.cjs', './html-mid-labs3.cjs'].forEach((p) => Object.assign(labs, require(p)(lab)));
require('./dev-middle.cjs')('html', 'fe-html-md', ['./html-mid-part1.cjs', './html-mid-part2.cjs', './html-mid-part3.cjs'], labs);
