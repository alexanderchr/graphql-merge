import test from 'ava';
import { Kind, parse } from 'graphql';
import isMergable from '../isMergable';

test('true when a and b is mergable', (t) => {
  const field = parse('{ user { name address } }').definitions[0].selectionSet.selections[0];
  const a = field.selectionSet.selections[0];
  const b = field.selectionSet.selections[1];
  t.true(isMergable(a, b));
});

test('false when a and b are of different kinds', (t) => {
  const a = { kind: Kind.OPERATION_DEFINITION };
  const b = { kind: Kind.FIELD };
  t.false(isMergable(a, b));
});

test('false when a and b are operation definitions with different operations', (t) => {
  const document = parse('{ user { name } } mutation { addUser }');
  const a = document.definitions[0];
  const b = document.definitions[1];
  t.false(isMergable(a, b));
});

test('is false when a and b has inconsistent selections', (t) => {
  const a = parse('{ user { name } }').definitions[0].selectionSet.selections[0];
  const b = parse('{ user }').definitions[0].selectionSet.selections[0];
  t.false(isMergable(a, b));
});

test('false when a and b are fragment definitions', (t) => {
  const a = parse('fragment UserDetails on User { company }').definitions[0];
  const b = parse('fragment UserDetails on User { lastName }').definitions[0];
  t.false(isMergable(a, b));
});

// test('true when a and b has equal variables', (t) => {
//   const a = parse('query($username : String) { user }').definitions[0];
//   const b = parse('query($username : String) { user }').definitions[0];
//   t.false(isMergable(a, b));
// });
//
// test('false when a and b has variables with same name but different inner types', (t) => {
//   const a = parse('query($username : Number!) { user }').definitions[0];
//   const b = parse('query($username2 : String!) { user }').definitions[0];
//   t.false(isMergable(a, b));
// });
//
// test('false when a and b has variables with conflicting types', (t) => {
//   const a = parse('query($username : String) { user }').definitions[0];
//   const b = parse('query($username : Number) { user }').definitions[0];
//   t.false(isMergable(a, b));
// });
//
// test('false when a and b has variables with conflicting inner types', (t) => {
//   const a = parse('query($username : Number!) { user }').definitions[0];
//   const b = parse('query($username : String!) { user }').definitions[0];
//   t.false(isMergable(a, b));
// });
