# Copyright

Copyright &copy; 2023 by Michael D. Callaghan. All rights reserved.

Note: This is an excerpt from _Angular Advocate_ and may only be copied or distributed with permission. See the complete book at [AngularAdvocate.com](http://angularadvocate.com).

To report any errors or request distribution permission, please contact the author: Michael D. Callaghan <michael@walkingriver.com>.

You can follow Mike on [Twitter: @walkingriver](https://twitter.com/walkingriver)

---

# Quick Introduction to TypeScript

You will probably need to introduce coworkers to TypeScript. Here's how you can do that.

At my day job, I was asked by my leadership to provide an introduction to TypeScript, Angular, and Node to a group of experienced software developers. Many of these folks are "Senior" or higher, a few with more years of experience than I have. Despite their combined 200+ years of development, they have not used these technologies. This chapter is what I showed them: An Introduction to TypeScript for Experienced Developers.

## TypeScript Playground

To help internalize the concepts you are about to see, consider opening a browser to [http://www.typescriptlang.org/play/](http://www.typescriptlang.org/play/). This website lets you enter TypeScript in one text area and see the corresponding JavaScript instantly. It also provides helpful feedback in the case of TypeScript errors. I find it very handy to understand what's going on during the TypeScript transpilation process.

## Types!

The first thing to understand about TypeScript is that -- surprise -- it has types. It supports the basic types you would expect, such as strings and numbers. You can supply the type explicitly, as in the top examples. Or you may omit the type and supply a value instead. If you provide a variable with a value, then TypeScript will infer the type automatically.

```typescript
// Explicit Type Declaration
let isDone: boolean = false;
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// Implicit Type Declaration
let isDone = false;
let decimal = 6;
let hex = 0xf00d;
let binary = 0b1010;
let octal = 0o744;
```

Don't be fooled, however. Type inference still means the variable has a type; you simply did not need to set it. Trying to assign a number to a string will still be an error.

## Strings

TypeScript includes support for strings. You can use either single- or double-quotes for string constants, but you should be consistent. Many teams prefer one or the other and use tools to enforce that preference.

A third type of quote, the backtick, is used to create templated strings. The sentence variable in the code below is a three-line string -- yes, a templated string can include line breaks. The expression inside the `${ }` is evaluated and that value replaces the entire `${ }` construct.

```typescript
let color: string = 'red';
let fullName = "Bob Bobbington";
let age = 37;
let sentence = `Hello, my name is ${ fullName }.

I'll be ${ age + 1 } years old next month.`;

console.log(sentence);

// Output:
"Hello, my name is Bob Bobbington.

I'll be 38 years old next month."
```

It is interesting to see how a template string is represented in modern JavaScript: it’s the same thing! With older versions of JavaScript it would have been converted into an old-fashioned string assignment with the expected concatenations.

## Arrays

TypeScript supports arrays. Here we are creating list as an array of numbers, as indicated by the square brackets following the type. This was not necessary, of course, as the value on the right side of the equal sign clearly indicates that it is an array of numbers. Most of the time, you only want to set the type explicitly if you are not also providing a value at the same time.

```typescript
let list: number[] = [1, 2, 3];
let list = [1, 2, 3];
```

## Enums

Enumerations, or Enums, allow you to provide a set of human-readable values, which represent the only legal values a variable can contain. In this case, I have defined an enum named Color, which contains three values: Red, Green, and Blue. A constant or variable of this type is only allowed to take on one of those three values. As you can see, to use the value on the right side of an assignment, you need to specify the Enum name, followed by a dot and then the enum value. Attempting to set a non-existent value is an error.

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
const green: Color = Color.Green;

const purple = Color.Purple; // Error!
```

## String Literal Types

String literal types in TypeScript allow you to specify a type that can only have a certain set of specified string values. This provides a way to define a type that can only be one of a few different strings. It's akin to an enum, but for strings. The syntax is simple: you define a type to be equal to one or more string literals, separated by the pipe character (`|`).

This construct proves beneficial in situations where you want to ensure that a variable or a function parameter only accepts certain specific string values. This results in safer code by catching potential errors at compile time. You can think of these as creating a sort of enumerated type for strings, ensuring the value is one from a specified list.

Consider this example where we have a type `Fruit` that could either be `'Apple'`, `'Banana'`, or `'Cherry'`. Trying to assign any other string value to a variable of type `Fruit` would result in a TypeScript error.

```typescript
type Fruit = 'Apple' | 'Banana' | 'Cherry';

let myFruit: Fruit;

myFruit = 'Apple'; // This is valid
myFruit = 'Banana'; // This is also valid
myFruit = 'Pear'; // Error! 'Pear' is not assignable to type 'Fruit'
```

Similarly, we can use string literal types to restrict the parameters that a function accepts:

```typescript
type Direction = 'Up' | 'Down' | 'Left' | 'Right';

function move(direction: Direction) {
  // function body
}

move('Up'); // This is valid
move('Down'); // This is also valid
move('North'); // Error! Argument of type '"North"' is not assignable to parameter of type 'Direction'
```

In this case, the `move` function only accepts `'Up'`, `'Down'`, `'Left'`, or `'Right'` as valid directions. Attempting to call `move('North')` would result in a TypeScript error, as 'North' is not a valid `Direction`. This aids in creating more robust, error-resistant code by ensuring only expected values are passed.

String literal types share some similarities with enums in that they both limit the possible values a variable can have to a predefined set. However, there are some key differences. With enums, the values are numerical (unless you manually assign string values to the enum members), whereas with string literal types, the values are, of course, strings. This difference becomes significant in contexts where the actual value matters, such as when the value is used in comparisons or displayed to the user.

In Angular templates, for example, string literal types can be more convenient than enums. This is because Angular templates are essentially chunks of HTML, which is a text-based format. When you bind a property in an Angular template to an enum value, the underlying numerical value is used, which often isn't what you want. On the other hand, when you bind to a string literal type, the string value is used, which is typically more useful in a text-based context like HTML.

For instance, consider a scenario where we have a component that displays a status message. If we use an enum to represent the status, we would need to create a mapping from the enum values to the corresponding status messages. But with a string literal type, we can directly use the status values in the template, which makes the code more straightforward and easier to understand.

Here is an example:

```typescript
type Status = 'Loading' | 'Success' | 'Error';

@Component({
  selector: 'my-app',
  template: `<div>{{ status }}</div>`,
})
export class AppComponent {
  status: Status = 'Loading';
}
```

In this case, the `status` property is a string literal type that could be 'Loading', 'Success', or 'Error'. The value of the `status` property is directly usable in the template, which simplifies the code compared to using an enum.

## Interfaces

Interfaces are supported as a pure TypeScript construct, and do not compile to any sort of JavaScript whatsoever. Go ahead and enter an interface definition into the TypeScript playground. Don't let that fool you into thinking that they aren't useful.

An interface can be used to enforce the shape of data being passed into a function, or to help when initializing a strongly typed object from an object literal. The interface defined here consists of four string values and requires that any object defined as a Member contain an email address, a first name, and a last name. The phone number is optional, denoted by the question mark at the end of the field name.

Using interfaces for data objects will help the TypeScript compiler help you prevent common typos when initializing objects, without resorting to building complete classes where they aren't strictly necessary.

```typescript
interface Member {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string; // The ? indicates this is optional
}
```

## Object and Array Literals

For example, imagine we want to initialize an array of `Member` objects. Specifying the type explicitly as `Member[]` will let the TypeScript compiler know to check that every object literal provided matches the `Member` interface definition. Notice that I am not providing a phone number, as that field was marked as optional in the interface.

```typescript
const allMembers: Member[] = [
  {
    email: '1234@company.com',
    firstName: 'Mike',
    lastName: 'Smith',
  },
  {
    email: '2345@company.com',
    firstName: 'Bob',
    lastName: 'Johnson',
  },
  {
    email: '3456@company.com',
    firstName: 'Debbie',
    lastName: 'Jones',
  },
  {
    email: '4567@company.com',
    firstName: 'Carol',
    lastName: 'Brown',
  },
];
```

Had `Member` been defined as a class, we would need to use its constructor to define new `Member` objects, which would require more code, and end up a lot less readable than this method.

## Classes in TypeScript

TypeScript also provides concrete classes. Here is a hypothetical class implementation of that same `Member` interface. As you can see, it is a lot more code, and in no way is it any more readable than simply using the interface.

```typescript
class MemberImpl implements Member {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    phone: string = '',
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
  }
}
```

My general recommendation is not to use a class unless and until you have code that needs to be added to it. I would argue even then that you think twice before adding code to a data object. Code such as validation should be done in a separate utility class. Leave your data objects clean, but that is a topic for another day.

## Generics in TypeScript

Like many other modern languages, TypeScript supports Generics. This allows you to create common code that operates the same, regardless of the type passed to it. Illustrated here, we show a potential interface representing a stack of objects, consisting of three functions: `pop`, `push`, and `length`.

```typescript
interface Stack<T> {
  pop(): T;
  push(item: T);
  length(): number;
}
```

Notice the angle brackets containing a single `T` in the interface definition. This declares the interface as being a generic, with `T` representing the compile-time type. Using the `T` is a common convention, but it can be any unused identifier. The function `pop()` returns a single object of that type; `push()` accepts an item parameter of the same type. The `length()` function returns a single number.

Below you can see the creation of two variables of type `Stack`, each passing a different type. As you may guess, you cannot pass a parameter of the wrong type to any of its functions.

```typescript
let numbers: Stack<number>;
let names: Stack<string>;
names.push('Mike'); // OK
names.push(5); // Error
```

## Arrow Functions in TypeScript

TypeScript supports arrow functions, which can be used in place of the anonymous functions you may be used to. In the examples shown here, we are calling the window's `setTimeout` function to delay for five seconds, and then show an alert.

```typescript
window.setTimeout(function () {
  alert('It has been five seconds!');
}, 5000);

window.setTimeout(() => {
  alert('It has been five seconds!');
}, 5000);

window.ondblclick = (ev: MouseEvent) => {
  // `this` refers to the class
  this.mouseX = ev.clientX;
  this.mouseY = ev.clientY;
};
```

At first glance, you are probably wondering what the big deal is. We removed the keyword `function` and added an equal sign and a greater-than sign (that is the arrow). This yields a grand total savings of three characters, so why bother, right?

In my mind, the most important aspect of arrow functions is the fact that the anonymous function to the right of the arrow does NOT redefine the `this` variable. If you've ever been bitten by JavaScript redefining `this` inside your functions, you will appreciate that behavior. Now you can write event handlers inside of a class, and still refer to class variables properly, simply by referring to them with the `this` object inside your event handler arrow function.

## Promises in TypeScript

TypeScript supports promises, so you do not need to rely on an external library such as Bluebird.

A Promise is a guarantee that a function will complete at some unknown time in the future. The classic example of this is an HTTP call. When you make an HTTP request, you are waiting for the remote server to return data to you. If you wait for that reply, your code is stuck and cannot do anything else, including responding to user interaction. Because of that, many asynchronous functions return a promise instead of the actual result. When the function finally does complete, the promise is said to "resolve." If there is an error, the promise is said to "reject." The way you handle that in code is straightforward, but odd if you haven't seen it before.

```typescript
function getMyIpAddress(): Promise<string> {
  return fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

getMyIpAddress()
  .then((ip) =>
    console.log(
      `Your IP address is: ${JSON.stringify(ip)}`,
    ),
  )
  .catch((error) => console.log(error));
```

Here we see a simple implementation of a function to retrieve the public facing IP address of the browser in which it is running. Notice we are combining multiple concepts here. The function returns a promise of type `string`. The calling function calls `fetch`, which also returns a promise. However, it also calls two more functions on that returned promise. The `then` function accepts a function to be called when the promise itself has resolved. In this example, I am passing an arrow function that converts the response to `json` and returns that value. I am using a shortcut here in that if an arrow function only returns the results of a single expression, you can omit both the `return` keyword and the semi-colon.

Inside the `then` function, I’m simply logging the response object, which I have named `ip` in this case. You can do that with arrow functions. The signature only specifies the number (and sometimes the types) of the parameters, but you can name them anything you want. Notice also that I’m calling `JSON.stringify(ip)` to convert the `ip` object into text that can be read. Otherwise, the output would be simply be `[object object]`, which doesn’t help anyone.

The `then` function itself returns a promise, which I use to call its `catch` function. `catch` also accepts a function to be called in case of an error. Here I am providing another arrow function, which accepts the error object and logs it.

Essentially, what is happening here is that the URL provided is requested. At some point in the future, one of two things will happen:

1. Either the HTTP call succeeds, at which point it is "resolved", and then function passed to `then()` is called.
2. Or the HTTP call fails, the promise is "rejected", and the function passed to `catch()` is called.

Finally, notice also that the `getMyIpAddress()` function itself returns a promise, so calling it will look very similar. This is a common pattern you will see repeated often in TypeScript.

# Promises - async/await

An alternative pattern to working with promises is to use `async` and `await`. Any function marked with the keyword `async` can call `await` on a promise, allowing the code to appear more imperative and hopefully a little easier to read.

In this example, I have rewritten `getMyIpAddress()` and its client with `async` and `await`. No more `.then()` or `.catch()`. Instead, the functionality looks and reads exactly like a function without any asynchronous calls. However, this is purely an illusion, as you can see if you paste that code into the TypeScript Playground.

```typescript
async function getMyIpAddress(): Promise<string> {
  const response = await fetch(
    'https://api.ipify.org/?format=json',
  );
  const data = await response.json();
  return data.ip;
}

async function run(): Promise<void> {
  try {
    const ip = await getMyIpAddress();
    console.log(`Your IP address is: ${ip}`);
  } catch (error) {
    console.log(error);
  }
}

run();
```

As I said above, every function that has an `await` keyword must be marked as `async`. This is because the `await` keyword can only be used inside an `async` function. In this code, since the `getMyIpAddress` function contains an `await` statement, it needs to be declared as `async`.

To ensure the code runs smoothly, I wrapped the execution inside another function called `run`. This function serves as the entry point for executing the code. By marking it as `async`, we can use the `await` keyword inside `run` to pause the execution and wait for the asynchronous operations to complete, such as the `getMyIpAddress` function.

When `run` is called, it triggers the execution of the code inside it. The `await getMyIpAddress()` line within `run` causes the function to pause and wait for the `getMyIpAddress` function to resolve and return the IP address. Once the IP address is obtained, it is stored in the `ip` variable, and the code proceeds to the next line, which logs the IP address to the console.

By wrapping the execution inside the `run` function and marking it as `async`, we ensure that the `await` keyword can be used within the function, allowing us to handle the asynchronous operations gracefully.

When the `fetch` function is called with the `await` keyword, the `getMyIpAddress` function exits immediately.

When `fetch` resolves successfully, the result of the promise is set as the value of the `response` constant, and then execution continues with the next line of code. If the promise rejects, the error will be thrown as an exception, which is caught higher up.

Likewise, the call to `getMyIpAddress` works the same way. Execution is halted at that line (but the application keeps running as normal). When the promise returned by `getMyIpAddress` resolves, its response is set as the value of the constant `ip`, and execution picks up from that point. Any exceptions thrown will be caught in the `catch` block.

Using `async` and `await` is wonderful in that your code looks more traditional, but you should never forget there are promises underneath the magic.

# Some are More Equal Than Others

When are values equal? The answer may surprise you. While not specific to TypeScript, this topic has bitten many new JavaScript and TypeScript developers. Consider the following example.

```typescript
console.log('1' == 1); // true
console.log('' == 0); // true
console.log('1' == [1]); // true
```

If you expected those all to be false, then this explanation is for you. If you are following along in the TypeScript playground, you will notice that it warns you not to do those things.

The problem is that JavaScript will coerce from one type to another to make the comparison, even if that is not what you want or expect. The solution is to use `===` instead of `==`, which says not to use coercion. Thus, each of the following lines return the expected value of false.

```typescript
console.log('1' === 1); // false
console.log('' === 0); // false
console.log('1' === [1]); // false
```

It is recommended that you use `===` for comparisons, and most teams will use a tool to ensure it.

# What About var?

You may have noticed that I did not use the `var` keyword in any of my examples. TypeScript, along with more recent versions of JavaScript, introduce two new ways of declaring variables (and constants), respectively, `let` and `const`.

The important difference to note is that objects declared with `var` are "function-scoped", while those declared with `let` are "block scoped." Consider this example.

```typescript
for (var i = 0; i < 100; i++) {
  if (i % 3 === 0) {
    console.log('FIZZ');
  }
  if (i % 5 === 0) {
    console.log('BUZZ');
  }
  if (i % 5 && i % 3) {
    console.log(i);
  }
}

console.log(i); // 100
```

In this case, you might expect `i` not be legal on that last line, given that it was defined as part of the `for` loop. But because `var` is function-scoped, it is defined anywhere in the function in which it appears, even if it were declared really deeply.

Had we used `let` instead of `var`, the generated JavaScript will be identical, but the TypeScript compiler will flag the use of `i` in `console.log` to be an error. The recommendation is to use `let` instead of `var` in your TypeScript code.

The other new keyword, `const`, works exactly like `let`, in that the object defined will be block-scoped. However, with `const` you must provide a value. Further, once declared, its value can never be changed.

```typescript
const myName = 'Mike';
myName = 'Bob'; // Error - cannot redefine
```

This rule applies only to the named object, and not any of its members (in the case of a complex object or array). For example, you can manipulate the members of an array. You can also add, change, or remove properties to an object. You simply cannot reassign its value.

```typescript
const mike: Member = {
  email: '1234@company.com',
  firstName: 'Mike',
  lastName: 'Smith',
};
mike.email = 'mike';

// These are fine
const allMembers: Member[] = [];
allMembers.push(mike);

// Errors - may not redefine constants
allMembers = [];
mike = {
  email: '2345@company.com',
  firstName: 'Bob',
  lastName: 'Johnson',
};
```

## Summary

As we've explored in this chapter, TypeScript offers a rich and robust set of features that enhance the JavaScript development experience, ensuring type safety and facilitating more reliable, maintainable code. From simple Types, Arrays, Enums, Interfaces, classes, to String Literal Types, TypeScript provides us with the tools to write clear, self-documenting code, where entities and their expected behaviors are clearly defined.

### Digging Deeper into TypeScript

We've only just scratched the surface of what TypeScript can do. With its other features like Generics, Decorators, and advanced type manipulation capabilities such as Mapped Types and Conditional Types, TypeScript has the power to revolutionize how you write JavaScript code.

Moreover, TypeScript's compatibility with JavaScript means that you can start benefiting from it at your own pace. You can start by annotating existing JavaScript code, gradually adopting TypeScript's features as you become more comfortable with them, or even start a new project fully in TypeScript.

The true power of TypeScript comes not just from its features, but from the way it fosters better coding practices, encouraging clarity, precision, and predictability, which in turn leads to more robust and maintainable software.

### Learning and Mastering TypeScript

Remember, the learning journey doesn't stop here. If you want to delve deeper and truly master TypeScript, a wealth of information and resources awaits you. The official TypeScript website, [www.typescriptlang.org](http://www.typescriptlang.org), is a great starting point. It provides detailed documentation, examples, and guides that can help you understand the nuances of TypeScript and apply it effectively in your projects.

### Conclusion

In the end, TypeScript is a powerful ally in the world of JavaScript development. Embracing TypeScript is embracing a future of robust, scalable, and error-resistant code. The journey into TypeScript might be new and challenging, but the rewards are worth the effort. So, keep exploring, keep learning, and most importantly, enjoy the journey into TypeScript.
