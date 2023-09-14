# Guardians of the [Angular] Galaxy

As we journey deeper into Angular, we uncover more powerful tools that not only enhance the functionality of our applications but also secure their operation. One such tool is the Route Guard. Route Guards act as gatekeepers, deciding whether navigation to a requested route is permissible or should be blocked.

In this chapter, we'll take a look at them and review a simple implementation. So, let's dive in and meet these Guardians of the Routes!

## Understanding Angular Route Guards

Angular Route Guards are functions which tell the Angular router to allow or deny navigation to a requested route. They act as security checkpoints, controlling whether a user can navigate to or away from a certain route. Route Guards are a powerful tool to add an extra layer of protection and control to your Angular applications.

Angular offers several built-in guard types like `CanActivate`, `CanDeactivate`, `CanLoad`, and `Resolve`, each serving a specific purpose in the navigation life cycle. These guards can be used to implement complex scenarios such as user authentication, role-based access control, and form-change confirmation.

## The Value Proposition of Guards

The Angular Route Guard comes with a suite of benefits:

1. **User Access Control**: Guards can be used to control which users have access to certain routes based on their roles or permissions.
2. **Data Protection**: They can protect data on a page from being lost when the user navigates away.
3. **Load Optimization**: They can prevent lazy-loaded modules from loading until certain conditions are met.
4. **Data Pre-Fetching**: Guards can fetch the data required for a specific route in advance using `Resolve` guards. We'll look more at the resolver later.

In this chapter, I'll focus on `CanActivate`. I'll talk about `Resolver` guards in the next chapter.

## Practical Application of Guards

To see how Angular Route Guards work in a real-world application, let's create a Guard that checks if a date parameter in a route is valid and not in the past.

```typescript
export dateGuard: CanActivateFn = (route, state) => {
    const dateParam = route.params['date'];
    const date = new Date(dateParam);

    if (!isNaN(date.getTime()) && date > new Date()) {
      return true;
    } else {
      alert('Invalid or past date!');
      return false;
    }
  }
```

Notice that dateGuard is a function instead of a class. This is an example of a functional route guard.

It takes two parameters: `route`, an instance of `ActivatedRouteSnapshot`, and `state`, an instance of `RouterStateSnapshot`. The function can return an `Observable`, `Promise`, a `boolean`, or a `UrlTree`.

- If all guards return `true`, the navigation continues.
- If any guard returns `false`, the navigation is canceled.
- If any guard returns a `UrlTree`, the current navigation is canceled, and a new navigation begins to the `UrlTree` returned from the guard.

The `dateGuard` above is a simple implementation of the `CanActivateFn` function definition.

This function verifies that the 'date' route parameter is valid and not in the past. If the date isn't valid or is in the past, an alert is shown to the user, and navigation to the route is not allowed.

The guard is then applied to a route in the route configuration:

```typescript
import { dateGuard } from "./date.guard";

const routes: Routes = [
  {
    path: "event/:date",
    component: EventComponent,
    canActivate: [dateGuard],
  },
];
```

In this case, the `EventComponent` is activated only if the 'date' parameter in the route is a valid date and is not in the past.

## Beyond Parameter Validation

While the example above focuses on parameter validation, Angular Route Guards can also be used for complex security applications like user authentication and role-based access control. In these scenarios, the guard checks a user's authentication status or roles to determine whether they should be allowed to navigate to a certain route.

Although the guard's internal logic and complexity may vary, the fundamental mechanism remains the same: analyzing the situation (e.g., checking parameters or a user's authenticated state) and making a decision about whether or not to allow navigation.

Here's a basic implementation of an authentication guard:

```typescript
export authGuard: CanActivateFn = (route, state) => {
  authService = inject(AuthService);

  if (this.authService.isAuthenticated()) {
    return true;
  } else {
    console.log("Not authenticated, redirecting...");
    this.authService.redirectToLogin();
    return false;
  }
}
```

In this example, the guard checks if the user is authenticated by calling `isAuthenticated()` on an `AuthService`. If the user is authenticated, it returns true and navigation proceeds. If not, it redirects the user to a login page and returns false, stopping the navigation.

Alternatively, we could have the guard return a `UrlTree` to a login page instead, which would cause the Angular Router to redirect the user to that page.

## The `inject` Function

You may have noticed another new function in that code above. It is worth a brief discussion.

Traditional constructor injection in Angular is a method where dependencies are supplied directly into a class's constructor. The dependencies required by a class are declared as constructor parameters, and Angular's DI system takes care of instantiating and providing those dependencies when the class is created. Here's a brief example of what this might look like:

```typescript
@Injectable()
export class Car {
  constructor(private engine: Engine) {}
}
```

In this traditional approach, the DI system identifies the `Engine` dependency based on the type annotation in the constructor and injects an appropriate instance.

The `inject` function, on the other hand, provides an alternative way to acquire dependencies within an injection context. It can be used not only in the constructor but also in field initializers and specific factory functions, called _injection contexts_. Here's how you could utilize the `inject` function:

```typescript
@Injectable({ providedIn: "root" })
export class Car {
  radio: Radio = inject(Radio);
  spareTire = inject(Tire);

  // Empty constructor no longer required
}
```

The key differences between traditional constructor injection and using the `inject` function include:

1. **Usage Beyond Constructors**: Unlike constructor injection, where dependencies are only injected through the constructor parameters, `inject` allows for the manual injection of dependencies even in property initializations.
1. **Explicit Injection**: The `inject` function offers a more explicit way to request dependencies, giving you the option to inject a dependency where needed, rather than solely at the construction phase.

### Injection Context

The injection context refers to the specific situation or place where the `inject` function can be utilized. It is essential to adhere to the injection context because calling the `inject` function outside of it will result in an error. This context ensures that dependencies are provided consistently and only when appropriate, maintaining the integrity of the application's architecture.

For example, calling `inject` within the lifecycle hooks like `ngOnInit` is disallowed, as it is considered outside the valid injection context. This context-awareness guarantees that dependencies are only injected at suitable points, thus avoiding potential conflicts or unexpected behaviors in the application.

In summary, the `inject` function offers a flexible, powerful alternative to constructor injection, with clear benefits in terms of control, code conciseness, and error management. Understanding and adhering to the injection context is critical to utilizing this function effectively within the application's design.

## Conclusion

Angular Route Guards are an indispensable tool for Angular developers, providing powerful control over access and navigation within an application. By utilizing their capabilities, developers can ensure the right data is shown to the right user at the right time, enhancing both data security and user experience. In the next chapter, we will delve into more complex guard use cases and also explore how to handle redirection when a guard prevents navigation.
