import { Kind } from 'graphql';

export default function getAllNodes(parent) {
  switch (parent.kind) {
    case Kind.DOCUMENT:
      return parent.definitions;

    case Kind.OPERATION_DEFINITION:
    case Kind.FIELD:
    case Kind.INLINE_FRAGMENT:
      return parent.selectionSet && parent.selectionSet.selections;

    default:
      return [];
  }
}
