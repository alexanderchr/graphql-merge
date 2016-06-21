import { Kind } from 'graphql';

export default function isMergable(a, b) {
  if (a.kind !== b.kind) {
    return false;
  }

  if (a.kind === Kind.FRAGMENT_DEFINITION) {
    return false;
  }

  if ((a.selectionSet === null && b.selectionSet !== null)
    || (a.selectionSet !== null && b.selectionSet === null)) {
    return false;
  }

  return true;
}
