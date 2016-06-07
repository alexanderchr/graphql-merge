import getAllChildNodes from './getAllChildNodes';
import isSimilar from './isSimilar';

export default function findSimilarChildNode(parent, node) {
  const candidateNodes = getAllChildNodes(parent);
  for (const candidateNode of candidateNodes) {
    if (isSimilar(node, candidateNode)) {
      // throw if a has subselections and b does not, but only if both a and b are fields?
      return candidateNode;
    }
  }
  return null;
}
