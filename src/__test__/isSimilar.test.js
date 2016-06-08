import test from 'ava';
import { Kind, parse } from 'graphql';

import isSimilar from '../isSimilar';

// Document

test('false given two nodes of different kinds', (t) => {
  const document = { kind: Kind.DOCUMENT };
  const operationDefinition = { kind: Kind.OPERATION_DEFINITION };

  t.false(isSimilar(document, operationDefinition));
});

test('true given two any two documents', (t) => {
  const documentA = parse('query { user }');
  const documentB = parse('query { user }');

  t.true(isSimilar(documentA, documentB));
});

// Operation definition

test('true given any two operation definitions', (t) => {
  const documentA = parse('query User { user }');
  const documentB = parse('query User { user }');

  t.true(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

// Field

test('true given two fields of same name without arguments or alias', (t) => {
  const fieldA = parse('query User { user }').definitions[0].selectionSet.selections[0];
  const fieldB = parse('query User { user }').definitions[0].selectionSet.selections[0];

  t.true(isSimilar(fieldA, fieldB));
});

test('false given two fields with different name', (t) => {
  const fieldA = parse('query User { user }').definitions[0].selectionSet.selections[0];
  const fieldB = parse('query User { user2 }').definitions[0].selectionSet.selections[0];

  t.false(isSimilar(fieldA, fieldB));
});

test('false given two fields with same name but different alias', (t) => {
  const fieldA = parse('query User { user }').definitions[0].selectionSet.selections[0];
  const fieldB = parse('query User { user2: user }').definitions[0].selectionSet.selections[0];
  t.false(isSimilar(fieldA, fieldB));
});

test('false given two fields with different arguments', (t) => {
  const fieldA = parse('query User { user }').definitions[0].selectionSet.selections[0];
  const fieldB = parse('query User { user(argument: "yes") }')
    .definitions[0].selectionSet.selections[0];

  t.false(isSimilar(fieldA, fieldB));
});

test('false given two fields with same arguments but different values', (t) => {
  const fieldA = parse('query User { user(argument: "no") }')
    .definitions[0].selectionSet.selections[0];
  const fieldB = parse('query User { user(argument: "yes") }')
    .definitions[0].selectionSet.selections[0];

  t.false(isSimilar(fieldA, fieldB));
});

test('false given two fields with same arguments but different variables', (t) => {
  const fieldA = parse('query User { user(argument: $no) }')
    .definitions[0].selectionSet.selections[0];
  const fieldB = parse('query User { user(argument: $yes) }')
    .definitions[0].selectionSet.selections[0];

  t.false(isSimilar(fieldA, fieldB));
});
