import { visit } from 'graphql';

export default function replaceChildNode(parent, nodeToReplace, replacingNode) {
  let first = true;
  return visit(parent, {
    enter(visitedNode) {
      if (first) {
        first = false;
        return undefined;
      }

      if (visitedNode === nodeToReplace) {
        return replacingNode;
      }

      // don't walk further down the tree as we are only operating on direct children
      return false;
    },
  });
}
