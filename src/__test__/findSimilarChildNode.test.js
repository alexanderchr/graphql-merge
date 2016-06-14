import test from 'ava';
import { parse, Kind } from 'graphql';

import findSimilarChildNode from '../findSimilarChildNode';

test('returns null when there is no similar child node', (t) => {
  const parent = parse('query { users }');
  const similarNode = findSimilarChildNode(parent.definitions[0], {
    kind: Kind.FIELD,
    alias: null,
    name: { value: 'employers' },
  });
  t.is(similarNode, null);
});

test('returns node from parent when there is a similar child node', (t) => {
  const parent = parse('query { users }');
  const similarNode = findSimilarChildNode(parent.definitions[0], {
    kind: Kind.SELECTION_SET,
  });
  t.is(similarNode, parent.definitions[0].selectionSet);
});
