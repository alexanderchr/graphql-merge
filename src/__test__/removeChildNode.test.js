import test from 'ava';
import { Kind } from 'graphql';

import removeChildNode from '../removeChildNode';

test('removes a definition from a document', (t) => {
  const operationDefinition = { kind: Kind.OPERATION_DEFINITION, operation: 'query' };
  const document = { kind: Kind.DOCUMENT, definitions: [operationDefinition, {}] };
  const newDocument = removeChildNode(document, operationDefinition);

  t.is(newDocument.definitions.length, 1);
});

test('removes a selection from an operation definition', (t) => {
  const field = { kind: Kind.FIELD };
  const operationDefinition = {
    kind: Kind.OPERATION_DEFINITION,
    selectionSet: { selections: [field, {}] },
  };
  const newOperationDefinition = removeChildNode(operationDefinition, field);

  t.is(newOperationDefinition.selectionSet.selections.length, 1);
});

test('removes a selection from a field', (t) => {
  const selection = { kind: Kind.FIELD };
  const field = {
    kind: Kind.FIELD,
    selectionSet: { selections: [selection, {}] },
  };
  const newField = removeChildNode(field, selection);

  t.is(newField.selectionSet.selections.length, 1);
});

test('removes a selection from an inline fragment', (t) => {
  const selection = { kind: Kind.INLINE_FRAGMENT };
  const fragment = {
    kind: Kind.INLINE_FRAGMENT,
    selectionSet: { selections: [selection, {}] },
  };
  const newFragment = removeChildNode(fragment, selection);

  t.is(newFragment.selectionSet.selections.length, 1);
});
