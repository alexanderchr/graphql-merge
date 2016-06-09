import isMergable from './isMergable';
import getAllChildNodes from './getAllChildNodes';
import findSimilarChildNode from './findSimilarChildNode';
import addChildNode from './addChildNode';
import removeChildNode from './removeChildNode';

export default function merge(a, b) {
  if (!isMergable(a, b)) {
    // TODO: make this a bit more informative
    throw new Error('Two nodes are not mergable');
  }

  // TODO: also shallow clone the references to child nodes
  let destination = Object.assign({}, a);

  const nodesToCopy = getAllChildNodes(b) || [];
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
