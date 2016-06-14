import { visit, Kind } from 'graphql';

const FILTERED_KINDS = [Kind.NAME, Kind.NAMED_TYPE, Kind.ENUM];

export default function getAllChildNodes(parent) {
  const nodes = [];
  let first = true;
  visit(parent, {
    enter(node) {
      if (FILTERED_KINDS.includes(node.kind)) {
        return false;
      }

      if (first) {
        first = false;
        return undefined;
      }

      nodes.push(node);
      return false;
    },
  });

  return nodes;
}
