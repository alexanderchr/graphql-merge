import getAllChildNodes from './getAllChildNodes';
import findSimilarChildNode from './findSimilarChildNode';
import addChildNode from './addChildNode';
import removeChildNode from './removeChildNode';

export default function merge(a, b) {
  if (a.kind !== b.kind) {
    throw new Error('Root elements are of different kinds');
  }

  // TODO: also shallow clone the references to child nodes
  let destination = Object.assign({}, a);

  const nodesToCopy = getAllChildNodes(b);
  for (const node of nodesToCopy) {
    const similarNodeInDestination = findSimilarChildNode(destination, node);

    if (similarNodeInDestination) {
      const mergedNode = merge(similarNodeInDestination, node);
      destination = removeChildNode(destination, similarNodeInDestination);
      destination = addChildNode(destination, mergedNode);
    } else {
      destination = addChildNode(destination, node);
    }
  }

  return destination;
}
