import test from 'ava';
import { Kind } from 'graphql';

import getAllChildNodes from '../getAllChildNodes';

test('gets all definitions of a document', (t) => {
  const definitions = [
    { kind: Kind.OPERATION_DEFINITION, loc: '653' },
    { kind: Kind.OPERATION_DEFINITION, loc: '21' },
    { kind: Kind.OPERATION_DEFINITION, loc: '32' },
  ];

  const document = {
    kind: Kind.DOCUMENT,
    definitions,
  };

  t.deepEqual(getAllChildNodes(document), definitions);
});

test('gets all selections of an operation definition', (t) => {
  const selections = [
    { kind: Kind.FIELD, loc: '12' },
    { kind: Kind.FIELD, loc: '34' },
  ];

  const operationDefinition = {
    kind: Kind.OPERATION_DEFINITION,
    selectionSet: { selections },
  };

  t.deepEqual(getAllChildNodes(operationDefinition), selections);
});

test('gets all selections of a field', (t) => {
  const selections = [
    { kind: Kind.FIELD, loc: '4' },
    { kind: Kind.FIELD, loc: '3' },
  ];

  const field = {
    kind: Kind.FIELD,
    selectionSet: { selections },
  };

  t.deepEqual(getAllChildNodes(field), selections);
});

test('gets all selections of an inline fragment', (t) => {
  const selections = [
    { kind: Kind.FIELD, loc: '4' },
    { kind: Kind.FIELD, loc: '3' },
  ];

  const inlineFragment = {
    kind: Kind.INLINE_FRAGMENT,
    selectionSet: { selections },
  };

  t.deepEqual(getAllChildNodes(inlineFragment), selections);
});
