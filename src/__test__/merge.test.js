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
  const a = parse('{ users { name } }');
  const b = parse('{ users { address something } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), '{ users { name address something } }');
});

test('does not add same field twice', (t) => {
  const a = parse('{ users { name } }');
  const b = parse('{ users { name address } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), '{ users { name address } }');
});

test('throw when merging two different operations', (t) => {
  const a = parse('query { users { name address } }');
  const b = parse('mutation { addUser }');

  t.throws(() => merge(a, b));
});

// replaces test below
test.skip('removes operation name when two named operations are merged', (t) => {
  const a = parse('query VeryGood { users { name address } }');
  const b = parse('query Important { users { name address } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), 'query { users { name address } }');
});

test('merges operations with different names', (t) => {
  const a = parse('query VeryGood { users { name address } }');
  const b = parse('query Important { users { name address } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), 'query VeryGood { users { name address } }');
});

test('merges deeply', (t) => {
  const a = parse('{ users { address { firstLine } } }');
  const b = parse('{ users { address { secondLine } email } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    '{ users { address { firstLine secondLine } email } }'
  );
});

test('throws when given two fragments with the same name', (t) => {
  const a = parse('fragment Something on User { address }');
  const b = parse('fragment Something on Person { name }');

  t.throws(() => merge(a, b));
});

test('merges inline fragments', (t) => {
  const a = parse('query { users { ... on User { address } } }');
  const b = parse('query { users { ... on User { name phone } } }');

  const mergeResult = merge(a, b);
  t.is(notSoPrettyPrintQuery(mergeResult), '{ users { ... on User { address name phone } } }');
});

test('throws when merging a selection without sub-selections with one with', (t) => {
  const a = parse('query { users { address { firstLine } } }');
  const b = parse('query { users { address } }');

  t.throws(() => merge(a, b));
});
