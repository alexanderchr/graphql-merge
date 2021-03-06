import test from 'ava';
import { Kind, parse } from 'graphql';

import isSimilar from '../isSimilar';

test('false given two nodes of different kinds', (t) => {
  const document = { kind: Kind.DOCUMENT };
  const operationDefinition = { kind: Kind.OPERATION_DEFINITION };

  t.false(isSimilar(document, operationDefinition));
});

// Document

test('true given two any two documents', (t) => {
  const documentA = parse('query { user }');
  const documentB = parse('query { user }');

  t.true(isSimilar(documentA, documentB));
});

// Operation definition

test('true given two operation definitions without names', (t) => {
  const documentA = parse('query { user }');
  const documentB = parse('query { user }');

  t.true(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

test('true given two operation definitions with equal names', (t) => {
  const documentA = parse('query User { user }');
  const documentB = parse('query User { user }');

  t.true(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

test('false given two operation definitions with different names', (t) => {
  const documentA = parse('query User { user }');
  const documentB = parse('query User2 { user }');

  t.false(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

test('false given two operation definitions with different operations', (t) => {
  const documentA = parse('query User { user }');
  const documentB = parse('mutation User { user }');

  t.false(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

test('true given two operation definitions with equal variable definitions', (t) => {
  const documentA = parse('query User($name: String) { user }');
  const documentB = parse('query User($name: String) { user }');

  t.true(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

test('true given two operation definitions with complementing variable definitions', (t) => {
  const documentA = parse('query User($name: String) { user }');
  const documentB = parse('query User($name: String) { user }');

  t.true(isSimilar(documentA.definitions[0], documentB.definitions[0]));
});

test('false given two operation definitions with clashing variable definitions', (t) => {
  const documentA = parse('query User($name: String!) { user }');
  const documentB = parse('query User($name: String) { user }');

  t.false(isSimilar(documentA.definitions[0], documentB.definitions[0]));
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

// Fragment definition

test('true given two fragment definitions with same name', (t) => {
  const fragmentA = parse('fragment UserDetails on User { name }').definitions[0];
  const fragmentB = parse('fragment UserDetails on User { company }').definitions[0];

  t.true(isSimilar(fragmentA, fragmentB));
});

test('false given two fragment definitions with different names', (t) => {
  const fragmentA = parse('fragment UserDetails on User { name }').definitions[0];
  const fragmentB = parse('fragment UserContactDetails on User { phone }').definitions[0];

  t.false(isSimilar(fragmentA, fragmentB));
});

// Inline fragment

test('true given two inline fragments with same type definitions', (t) => {
  const fragmentA = parse('{ ... on User { name } }')
    .definitions[0].selectionSet.selections[0];
  const fragmentB = parse('{ ... on User { company } }')
    .definitions[0].selectionSet.selections[0];

  t.true(isSimilar(fragmentA, fragmentB));
});

test('false given two inline fragments with different type definitions', (t) => {
  const fragmentA = parse('{ ... on User { name } }')
    .definitions[0].selectionSet.selections[0];
  const fragmentB = parse('{ ... on User2 { company } }')
    .definitions[0].selectionSet.selections[0];

  t.false(isSimilar(fragmentA, fragmentB));
});

// argument

test('true given arguments with same names and same values', (t) => {
  const document = parse('{ users(foo: "bar") employees(foo: "bar") }');

  const argumentA = document.definitions[0].selectionSet.selections[0].arguments[0];
  const argumentB = document.definitions[0].selectionSet.selections[1].arguments[0];

  t.true(isSimilar(argumentA, argumentB));
});

test('false given arguments with same names and different values', (t) => {
  const document = parse('{ users(foo: "bar") employees(foo: "bar2") }');

  const argumentA = document.definitions[0].selectionSet.selections[0].arguments[0];
  const argumentB = document.definitions[0].selectionSet.selections[1].arguments[0];

  t.false(isSimilar(argumentA, argumentB));
});

// variable definition

test('true given variable definitions with same name and same type', (t) => {
  const documentA = parse('query($a: String) { users }');
  const documentB = parse('query($a: String) { users }');

  const variableA = documentA.definitions[0].variableDefinitions[0];
  const variableB = documentB.definitions[0].variableDefinitions[0];

  t.true(isSimilar(variableA, variableB));
});

test('false given variable definitions with different names and same types', (t) => {
  const documentA = parse('query($a: String) { users }');
  const documentB = parse('query($b: String) { users }');

  const variableA = documentA.definitions[0].variableDefinitions[0];
  const variableB = documentB.definitions[0].variableDefinitions[0];

  t.false(isSimilar(variableA, variableB));
});

test('false given variable definitions with same name and different types', (t) => {
  const documentA = parse('query($a: String) { users }');
  const documentB = parse('query($a: Number) { users }');

  const variableA = documentA.definitions[0].variableDefinitions[0];
  const variableB = documentB.definitions[0].variableDefinitions[0];

  t.false(isSimilar(variableA, variableB));
});

test('false given variable definitions with same name and different types', (t) => {
  const documentA = parse('query($a: String!) { users }');
  const documentB = parse('query($a: Number!) { users }');

  const variableA = documentA.definitions[0].variableDefinitions[0];
  const variableB = documentB.definitions[0].variableDefinitions[0];

  t.false(isSimilar(variableA, variableB));
});
