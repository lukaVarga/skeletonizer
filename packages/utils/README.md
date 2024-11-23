# `@skeletonizer/utils`
This is the general utility package for the Skeletonizer project. It should be used together with every adapter (eg. Vue, Angular) package.
Roughly speaking, the usage of skeleton in the template boils down to the following steps:
- surrounding the content you want to skeletonize with the `skeletonizer-skeleton` component and passing it through via content projection
- providing the following input props to `skeletonizer-skeleton` component:
  - `config` - the skeleton configuration for the skeleton
  - `showSkeleton` - a boolean that determines whether the skeleton should be shown or not
  - `schema` - the schema configuration for the skeleton, - has to have the same overal shape as the skeleton configuration, but with actual references to component props / methods instead of their skeletonized ("mocked") counterparts
  - optional `colorSchema` - the color schema configuration for the skeleton
  
The actual usage depends on the adapter you are using. For more info, refer to docs for the specific adapter:
- [Vue](/packages/vue/README.md)
- [Angular](/packages/angular/README.md)

## SkeletonAbstractComponent
This is an abstract class that:
- should be extended by the component class in class-based components (eg. Angular)
- should be injected into the component as eg. a mixin or composable in functional components (eg. Vue)

When used as an extended abstract component, it requires you to define:
- `skeletonConfig` - the skeleton configuration for the skeleton
- `showSkeleton` - a boolean that determines whether the skeleton should be shown or not

When used as a mixin or composable, you will be required to provide the following properties, which it also exposes for use in the view:
- `skeletonConfig` - the skeleton configuration for the skeleton
- `showSkeleton` - a boolean that determines whether the skeleton should be shown or not

It also provides a type-safe `proxy` method that can be used to (type-safely) access the properties / methods within the skeletonized part of the component.
The actual access to this method depends on the adapter. 
Note: **all properties / methods which depend on data being loaded asynchronously, which will be available once the `showSkeleton` is `false`, should be accessed via `proxy` method. All other properties / methods can be accessed directly, even within the skeleton-projected content**

## SchemaItem
The `SchemaItem` class is a generic class in TypeScript that is used to generate different types of data. It has several methods that allow you to generate and manipulate data of different types.
It is used as part of the `skeletonConfig` to generate the (random) data that will be used in the skeletonized views.
Methods can be chained together as long as they belong to the same underlying type (eg. you can chain `number` and `multiply` methods - ie `new SchemaItem().number(10, 100).multiply(5)` since they both expect to be operating on a `number`, but you cannot chain `number` and `words` methods as the first one is operating on a `number` and the second one is operating on a `string`).

### `value`
A getter that returns the current value of the `SchemaItem` instance.
Useful if you want to access the generated value directly - possibly for usage as a random argument value in other `SchemaItem` methods.

### `words(count: number)`
Generates a string of lorem ipsum words. The number of words is determined by the `count` parameter.
This can be used eg. for simulating names, titles, cities, countries, etc.

### `paragraphs(count: number)`
Generates a string of lorem ipsum paragraphs. The number of paragraphs is determined by the `count` parameter.
This can be used eg. for simulating descriptions, articles, etc.

### `number(min: number = 0, max: number = 1000)`
Generates a random number between the `min` and `max` parameters.
This can be used eg. for simulating prices, available quantities, etc.

### `currency(config: { locale: string; currency: string; options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> })`
Turns the string or number value of the `SchemaItem` instance into a currency string of the provided locale and currency.
This can be used in combination with the `number` method to simulate prices in different currencies - eg. `new SchemaItem().number(10, 100).currency({ locale: 'en-US', currency: 'USD' })`.

### `multiply(multiplier: number)`
Multiplies the current value of the `SchemaItem` instance by the `multiplier` parameter.
This can be used for chaining the `SchemaItem().foo()` methods if `foo` returns a number - ie `new SchemaItem().number(10, 100).multiply(5)`.

### `date(config: Partial<{ isFuture: boolean; isPast: boolean; max: Date; min: Date }> = {})`
Generates a random date within the range specified by the `config` parameter.
This can be used eg. for simulating dates of birth, dates of creation, etc.

### `uuid()`
Increments a global `uuid` variable and sets the current value of the `SchemaItem` instance to this new value.
This can be used eg. for simulating user ids, etc.

### `boolean()`
Generates a random boolean value.
This can be used eg. for simulating whether a user is active, whether a product is in stock, etc.

