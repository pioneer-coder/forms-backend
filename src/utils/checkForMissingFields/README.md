## checkForMissingFields
utility to check for missing fields/properties. It throws a MissingRequiredFieldsError with all of the missing fields listed.

All it does is look at each value in the object and reports the key as missing if it is `null` || `undefined` || `""`.

## Examples
### Showing all types of missing fields, and passing falsey values.
```js
import checkForMissingFields from '@/utils/checkForMissingFields';
checkForMissingFields({ 
  isNull: null,
  isUndefined: undefined,
  isEmptyString: '',
  isFalse: false,
  isZero: 0,
  isSet: 'yo ho ho',
});
```
Results in this MissingRequiredFieldsError error being thrown with this error.response:
```json
{
  "errors": [
    "Missing isEmptyString",
    "Missing isNull",
    "Missing isUndefined"
  ],
  "message": "Missing required fields",
  "missingFields": [
    "isEmptyString",
    "isNull",
    "isUndefined"
  ],
  "type": "MissingRequiredFieldsError"
}
```

### Basic Usage:
```js
import checkForMissingFields from '@/utils/checkForMissingFields';
const theFunction = ({ id }) => {
  checkForMissingFields({ id });
}
```

### Or of two properties (both ok)
There is nothing special about the '||' here. This is just the string reported in the error. You could just as well do `{ 'either id or slug are required': id || slug }`.
```js
import checkForMissingFields from '@/utils/checkForMissingFields';
const theFunction = ({ id, slug }) => {
  checkForMissingFields({ 'id || slug': id || slug });
}
```

### Or of two properties (but only one)
```js
import checkForMissingFields, { exactlyOne } from '@/utils/checkForMissingFields';
const theFunction = ({ id, slug }) => {
  checkForMissingFields({ 'one of id or slug': exactlyOne({ id, slug });
}
```