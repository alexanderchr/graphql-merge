import isMergable from './isMergable';
import getAllChildNodes from './getAllChildNodes';
import findSimilarChildNode from './findSimilarChildNode';
import addChildNode from './addChildNode';
import replaceChildNode from './replaceChildNode';

export default function merge(a, b) {
  if (!isMergable(a, b)) {
    // TODO: make this a bit more informative
    throw new Error('Two nodes are not mergable');
  }

  let destination = a;

  const nodesToCopy = getAllChildNodes(b);
  for (const node of nodesToCopy) {
    const similarNodeInDestination = findSimilarChildNode(destination, node);

    if (similarNodeInDestination) {
      const mergedNode = merge(similarNodeInDestination, node);
      destination = replaceChildNode(destination, similarNodeInDestination, mergedNode);
    } else {
      destination = addChildNode(destination, node);
    }
  }

  return destination;
}