### `symbol(val: string | number = 0)`
Creates a new unique symbol with the provided `val` as the description.

### `randomItem(items: R[])`
Sets the current value of the `SchemaItem` instance to a random item provided in the `items` parameter.

### `prefix(prefix: string)`
Adds a prefix to the current value of the `SchemaItem` instance.
This can be used eg. to simulate currency when chaining with the `number` method - ie. `new SchemaItem().number(10, 100).prefix('$')`.

### `suffix(suffix: string)`
Adds a suffix to the current value of the `SchemaItem` instance.
This can be used eg. to simulate percentages when chaining with the `number` method - ie. `new SchemaItem().number(10, 100).suffix('%')`.

### `identical(identity: R)`
Sets the current value of the `SchemaItem` instance to the `identity` parameter.
This can be used eg. for providing a specific (general) placeholder image that you want to use in the skeleton in place of eg. profile pictures, product images, etc.
It can also be used for providing any specific class instances that you might be using in your app (eg. `moment` for dates, which may be used in the view, a specific `enum` value, a `UserModel` etc).
It allows you to provide your own (randomly generated) data, with type safety, for usage in skeleton config schema (eg. you could use it in conjunction with more realistic first names generated by `faker` or similar packages).

## TSchemaConfig
The `TSchemaConfig` type is the configuration object type being used to define the skeleton structure. It is used by all adapters in some shape or form. 
The general shape is:

```typescript
type TSchemaConfig<T extends object> = {
  repeat: number;
  schemaGenerator: TSchemaGenerator<T>;
};
```

The `repeat` property specifies the number of times the skeleton part of the component should be repeated whilst in loading state. Eg. if you pass a single `div` inside the skeleton-projected content, and set `repeat` to `5`, there will be 5 `div`s in the skeletonized content when `showSkeleton` is `true`. 
The `schemaGenerator` property is a function that requires you to return the skeleton structure based on the provided schema configuration. It is a generic function that accepts an object of `T` and expects you to return a mirrored shape where all underlying primitive props should be of shape `SchemaItem<T[K]>`. 

For example, if you want to render 10 (ex)students that have borrowed a book from a library, where the underlying data of each (ex)student looks like:

```typescript
type TStudentLibraryMember = {
  name: string;
  age: number;
  exStudent: boolean;
  profilePicture: string | null;
  booksBorrowed: Array<{ title: string; id: number }>;
};
```

you would define a schema configuration like this:

```typescript
const studentLibraryMemberSchemaGenerator: TSchemaConfig<TStudentLibraryMember> = {
  repeat: 10,
  schemaGenerator: () => ({
    name: new SchemaItem<string>().words(2),
    age: new SchemaItem<number>().number(18, 30),
    exStudent: new SchemaItem<boolean>().boolean(),
    profilePicture: new SchemaItem().identical('https://your-placeholder-image.jpg'),
    booksBorrowed: Array.from({ length: 3 }, () => ({
      title: new SchemaItem<string>().words(new SchemaItem<number>().number(3, 10).value),
      id: new SchemaItem<number>().number(1, 1000),
    })),
  }),
};
```

Note: the underlying types must match - eg. you cannot use `name: new SchemaItem<number>().number(18, 30)` in the above example since the underlying type of the `name` property defined by `TStudentLibraryMember` is `string`. This ensures you can safely operate on the generated data in the skeletonized content.

## colorSchema
Generally speaking, you shouldn't need to adjust the color scheme of the skeletonized component in most cases. However, should you need to, the color scheme of the skeletonized views can be customized by providing the `colorSchema` input bound property to the `SkeletonizerSkeletonComponent`.
You can provide a custom color scheme by providing an object with the following shape:

```typescript
export interface ISkeletonizerColorSchema {
  primaryColor: string;
  secondaryColor: string;
}
```
Roughly speaking, the background colour of the skeletonized area transitions between the `primaryColor` and the `secondaryColor`.

## Contributing
Adjustments in this package have ramifications on all other packages, so please be careful when making changes.
- `npm install`
- adjust the code in the `packages/utils` directory
- run `npm run build` in the `packages/utils` directory
- adjust the code in adapter packages directories, if needed
- `npm run dev` in in each of the adapter packages directories to test the changes
- run `npm run build` in the root directory
- update readme files in the `packages/utils` and adapter packages directories

Before submitting a pull request, make sure to run the following commands in **root** directory:
- `npm run lint`
- `npm run type-check`
- `npm run coverage`
- `npm run build`
