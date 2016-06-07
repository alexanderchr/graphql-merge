import test from 'ava';
import { parse, print } from 'graphql';

import merge from '../merge';

// print a query and remove newlines and extra spaces to make comparsion easier
function notSoPrettyPrintQuery(query) {
  return print(query)
    .replace(/\n/g, ' ') // replace newlines with a space
    .replace(/\s\s+/g, ' ') // replace multiple spaces with a single space
    .replace(/(^\s|\s$)/, ''); // trim
}

test('merges', (t) => {
  const a = parse('query { users { name } }');
  const b = parse('query { users { address something } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), '{ users { name address something } }');
});

test('does not add same field twice', (t) => {
  const a = parse('query { users { name } }');
  const b = parse('query { users { name address } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), '{ users { name address } }');
});

test('handles multiple definitions', (t) => {
  const a = parse('query { users { name address } }');
  const b = parse('mutation { addUser }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), '{ users { name address } } mutation { addUser }');
});

test('merges deeply', (t) => {
  const a = parse('query { users { address { firstLine } } }');
  const b = parse('query { users { address { secondLine } email } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    '{ users { address { firstLine secondLine } email } }'
  );
});

test.skip('throws when merging a selection without sub-selections with one with', (t) => {
  const a = parse('query { users { address { firstLine } } }');
  const b = parse('query { users { address } }');

  t.throws(() => merge(a, b));
});
