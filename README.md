# graphql-merge

Merge GraphQL queries.

_NOTE: This is very much untested in anything else than the simplest scenarios_

```
Transform

query {
  topUsers {
    firstName
    lastName
  }
}

and

query {
  topUsers {
    company
  }
}

Into this:

query {
  topUsers {
    firstName
    lastName
    company
  }
}
```

## Usage

```js
import { parse, print } from 'graphql';
import merge from 'graphql-merge';

const queryB = parse('{ users { name address } } }');
const queryA = parse('{ users { favoriteColor } }');

const mergedQuery = merge(queryA, queryB);
console.log(print(mergedQuery));
// { users { name address favoriteColor } }
```

## TODO

* Arguments should be merged when allowed by configuration
  - i.e. `users(first: 10) and users(first: 12)` should be merged into `users(first: 12)`
    given that some configuration contains `{ joinArgumentNames: ['first'] }`
* Rewrite variable names where possible
