import { Kind } from 'graphql';
import differenceWith from 'lodash.differencewith';

function isArgumentSimilar(a, b) {
  return a.name.value === b.name.value
  && a.value.value === b.value.value // literal values
  && (!a.value.name || (a.value.name.value === b.value.name.value)); // variable names
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

    case Kind.FRAGMENT_DEFINITION:
      return a.name.value === b.name.value;

    case Kind.INLINE_FRAGMENT:
      return a.typeCondition.name.value === b.typeCondition.name.value;

    case Kind.SELECTION_SET:
      return true;

    case Kind.ARGUMENT:
      return (a.name.value === b.name.value) && (a.value.value === b.value.value);

    default:
      // eslint-disable-next-line no-console
      console.error(`Unhandled node kind '${kind}'. This is a bug in graphql-merge.`);
      return false;
  }
}
