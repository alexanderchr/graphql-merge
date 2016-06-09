import getAllChildNodes from './getAllChildNodes';

export default function isMergable(a, b) {
  if (a.kind !== b.kind) {
    return false;
  }

  // There can only be one kind of operation because we want there to be just one operation
  if (a.operation !== b.operation) {
    return false;
  }

  // TODO: Conflicting variables. OK to just throw for now. Later we want to either assign aliases
  // or rewrite variable names.

  const nodesOfA = getAllChildNodes(a);
  const nodesOfB = getAllChildNodes(b);
  if ((nodesOfA === null && nodesOfB !== null) || (nodesOfA !== null && nodesOfB === null)) {
    return false;
  }

  return true;
}
