// JavaScript module, level MIDDLE. Run: node content/build-dev-js-middle.cjs
// Every lab is run first: the solution must pass and the starter must not (lab-check.cjs).
const lab = (title, task, starter, solution, tests, hint) => ({ title, task, starter, solution, tests: tests.map(([call, expect]) => ({ call, expect })), hint });
const labs = {};
['./js-mid-labs1.cjs', './js-mid-labs2.cjs', './js-mid-labs3.cjs'].forEach((p) => Object.assign(labs, require(p)(lab)));
require('./lab-check.cjs')(labs)
  .then((checked) => {
    console.log('checked', checked);
    require('./dev-middle.cjs')('javascript', 'fe-js-md', ['./js-mid-part1.cjs', './js-mid-part2.cjs', './js-mid-part3.cjs'], labs);
  })
  .catch((e) => { console.error(e.message); process.exit(1); });
