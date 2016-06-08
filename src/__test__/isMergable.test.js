import test from 'ava';
import { Kind } from 'graphql';
import isMergable from '../isMergable';

test('is true when a and b is mergable', (t) => {
  const a = { kind: Kind.FIELD, name: 'testfield' };
  const b = { kind: Kind.FIELD, name: 'testfield' };
  t.true(isMergable(a, b));
});

test('is false when a and b are of different kinds', (t) => {
  const a = { kind: Kind.OPERATION_DEFINITION };
  const b = { kind: Kind.FIELD };
  t.false(isMergable(a, b));
});

test('is false when a and b are operation definitions with different operations', (t) => {
  const a = { kind: Kind.OPERATION_DEFINITION, operation: 'query' };
  const b = { kind: Kind.OPERATION_DEFINITION, operation: 'mutation' };
  t.false(isMergable(a, b));
});
