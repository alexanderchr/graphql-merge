import test from 'ava';
import { Kind, parse } from 'graphql';

import replaceChildNode from '../replaceChildNode';

test('replaces a definition in a document', (t) => {
  const document = parse('query { users }');
  const definition = { kind: Kind.OPERATION_DEFINITION };
  const newDocument = replaceChildNode(document, document.definitions[0], definition);

  t.is(newDocument.definitions.length, 1);
  t.is(newDocument.definitions[0], definition);
});

test('replaces a field in a selection set', (t) => {
  const selectionSet = parse('query { users }').definitions[0].selectionSet;
  const field = { kind: Kind.FIELD };
  const newSelectionSet = replaceChildNode(selectionSet, selectionSet.selections[0], field);

  t.is(newSelectionSet.selections[0], field);
});
