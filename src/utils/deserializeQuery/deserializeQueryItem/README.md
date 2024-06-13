# deserializeQueryItem
Deserialize items in from the query string, converting to the appropriate type.

Usage is:
```js
const deserializedItem = deserializeQueryItem(item, { type: <TYPE>, ...otherOptions });
```

The input from the query string can be `string | string[] | null | undefined`

The output type is dependent on the input `type` and can be undefined. So `string | undefined`, `boolean | undefined`, or `SomeEnum | undefined`.

---
### type: string ( or no options)
Pass the element through, if it's an array just use the first element.

By default the response is typed to `string | undefined`.

You can specify a different type by using the generic `deserializeQueryItem<Choices>` which types the response as `Choices | undefined`. The validity of this typing can't be checked at compile time, so becareful using it. Use in conjunction with the `enum` option to safe guard this a litte.

```js
const thing = deserializeQueryItem('true'); // "true"
const thing = deserializeQueryItem('323', { type: 'string' }); // "323"
const thing = deserializeQueryItem(undefined); // undefined
const thing = deserializeQueryItem(null); // undefined
const thing = deserializeQueryItem(['a-string', 'b-string']); // "a-string"
const thing = deserializeQueryItem([]); // undefined
  type Choices = 'option1' | 'option2';
const interval = deserializeQueryItem<Choices>('option1', {
  enum: ['option1', 'option2'],
  type: 'string',
}); // "option1" and typed to Choices | undefined;
const thing = deserializeQueryItem<Choices>('oops', {
  enum: ['option1', 'option2'],
  type: 'string',
}); // "oops" and typed to Choices | undefined, but logError is called.
```

---
### type: enum
The returned value will be typed to the enum.

If the value to be deserialized is not in the enum, the value is just passed through but logError is called.

```js
export enum RECURRING_INTERVAL {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}
const thing = deserializeQueryItem('MONTH', {
  enum: RECURRING_INTERVAL,
  type: 'enum',
}); // "MONTH" and typed to RECURRING_INTERVAL | undefined;
const thing = deserializeQueryItem(Interval.Month, {
  enum: RECURRING_INTERVAL,
  type: 'enum',
}); // "MONTH" and typed to RECURRING_INTERVAL | undefined;
const thing = deserializeQueryItem('oops', {
  enum: RECURRING_INTERVAL,
  type: 'enum',
}); // "oops", but logError is called and typed to RECURRING_INTERVAL | undefined
```

---
### type: boolean
If the value is `"false"` return `false`
If the value is `"true"` return `true`
If the value is any other string return `false` and call logError

```js
const thing = deserializeQueryItem('true', { type: 'boolean' }); // true
const thing = deserializeQueryItem('false', { type: 'boolean' }); // false
const thing = deserializeQueryItem(undefined, { type: 'boolean' }); // undefined
const thing = deserializeQueryItem(null, { type: 'boolean' }); // undefined
const thing = deserializeQueryItem(['false'], { type: 'boolean' }); // false
const thing = deserializeQueryItem([], { type: 'boolean' }); // undefined
```

---
### type: integer
Uses parseFloat + Math.round

#### Options
min: The smallest allowed value (inclusive)
max: The largest allowed value (inclusive)
defaultValue: the value to use, if not in the input.

```js
const thing = deserializeQueryItem('10', { type: 'integer' }); // 10
const thing = deserializeQueryItem('10.1', { type: 'integer' }); // 10
const thing = deserializeQueryItem(undefined, { type: 'integer' }); // undefined
const thing = deserializeQueryItem(null, { type: 'integer' }); // undefined
const thing = deserializeQueryItem(['10'], { type: 'integer' }); // false
const thing = deserializeQueryItem([], { type: 'integer' }); // undefined
const thing = deserializeQueryItem('20', { min: 25, type: 'integer' }); // 25
```

---
### type: ???
The function is overloaded so that any other type will fail typescript. But if this is used in javascript, this is checked at runtime.

It will be treated as "string" and `logError` is called.
