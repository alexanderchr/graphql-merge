import test from 'ava';
import { parse } from 'graphql';

import getAllChildNodes from '../getAllChildNodes';

test('gets all definitions of a document', (t) => {
  const document = parse('query { users } mutation { addUser }');

  const childNodes = getAllChildNodes(document);
  t.is(childNodes.length, 2);
  t.deepEqual(childNodes[0], document.definitions[0]);
  t.deepEqual(childNodes[1], document.definitions[1]);
});

test('gets selection set of an operation definition', (t) => {
  const operationDefinition = parse('query { users companies }').definitions[0];

  const childNodes = getAllChildNodes(operationDefinition);
  t.is(childNodes.length, 1);
  t.deepEqual(childNodes[0], operationDefinition.selectionSet);
});

test('gets all selections of a selection set', (t) => {
  const selectionSet = parse('query { users companies }').definitions[0].selectionSet;

  const childNodes = getAllChildNodes(selectionSet);
  t.is(childNodes.length, 2);
  t.is(childNodes[0].name.value, 'users');
  t.is(childNodes[1].name.value, 'companies');
});

test('gets selection set of a field', (t) => {
  const field = parse('query { users { name } }').definitions[0].selectionSet.selections[0];

  const childNodes = getAllChildNodes(field);
  t.is(childNodes.length, 1);
  t.deepEqual(childNodes[0], field.selectionSet);
});

test('gets selection set of an inline fragment', (t) => {
  const fragment =
    parse('query { ... on User { name } }').definitions[0].selectionSet.selections[0];

  const childNodes = getAllChildNodes(fragment);
  t.is(childNodes.length, 1);
  t.deepEqual(childNodes[0], fragment.selectionSet);
});
