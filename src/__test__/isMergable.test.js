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
