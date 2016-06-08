import { Kind } from 'graphql';
import differenceWith from 'lodash.differencewith';

function isArgumentSimilar(a, b) {
  return a.name.value === b.name.value
  && a.value.value === b.value.value // literal values
  && a.value.name.value === b.value.name.value; // variable names
}

// TODO: extend, i.e: `first: 3` and `first: 8` could (with configuration) be reduced to `first: 8`
function isArgumentsSimilar(a, b) {
  // swapping a and b is a dirty hack.
  return differenceWith(a, b, isArgumentSimilar).length === 0
  && differenceWith(b, a, isArgumentSimilar).length === 0;
}

export default function isSimilar(a, b) {
  if (a.kind !== b.kind) {
    return false;
  }
  const kind = a.kind;

  switch (kind) {
    case Kind.DOCUMENT:
      return true;

    case Kind.OPERATION_DEFINITION:
      return true;

    case Kind.FIELD:
      return (a.name && a.name.value) === (b.name && b.name.value)
        && (a.alias && a.alias.value) === (b.alias && b.alias.value)
        && isArgumentsSimilar(a.arguments, b.arguments);

    case Kind.INLINE_FRAGMENT:
      return a.typeCondition.name.value === b.typeCondition.name.value;

    default:
      return false;
  }
}
