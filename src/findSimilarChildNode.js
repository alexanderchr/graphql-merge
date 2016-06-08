import getAllChildNodes from './getAllChildNodes';
import isSimilar from './isSimilar';

export default function findSimilarChildNode(parent, node) {
  const candidateNodes = getAllChildNodes(parent);
  for (const candidateNode of candidateNodes) {
    if (isSimilar(node, candidateNode)) {
      return candidateNode;
    }
  }
  return null;
}
