// Builds src/main/resources/dev/frontend-css-junior.json from css-part1..3.cjs
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const h = makeHelpers('css', 'fe-css-jr');
['./css-part1.cjs', './css-part2.cjs', './css-part3.cjs'].forEach((p) => require(p)(h));

// Sanity checks: CHOICE answers must be among options, options unique, FILL answers non-empty.
let items = 0;
h.L.forEach((l) => {
  l.items.forEach((it) => {
    items += 1;
    if (it.kind === 'CHOICE') {
      if (!it.options.includes(it.answer)) throw new Error(`${l.code}#${it.id}: answer not in options`);
      if (new Set(it.options).size !== it.options.length) throw new Error(`${l.code}#${it.id}: duplicate options`);
    }
    if (!it.answer) throw new Error(`${l.code}#${it.id}: empty answer`);
  });
  if (l.items.length < 10) console.warn(`${l.code} has only ${l.items.length} items`);
});

fs.writeFileSync('E:/frontend/app-dictionary/app-dictionary-server/src/main/resources/dev/frontend-css-junior.json', JSON.stringify(h.L, null, 1));
console.log('lessons', h.L.length, 'items', items);
