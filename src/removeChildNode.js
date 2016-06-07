import { Kind } from 'graphql';

export default function removeChildNode(parent, node) {
  switch (parent.kind) {
    case Kind.DOCUMENT:
      return {
        ...parent,
        definitions: parent.definitions.filter(x => x !== node),
      };

    case Kind.OPERATION_DEFINITION:
    case Kind.FIELD:
      return {
        ...parent,
        selectionSet: {
          ...parent.selectionSet,
          selections: parent.selectionSet.selections.filter(x => x !== node),
        },
      };

    default:
      return undefined;
  }
}
