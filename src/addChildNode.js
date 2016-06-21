import { Kind } from 'graphql';

// This is really dependent on the implementation of graphql-js
export default function addChildNode(parent, node) {
  switch (node.kind) {
    case Kind.OPERATION_DEFINITION:
      return {
        ...parent,
        definitions: [
          ...parent.definitions,
          node,
        ],
      };

    case Kind.SELECTION_SET:
      return {
        ...parent,
        selectionSet: node,
      };

    case Kind.INLINE_FRAGMENT:
    case Kind.FIELD:
      return {
        ...parent,
        selections: [
          ...parent.selections,
          node,
        ],
      };

    case Kind.VARIABLE_DEFINITION:
      return {
        ...parent,
        variableDefinitions: [
          ...parent.variableDefinitions,
          node,
        ],
      }

    default:
      return undefined;
  }
}
