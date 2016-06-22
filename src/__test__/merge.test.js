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

test('throws when merging two different operations', (t) => {
  const a = parse('query { users { name address } }');
  const b = parse('mutation { addUser }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    '{ users { name address } } mutation { addUser }'
  );
});

test('does not merge operations with different names', (t) => {
  const a = parse('query VeryGood { users { name address } }');
  const b = parse('query Important { users { name address } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    'query VeryGood { users { name address } } query Important { users { name address } }'
  );
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

test('merges fields with identical arguments', (t) => {
  const a = parse('{ users(first: 10) { address } }');
  const b = parse('{ users(first: 10) { email } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    '{ users(first: 10) { address email } }'
  );
});

test('merges fields with differing arguments when values are variables', (t) => {
  const a = parse('query ($a: String) { users(first: $a) { address } }');
  const b = parse('query ($a: String) { users(first: $a) { email } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    'query ($a: String) { users(first: $a) { address email } }'
  );
});

test('does not merge fields with differing arguments', (t) => {
  const a = parse('{ users(first: 5) { address } }');
  const b = parse('{ users(first: 10) { email } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    '{ users(first: 5) { address } users(first: 10) { email } }'
  );
});

test('does not merge fields with differing arguments when values are variables', (t) => {
  const a = parse('query ($a: String) { users(first: $a) { address } }');
  const b = parse('query ($b: String) { users(first: $b) { email } }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    'query ($a: String, $b: String) { users(first: $a) { address } users(first: $b) { email } }'
  );
});

test('merges operations with equal variable definitions', (t) => {
  const a = parse('query($name: String!) { users }');
  const b = parse('query($name: String!) { companies }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    'query ($name: String!) { users companies }'
  );
});

test('merges operations with non-clashing variable definitions', (t) => {
  const a = parse('query($name: String!) { users }');
  const b = parse('query($lastName: String) { users }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    'query ($name: String!, $lastName: String) { users }'
  );
});

test('does not merge two operations with clashing variable definitions', (t) => {
  const a = parse('query($name: String!) { users }');
  const b = parse('query($name: String) { users }');

  const mergeResult = merge(a, b);
  t.is(
    notSoPrettyPrintQuery(mergeResult),
    'query ($name: String!) { users } query ($name: String) { users }'
  );
});

test('throws given two fragments with the same name', (t) => {
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
