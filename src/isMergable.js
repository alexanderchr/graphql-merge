import { Kind } from 'graphql';

export default function isMergable(a, b) {
  if (a.kind !== b.kind) {
    return false;
  }

  if (a.kind === Kind.FRAGMENT_DEFINITION) {
    return false;
  }

  // There can only be one kind of operation because we want there to be just one operation
  if (a.operation !== b.operation) {
    return false;
  }

  if ((a.selectionSet === null && b.selectionSet !== null)
    || (a.selectionSet !== null && b.selectionSet === null)) {
    return false;
  }

  return true;
}
