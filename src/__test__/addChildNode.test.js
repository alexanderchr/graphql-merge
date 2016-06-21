import test from 'ava';
import { parse, Kind } from 'graphql';
import addChildNode from '../addChildNode';

test('adds a definition to a document', (t) => {
  const document = parse('query { users }');
  const operationDefinition = { kind: Kind.OPERATION_DEFINITION };
  const newDocument = addChildNode(document, operationDefinition);

  t.true(newDocument.definitions.includes(operationDefinition));
  t.is(newDocument.definitions.length, 2);
});

test('adds a selection set to an operation definition', (t) => {
  const operationDefinition = parse('query { users { name } }').definitions[0];
  const selectionSet = { kind: Kind.SELECTION_SET };
  const newOperationDefinition = addChildNode(operationDefinition, selectionSet);

  t.is(newOperationDefinition.selectionSet, selectionSet);
});

test('adds a field to a selection set', (t) => {
  const selectionSet = parse('query { users { name } }').definitions[0].selectionSet;
  const field = { kind: Kind.FIELD };
  const newSelectionSet = addChildNode(selectionSet, field);

  t.true(newSelectionSet.selections.includes(field));
  t.is(newSelectionSet.selections.length, 2);
});

test('adds inline fragments to a selection set', (t) => {
  const selectionSet = parse('query { users { name } }').definitions[0].selectionSet;
  const inlineFragment = { kind: Kind.INLINE_FRAGMENT };
  const newSelectionSet = addChildNode(selectionSet, inlineFragment);

  t.true(newSelectionSet.selections.includes(inlineFragment));
  t.is(newSelectionSet.selections.length, 2);
});

test('adds variable definitions to definition', (t) => {
  const definition = parse('query($name: String) { users }').definitions[0];
  const variableDefinition = { kind: Kind.VARIABLE_DEFINITION };
  const newDefinition = addChildNode(definition, variableDefinition);

  t.true(newDefinition.variableDefinitions.includes(variableDefinition));
  t.is(newDefinition.variableDefinitions.length, 2);
});
