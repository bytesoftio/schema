# @bytesoftio/schema

## Installation 

`yarn add @bytesoftio/schema` or `npm install @bytesoftio/schema`

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [Quick start](#quick-start)
- [Testing](#testing)
- [Validating](#validating)
- [Sanitizing](#sanitizing)
- [Sanitize and test](#sanitize-and-test)
- [Sanitize and validate](#sanitize-and-validate)
- [Reusing validation schemas](#reusing-validation-schemas)
- [Relations with and() / or()](#relations-with-and--or)
- [Add a custom validator](#add-a-custom-validator)
- [Add a custom sanitizer](#add-a-custom-sanitizer)
- [Translations](#translations)
- [String schema](#string-schema)
  - [required](#required)
  - [optional](#optional)
  - [equals](#equals)
  - [length](#length)
  - [min](#min)
  - [max](#max)
  - [between](#between)
  - [matches](#matches)
  - [email](#email)
  - [url](#url)
  - [startsWith](#startswith)
  - [endsWith](#endswith)
  - [includes](#includes)
  - [omits](#omits)
  - [oneOf](#oneof)
  - [noneOf](#noneof)
  - [numeric](#numeric)
  - [alpha](#alpha)
  - [alphaNumeric](#alphanumeric)
  - [alphaDashes](#alphadashes)
  - [alphaUnderscores](#alphaunderscores)
  - [alphaNumericDashes](#alphanumericdashes)
  - [alphaNumericUnderscores](#alphanumericunderscores)
  - [date](#date)
  - [date](#date-1)
  - [dateTime](#datetime)
  - [dateBefore](#datebefore)
  - [dateAfter](#dateafter)
  - [dateBetween](#datebetween)
  - [toDefault](#todefault)
  - [toUpperCase](#touppercase)
  - [toLowerCase](#tolowercase)
  - [toCapitalized](#tocapitalized)
  - [toCamelCase](#tocamelcase)
  - [toSnakeCase](#tosnakecase)
  - [toKebabCase](#tokebabcase)
  - [toConstantCase](#toconstantcase)
  - [toTrimmed](#totrimmed)
- [Number schema](#number-schema)
  - [required](#required-1)
  - [optional](#optional-1)
  - [equals](#equals-1)
  - [min](#min-1)
  - [max](#max-1)
  - [between](#between-1)
  - [between](#between-2)
  - [negative](#negative)
  - [integer](#integer)
  - [toDefault](#todefault-1)
  - [toRounded](#torounded)
  - [toFloored](#tofloored)
  - [toCeiled](#toceiled)
  - [toTrunced](#totrunced)
- [Boolean schema](#boolean-schema)
  - [required](#required-2)
  - [optional](#optional-2)
  - [equals](#equals-2)
  - [toDefault](#todefault-2)
- [Date schema](#date-schema)
  - [required](#required-3)
  - [optional](#optional-3)
  - [equals](#equals-3)
  - [after](#after)
  - [before](#before)
  - [between](#between-3)
  - [toDefault](#todefault-3)
- [Array schema](#array-schema)
  - [required](#required-4)
  - [optional](#optional-4)
  - [equals](#equals-4)
  - [length](#length-1)
  - [min](#min-2)
  - [max](#max-2)
  - [between](#between-4)
  - [someOf](#someof)
  - [noneOf](#noneof-1)
  - [shape](#shape)
  - [toDefault](#todefault-4)
  - [toFiltered](#tofiltered)
  - [toMapped](#tomapped)
  - [toCompact](#tocompact)
  - [toUnique](#tounique)
- [Object schema](#object-schema)
  - [required](#required-5)
  - [optional](#optional-5)
  - [equals](#equals-5)
  - [shape](#shape-1)
  - [allowUnknownKeys](#allowunknownkeys)
  - [disallowUnknownKeys](#disallowunknownkeys)
  - [shapeUnknownKeys](#shapeunknownkeys)
  - [shapeUnknownValues](#shapeunknownvalues)
  - [toDefault](#todefault-5)
  - [toCamelCaseKeys](#tocamelcasekeys)
  - [toCamelCaseKeysDeep](#tocamelcasekeysdeep)
  - [toSnakeCaseKeys](#tosnakecasekeys)
  - [toSnakeCaseKeysDeep](#tosnakecasekeysdeep)
  - [toKebabCaseKeys](#tokebabcasekeys)
  - [toKebabCaseKeysDeep](#tokebabcasekeysdeep)
  - [toConstantCaseKeys](#toconstantcasekeys)
  - [toConstantCaseKeysDeep](#toconstantcasekeysdeep)
  - [toMappedValues](#tomappedvalues)
  - [toMappedValuesDeep](#tomappedvaluesdeep)
  - [toMappedKeys](#tomappedkeys)
  - [toMappedKeysDeep](#tomappedkeysdeep)
- [Mixed schema](#mixed-schema)
  - [required](#required-6)
  - [optional](#optional-6)
  - [equals](#equals-6)
  - [oneOf](#oneof-1)
  - [noneOf](#noneof-2)
  - [toDefault](#todefault-6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

This library provides a convenient way to describe, validate and sanitize 
primitive values like strings and numbers, but also objects. It can be used 
for complex validation scenarios as well as simple one-line assertions.

There are multiple kinds of schemas for different types of data: 
`object`, `string`, `number`, `array`, `boolean`, `date` and `mixed`.

There are two ways to run assertions / validations. For simple things like 
one-liners where you simply want to know if a value matches certain criteria,
with a `true` / `false` as result, you can use `test`. For proper validation, 
with error messages, etc., you can use `validate`. 

Each data type specific schema comes with many different assertion and 
sanitization methods. Some methods are common for all of the schemas, some are
available only on a certain kind of schema.

Assertions are used for validation purposes and are used to describe 
the underlying value and to ensure it is valid. Both methods, `test` and `validate`, 
are async and must be awaited.s

Sanitization / normalization methods are used to process the underlying 
value even further, for example, to ensure that a string is capitalised, or 
all of the object keys are camel-cased, etc.   

## Quick start

Here is an example of all the available schemas and how to import them.

```ts
import { string, number, array, boolean, date, object, mixed } from "@bytesoftio/schema"
```

Let's describe a simple user object. 

- *email* must be of type string and a valid email address
- *fullName* must be a string  between 3 and 100 characters
- *roles* must be an array containing at least one role, valid roles are "admin", "publisher" and "developer", not duplicates are allowed
- *tags* must be an array of string, at least 3 characters long, consisting of letter and dashes 

```ts
import { array, object, string } from "@bytesoftio/schema"

const userSchema = object({
  email: string().email(),
  fullName: string().min(3).max(100),
  roles: array().min(1).someOf(["admin", "publisher", "developer"]).toUnique(),
  tags: array(string().min(3).alphaDashes())
})
```

The schema above contains some validation assertions as well as some sanitization / normalization logic. 

Quick check if an object is valid according to the schema:

```ts
const valid = await userSchema.test({ /* ... */ })

if (valid) {
  // ...
}
```

Regular validation:

```ts
const errors = await userSchema.validate({ /* ... */ })

if ( ! errors) {
  // ...
}
```

Run sanitizers like `array().toUnique()`:

```ts
const sanitizedValue = await userSchema.sanitize({ /* ... */ })
```

All together:

```ts
const [valid, sanitizedValue] = await userSchema.sanitizeAndTest({ /* ... */ })
const [errors, sanitizedValue] = await userSchema.sanitizeAndValidate({ /* ... */ })
```

## Testing

Lets take a look how to run simple assertions using the `test` method.

Successful assertion:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(3).alphaNumeric()

// true
const valid = await schema.test("fooBar")

if (valid) {
  // ...
}
```

Failed assertion:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(3).alphaNumeric()

// false
const valid = await schema.test("foo-bar")

if (valid) {
  // ...
}
```

## Validating

Validations can be very simple, when using strings, numbers, etc. or become quite complex when using object. We'll cover objects in a later section.

Successful validation: 

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(3).alphaNumeric()

// undefined
const errors = await schema.validate("fooBar")

if ( ! errors) {
  // ...
}
```

Failed validation:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(3).alphaNumeric()

// [ ... ]
const errors = await schema.validate("foo-bar")

if ( ! errors) {
  // ...
}
```

This is what the validation error looks like: 

```ts
[
  {
    // identifies validation and translation key
    type: 'string_alpha_numeric', 
    // translated validation message
    message: 'Must consist of letters and digits only',
    // additional arguments into the the assertion method, like string().min(1)
    args: [],
    // underlying value that was validated
    value: 'foo-bar',
    // description of logical validation links, see .or() and .and() methods
    link: undefined,
    // path of the validated property, when validating objects, 
    // using dot notation "path.to.property"
    path: undefined
  }
]
```

## Sanitizing

Lets take a look on how schema can be used to sanitize / normalize data. For convenience, all sanitization methods start with `to`, like `toCamelCase`.

```ts
import { string } from "@bytesoftio/schema"

const schema = string().toTrimmed().toCamelCase()

// "fooBar"
const value = await schema.sanitize("  foo bar  ")
```

## Sanitize and test

Now let's mix some things up, what if you could sanitize your data before running the assertions?

Successful test:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(4).toCamelCase()

// [true, "fooBar"]
const [valid, value] = await schema.sanitizeAndTest("foo bar")
```

Failed test:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(4).toTrimmed()

// [false, "foo"]
const [valid, value] = await schema.sanitizeAndTest("  foo  ")
```

As you can see, even though the string `"  foo  "` has a length greater than 4, after it gets trimmed (all surrounding whitespace gets stripped away), it becomes`"foo"` and therefore its length is less than 4. 

## Sanitize and validate

This method works exactly the same as `sanitizeAndTest`, except instead of calling `test` behind the scenes, it calls the `validate` method.

Successful validation:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(4).toCamelCase()

// [undefined, "fooBar"]
const [errors, value] = await schema.sanitizeAndValidate("foo bar")
```

Failed validation:

```ts
import { string } from "@bytesoftio/schema"

const schema = string().min(4).toTrimmed()

// [[ ... ], "foo"]
const [errors, value] = await schema.sanitizeAndValidate("  foo  ")
```

This what the errors would look like:

```ts
[
  {
    type: 'string_min',
    message: 'Must be at least "4" characters long',
    args: [ 4 ],
    value: 'foo',
    link: undefined,
    path: undefined
  }
]
```

## Reusing validation schemas

Schemas can be chained using conditions. It is also possible to shape the contents of an array or object using a dedicated schema. Sounds complicated, but it isn't. Based on the reasons above you might want to split schemas into small reusable pieces.

```ts
import { array, string } from "@bytesoftio/schema"

// a valid username is alpha numeric and has a length from 3 to 10 characters
const usernameSchema = string().alphaNumeric().between(3, 10)

// array contain at least 3 valid usernames
const usernameListSchema = array().min(3).shape(usernameSchema)

// undefined
const errors = await usernameListSchema.validate(["foo", "bar", "baz"])
```

## Relations with and() / or()

Schemas can logically be linked together using `and` and `or` methods. An `and` schema 
will only be executed if the higher order schema, that it is linked to, could validate successfully.
An `or` schema will only execute if the parent schema failed, the `or` schema will be tried instead.

```ts
string().min(3).and(string().noneOf(["foo", "bar"]))

number().or(string().numeric())
```

## Add a custom validator

Adding custom validation behaviour is fairly easy to do.

```ts
import { string } from "@bytesoftio/schema"

const assertMinLength = (min: number) => {
    return (value) => {
      if (typeof value === "string" && value.length < min) {
        return false
      }
    }
}

const schema = string().customValidator("Value is too short", assertMinLength(10))

// [ ... ]
const errors = await schema.validate("foo bar")
```

This is what the errors would look like:

```ts
[
  {
    type: 'custom',
    message: 'Value is too short',
    args: [],
    value: 'foo bar',
    link: undefined,
    path: undefined
  }
]
```

## Add a custom sanitizer

It is very easy to hook up a custom sanitizer into an existing schema.

```ts
import { string } from "@bytesoftio/schema"

const toUpperCase = (value) => {
  if (typeof value === "string") {
    return value.toUpperCase()
  }

  return value
}

const schema = string().customSanitizer(toUpperCase)

  // "FOO BAR"
const value = await schema.sanitize("foo bar")
```

## Translations

This library uses [@bytesoftio/translator](https://github.com/bytesoftio/translator) behind the scenes. Please take a look at the corresponding docs for examples of how to add / replace translations, etc.

Access translator like this:

```ts
import { schemaTranslator } from "@bytesoftio/schema"

// take a look at available translations
schemaTranslator.getTranslations()

// customize translations
schemaTranslator.setTranslations({
  en: { string_min: "Value too short" }
})
```

## String schema

String schema has all the methods related to string validation and sanitization.

```ts
import { string } from "@bytesoftio/schema"
```

### required

Value must be a non empty string. Active by default.

```ts
string().required()
```

### optional

Value might be a string, opposite of `required`.

```ts
string().optional()
```

### equals

String must be equal to the given value.

```ts
string().equals("foo")
// or
string().equals(() => "foo")
```

### length

String must have an exact length

```ts
string().length(3)
// or
string().length(() => 3)
```

### min

String must not be shorter than given value.

```ts
string().min(3)
// or
string().min(() => 3)
```

### max

String must not be longer than given value.

```ts
string().max(3)
// or
string().max(() => 3)
```

### between

String must have a length between min and max.

```ts
string().between(3, 6)
// or
string().between(() => 3, () => 6)
```

### matches

String must match given RegExp.

```ts
string().matches(/^red/)
// or
string().matches(() => /^red/)
```
### email

String must be a valid email address.

```ts
string().email()
```

### url

String must be a valid URL.

```ts
string().url()
```

### startsWith

String must start with a given value.

```ts
string().startsWith("foo")
// or
string().startsWith(() => "foo")
```

### endsWith

String must end with a given value.

```ts
string().endsWith("foo")
// or
string().endsWith(() => "foo")
```

### includes

String must include given substring.

```ts
string().includes("foo")
// or
string().includes(() => "foo")
```

### omits

String must not include given substring.

```ts
string().omits("foo")
// or
string().omits(() => "foo")
```

### oneOf

String must be one of the whitelisted values.

```ts
string().oneOf(["foo", "bar"])
// or
string().oneOf(() => ["foo", "bar"])
```

### noneOf

String must not be one of the blacklisted values.

```ts
string().noneOf(["foo", "bar"])
// or
string().noneOf(() => ["foo", "bar"])
```

### numeric

String must contain numbers only, including floats.

```ts
string().numeric()
```

### alpha

String must contain letters only.

```ts
string().alpha()
```

### alphaNumeric

String must contain numbers and letters only.

```ts
string().alphaNumeric()
```

### alphaDashes

String must contain letters and dashes "-" only.

```ts
string().alphaDashes()
```

### alphaUnderscores

String must container letters and underscores "_" only.

```ts
string().alphaUnderscores()
```

### alphaNumericDashes

String must container letters, numbers and dashes only.

```ts
string().alphaNumericDashes()
```

### alphaNumericUnderscores

String must contain letters, numbers and underscores only.

```ts
string().alphaNumericUnderscores()
```

### date

String must be a valid ISO date string.

```ts
string().date()
```

### date

String must be a valid ISO time string.

```ts
string().time()
```

### dateTime

String must be a valid ISO date time string.

```ts
string().dateTime()
```

### dateBefore

String must be a valid ISO date time string before the given date.

```ts
string().dateBefore(new Date())
// or
string().dateBefore(() => new Date())
```

### dateAfter

String must be a valid ISO date time string after the given date.

```ts
string().dateAfter(new Date())
// or
string().dateAfter(() => new Date())
```

### dateBetween

String must be a valid ISO date time string between the two given dates.

```ts
string().dateBetween(new Date(), new Date())
// or
string().dateBetween(() => new Date(), new Date())
```

### toDefault

Provide a fallback value in case the underlying value is not a string.

```ts
string().toDefault("default value")
// or
string().dateBefore(() => "default value")
```

### toUpperCase

Convert string to all upper case.

```ts
string().toUpperCase()
```

### toLowerCase

Convert string to all lower case.

```ts
string().toLowerCase()
```

### toCapitalized

Capitalize first letter.

```ts
string().toCapitalized()
```

### toCamelCase

Convert string to camelCase.

```ts
string().toCamelCase()
```

### toSnakeCase

Convert string to snake_case.

```ts
string().toSnakeCase()
```

### toKebabCase

Convert string to kebab-case.

```ts
string().toKebabCase()
```

### toConstantCase

Convert string to CONSTANT_CASE.

```ts
string().toConstantCase()
```

### toTrimmed

Trim surrounding white space.

```ts
string().toTrimmed()
```

## Number schema

Number schema has all the methods related to number validation and sanitization.

```ts
import { number } from "@bytesoftio/schema"
```

### required

Value must be a number.

```ts
number().required()
```

### optional

Value might be a number, opposite of `required`.

```ts
number().optional()
```

### equals

Number must be equal to the given value.

```ts
number().equals(3)
// or
number().equals(() => 3)
```

### min

Number must not be smaller than the given value.

```ts
number().min(5)
// or
number().min(() => 5)
```

### max

Number must not be bigger than the given value.

```ts
number().max(10)
// or
number().max(() => 10)
```

### between

Number must be between the two given numbers.

```ts
number().between(5, 10)
// or
number().between(() => 5, () => 10)
```

### between

Number must be positive - bigger than 0.

```ts
number().positive()
```

### negative

Number must be negative - smaller than 0.

```ts
number().negative()
```

### integer

Number must be an integer - no floats.

```ts
number().integer()
```

### toDefault

Default value in case the underlying value is not a number.

```ts
number().toDefault(10)
// or
number().toDefault(() => 10)
```

### toRounded

Round value using `Math.round()`.

```ts
number().toRounded(2)
// or
number().toRounded(() => 2)
```

### toFloored

Round value using `Math.floor()`.

```ts
number().toFloored()
```

### toCeiled

Round value using `Math.ceil()`.

```ts
number().toCeiled()
```

### toTrunced

Trunc value - drop everything after the decimal point. 

```ts
number().toTrunced()
```

## Boolean schema

Boolean schema has all the methods related to boolean validation and sanitization.

```ts
import { boolean } from "@bytesoftio/schema"
```

### required

Value must be a boolean.

```ts
boolean().required()
```

### optional

Value might be a boolean, opposite of `required`.

```ts
boolean().optional()
```

### equals

Number must be equal to the given value.

```ts
boolean().equals(true)
// or
boolean().equals(() => true)
```

### toDefault

Provide a fallback value in case the underlying value is not a boolean.

```ts
boolean().toDefault(true)
// or
boolean().toDefault(() => true)
```

## Date schema

Date schema has all the methods related to date validation and sanitization.

```ts
import { date } from "@bytesoftio/schema"
```

### required

Value must be a date.

```ts
date().required()
```

### optional

Value might be a date, opposite of `required`.

```ts
date().optional()
```

### equals

Date must be equal to the given value.

```ts
date().equals(new Date())
// or
date().equals(() => new Date())
```

### after

Underlying value must be after the given date.

```ts
date().after(new Date())
// or
date().after(() => new Date())
```

### before

Underlying value must be before the given date.

```ts
date().before(new Date())
// or
date().before(() => new Date())
```

### between

Underlying value must be between the two dates.

```ts
date().between(new Date(), new Date())
// or
date().between(() => new Date(), () => new Date())
```

### toDefault

Provide a fallback value in case the underlying value is not a date.

```ts
date().toDefault(new Date())
// or
date().toDefault(() => new Date())
```

## Array schema

Array schema has all the methods related to array validation and sanitization.

```ts
import { array } from "@bytesoftio/schema"
```

### required

Value must be a array.

```ts
array().required()
```

### optional

Value might be a array, opposite of `required`.

```ts
array().optional()
```

### equals

Array must be equal to the given value.

```ts
array().equals([1, 2])
// or
array().equals(() => [1, 2])
```

### length

Array must have an exact length.

```ts
array().length(3)
// or
array().length(() => 3)
```

### min

Array must not be shorter than the given length.

```ts
array().min(3)
// or
array().min(() => 3)
```

### max

Array must not be longer than the given length.

```ts
array().max(3)
// or
array().max(() => 3)
```

### between

Array must have a length between the two given values. 

```ts
array().between(3, 5)
// or
array().between(() => 3, () => 5)
```

### someOf

Array must only contain whitelisted values. 

```ts
array().someOf([3, 4])
// or
array().someOf(() => [3, 4])
```

### noneOf

Array must not contain any of the blacklisted values.

```ts
array().noneOf([3, 4])
// or
array().noneOf(() => [3, 4])
```

### shape

Specify a schema for array items. Every item must be valid according to the schema. 

```ts
array().shape(string().min(3))
// or
array().shape(() => string().min(3))
```

### toDefault

Provide a default value in case the underlying value is not an array. 

```ts
array().toDefault([1, 2])
// or
array().toDefault(() => [1, 2])
```

### toFiltered

Filter out invalid array items manually. 

```ts
const isString = (value) => typeof value === "string"

array().toFiltered(isString)
```

### toMapped

Map every array item manually. 

```ts
const toUpperCase = (value) => typeof value === "string" ? value.toUpperCase() : value

array().toMapped(toUpperCase)
```

### toCompact

Filter out all `falsey` values like `null`, `undefined`, `"""` and `0`. 

```ts
array().toCompact()
```

### toUnique

Filter out all duplicate values. 

```ts
array().toUnique()
```

## Object schema

Object schema has all the methods related to object validation and sanitization.

```ts
import { object } from "@bytesoftio/schema"
```

### required

Value must be a object.

```ts
object().required()
```

### optional

Value might be a object, opposite of `required`.

```ts
object().optional()
```

### equals

Underlying value must be equal to the given value.

```ts
object().equals({foo: "bar"})
// or
object().equals(() => ({foo: "bar"}))
```

### shape

Shape an object and set up schemas for all of its properties.

```ts
object().shape({ firstName: string().min(3).max(20) })
```

### allowUnknownKeys

Allow object to contain keys that have not been configured through `.shape()`.

```ts
object()
  .shape({ firstName: string().min(3).max(20) })
  .allowUnknownKeys() 
```

### disallowUnknownKeys

Forbid object to contain keys that have not been configured through `.shape()`, active by default.

```ts
object()
  .shape({ firstName: string().min(3).max(20) })
  .disallowUnknownKeys() 
```

### shapeUnknownKeys

Shape unknown object keys to make sure they adhere to a certain format / are valid.

```ts
object()
  .shape({ firstName: string().min(3).max(20) })
  .shapeUnknownKeys(string().min(3).toCamelCase()) 
```

### shapeUnknownValues

Shape unknown object values to make sure they adhere to a format / are valid.

```ts
object()
  .shape({ firstName: string().min(3).max(20) })
  .shapeUnknownValues(string().min(3).max(20)) 
```

### toDefault

Provide a fallback value in case the underlying value is not an object.

```ts
object().toDefault({title: "Foo"})
// or
object().toDefault(() => ({title: "Foo"})) 
```

### toCamelCaseKeys

Transform all object keys to camelCase.

```ts
object().toCamelCaseKeys()
```

### toCamelCaseKeysDeep

Transform all object keys deeply to camelCase.

```ts
object().toCamelCaseKeysDeep()
```

### toSnakeCaseKeys

Transform all object keys to snake_case.

```ts
object().toSnakeCaseKeys()
```

### toSnakeCaseKeysDeep

Transform all object keys deeply to snake_case.

```ts
object().toSnakeCaseKeysDeep()
```

### toKebabCaseKeys

Transform all object keys to kebab-case.

```ts
object().toKebabCaseKeys()
```

### toKebabCaseKeysDeep

Transform all object keys deeply to kebab-case.

```ts
object().toKebabCaseKeysDeep()
```

### toConstantCaseKeys

Transform all object keys to CONSTANT_CASE.

```ts
object().toConstantCaseKeys()
```

### toConstantCaseKeysDeep

Transform all object keys deeply to CONSTANT_CASE.

```ts
object().toConstantCaseKeysDeep()
```

### toMappedValues

Transform all object values.

```ts
object().toMappedValues((value, key) => value)
```

### toMappedValuesDeep

Transform all object values deeply.

```ts
object().toMappedValuesDeep((value, key) => value)
```

### toMappedKeys

Transform all object keys.

```ts
object().toMappedKeys((value, key) => key)
```

### toMappedKeysDeep

Transform all object keys deeply.

```ts
object().toMappedKeysDeep((value, key) => key)
```

## Mixed schema

Mixed schema is used when validating / sanitizing data that can have different / unknown types.

```ts
import { mixed } from "@bytesoftio/schema"
```

### required

Value must not be `null` nor `undefined`.

```ts
mixed().required()
```

### optional

Value might als be a `null` or `undefined`, opposite of `required`.

```ts
mixed().optional()
```

### equals

Underlying value must be equal to the given value.

```ts
mixed().equals("yolo")
// or
mixed().equals(() => "yolo")
```

### oneOf

Underlying value must be one of the whitelisted values.

```ts
mixed().oneOf(["foo", "bar"])
// or
mixed().oneOf(() => ["foo", "bar"])
```

### noneOf

Underlying value must not be one of the blacklisted values.

```ts
mixed().noneOf(["foo", "bar"])
// or
mixed().noneOf(() => ["foo", "bar"])
```

### toDefault

Provide a fallback value in case the underlying value is a `null` or `undefined`.

```ts
mixed().toDefault(true)
// or
mixed().toDefault(() => true)
```