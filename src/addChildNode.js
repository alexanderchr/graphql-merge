import { Kind } from 'graphql';

// TODO: This approach leads to a lot of unnecesscary cloning. The function is only used within
// the loop of `merge` and the node collections might as well be mutated within that function,
// as long as they are shallow-copied early in that function
export default function addChildNode(parent, node) {
  switch (parent.kind) {
    case Kind.DOCUMENT:
      return {
        ...parent,
        definitions: [
          ...parent.definitions,
          node,
        ],
      };

    case Kind.OPERATION_DEFINITION:
    case Kind.INLINE_FRAGMENT:
    case Kind.FIELD:
      return {
        ...parent,
        selectionSet: {
          ...parent.selectionSet,
          selections: [...parent.selectionSet.selections, node],
        },
      };

    default:
      return undefined;
  }
}
