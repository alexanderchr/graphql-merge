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

test('adds a selection to an operation definition', (t) => {
  const operationDefinition = parse('query { users { name } }').definitions[0];
  const selection = { kind: Kind.FIELD };
  const newOperationDefinition = addChildNode(operationDefinition, selection);

  t.true(newOperationDefinition.selectionSet.selections.includes(selection));
  t.is(newOperationDefinition.selectionSet.selections.length, 2);
});

test('adds a selection to a field', (t) => {
  const field = parse('query { users { name } }')
    .definitions[0].selectionSet.selections[0];
  const selection = { kind: Kind.FIELD };
  const newField = addChildNode(field, selection);

  t.true(newField.selectionSet.selections.includes(selection));
  t.is(newField.selectionSet.selections.length, 2);
});
