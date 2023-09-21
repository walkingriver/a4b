# Standalone Components

Introduced as a developer preview in Angular 15.2, standalone components in Angular mark a significant step towards simplifying the development process. They eliminate the need for `NgModule`s, streamlining the developer experience and making the code more concise and clear. This new approach allows developers to specify dependencies directly within components, without having to navigate through `NgModule`s.

## SCAM Pattern

Prior to standalone components, many Angular developers turned to a pattern that became known as SCAM. The SCAM pattern in Angular stands for Single Component Angular Module. It's a design pattern where each Angular component is paired with its own Angular module.

The SCAM pattern emerged as a response to some of the complexities and challenges associated with traditional Angular module organization. In a typical Angular application, components, directives, and pipes are often grouped into shared or feature modules. While this approach has its advantages, it can lead to challenges in understanding dependencies, promoting reusability, and optimizing performance.

The SCAM pattern addresses these challenges by providing a clear and concise way to organize components and their dependencies. It aligns with modern development practices and the trend towards more modular and maintainable code.

## Introduction to Standalone Components

Standalone Components in Angular are a more recent development that aims to simplify the structure of Angular applications by reducing the reliance on NgModules. While the SCAM pattern provided a way to encapsulate components with their dependencies, Standalone Components take this concept further by eliminating the need for additional modules altogether.

Another thing that makes standalone components particularly appealing is their ability to be adopted incrementally. Existing applications can embrace this new style without any breaking changes, providing a smooth transition path. Moreover, standalone components are compatible with existing `NgModule`-based libraries and dependencies, allowing developers to take full advantage of the existing Angular ecosystem.

The introduction of standalone components also brings enhancements to routing and lazy loading. The updated router APIs are designed to work seamlessly with standalone components, simplifying common lazy-loading scenarios and removing the need for an `NgModule`. This not only makes the code cleaner but also enhances the application's performance.

# Eliminates app.module.ts

Bootstrapping an Angular application has also become more straightforward with standalone components. Developers can now bootstrap without any `NgModule`, using a standalone component as the root. This further simplifies the application structure and reduces boilerplate code.

Library authors will find standalone components beneficial as well. They can export standalone components, directives, and pipes, offering more flexibility in structuring and distributing their libraries. This pattern is useful for creating sets of cooperating directives that work together to form a logical unit, such as a carousel widget.

Standalone components also introduce new ways of configuring dependency injection. The concept of environment injectors and standalone injectors provides more control and flexibility over how dependencies are managed. This new configuration pattern supports more advanced usage patterns and ensures that standalone components are truly self-contained, preventing any "leakage" of implementation details into the rest of the application.

# Upgrading Your Angular App to Standalone

If you want to migrate your `NgModule`-based app to Standalone, the Angular CLI provides a migration schematic to do most of the work for you, which I will demonstrate here. It's not foolproof, as we'll soon see.

I will continue the application upgrade from the prior chapter by migrating the entire app to standalone components. I'll show the steps, but only some of the resulting code, where it helps to illustrate what's going on.

## Preparing for Migration

If you want to follow along with your own app, ensure that your project is using Angular 15.2.0 or later. I just upgraded mine to 16 in the last chapter, so I've got that covered. Make sure the project builds without any compilation errors and that you have no uncommitted changes. It also helps to start with a clean branch, which I'll do here to save all my work.

```shell
❯ git checkout -b standalone-migration
Switched to a new branch 'standalone-migration'
```

## Running the Schematic

I initiated the migration by running the following command, which offered a few options. This is a multi-step process, and I'll show each step and some of what changed. I selected the first option to convert all components, directives, and pipes to standalone.

```shell
❯ ng generate @angular/core:standalone

? Choose the type of migration: (Use arrow keys)
❯ Convert all components, directives and pipes to standalone
  Remove unnecessary NgModule classes
  Bootstrap the application using standalone APIs

? Which path in your project should be migrated? (./)

    🎉 Automated migration step has finished! 🎉
    IMPORTANT! Please verify manually that your application builds and behaves as expected.
    See https://angular.io/guide/standalone-migration for more information.
UPDATE src/app/home/home.page.ts (402 bytes)
UPDATE src/app/student-info/student-info.page.ts (2390 bytes)
UPDATE src/app/roster/roster.page.ts (3071 bytes)
UPDATE src/app/home/home.module.ts (423 bytes)
UPDATE src/app/student-info/student-info.module.ts (521 bytes)
UPDATE src/app/roster/roster.module.ts (437 bytes)
UPDATE src/app/app.component.spec.ts (2218 bytes)
UPDATE src/app/home/home.page.spec.ts (636 bytes)
UPDATE src/app/roster/roster.page.spec.ts (650 bytes)
UPDATE src/app/student-info/student-info.page.spec.ts (686 bytes)
```

### Review a Change

Let's take a look at one of the Angular components to see what the migration scripts did. I'll show only the semantically meaningful changes to the Roster page component.

#### Before:

```typescript
@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.page.html',
  styleUrls: ['./student-info.page.scss'],
})
```

#### After:

```typescript
@Component({
    selector: 'app-student-info',
    templateUrl: './student-info.page.html',
    styleUrls: ['./student-info.page.scss'],
    standalone: true,
    imports: [
        NgIf,
        IonicModule,
        FormsModule,
        AsyncPipe,
        JsonPipe,
    ],
})
```

At first, you may be wondering how adding _more_ code is a good thing. Remember that we'll be removing an entire `NgModule`, so please trust the process for now.

The migration added the `standalone: true` property to the component's metadata, marking it as a standalone component. An `imports` array was also added, listing the dependencies that this component relies on, including the newly imported modules and directives. Standalone components need to tell Angular about other components and modules they plan to use. The tradeoff is that by adding these imports here explicitly, Angular's tree-shaking is able to remove unused components more intelligently, potentially leading to smaller bundle sizes. Some of these would have been imported into the page's `ngModule` or in app.module.ts, but those will both be deleted soon.

After that, I ran the application and tests to ensure everything was working as expected. I'm probably being over cautious, but I also committed the changes to my Git repository before taking the next step.

### Step 2: Remove Unnecessary NgModule Classes

Next, I needed to remove unnecessary NgModule classes. With standalone components, I don't need any of the individual component modules, nor do I need their individual routing modules. However, I do need to make sure that each page's routes are moved to the app-routing module.

Ever the optimist, I tried running the migration script again, this time selecting the second option.

```shell
❯  ng generate @angular/core:standalone

? Choose the type of migration:
  Convert all components, directives and pipes to standalone
❯ Remove unnecessary NgModule classes
  Bootstrap the application using standalone APIs
? Which path in your project should be migrated? ./
  🎉 Automated migration step has finished! 🎉
  IMPORTANT! Please verify manually that your application builds and behaves as expected.
  See https://angular.io/guide/standalone-migration for more information.
Nothing to be done.
```

This was unexpected until I thought it about it some. As I said, I tend to use the SCAM pattern on my Angular apps and this app was no exception. Apparently the Angular CLI migration doesn't know how to do that, which is a little disappointing.

The meant I had to do this manually. As I said before, I needed to move each page's routing into app-routing.module.ts and then I could simply delete the modules for each component.

#### Routing

Let's take a look at the app-routing before and after.

**Before:**

```typescript
{
  path: 'home',
  loadChildren: () =>
    import('./home/home.module').then((m) => m.HomePageModule),
},
{
  path: 'student-info',
  loadChildren: () =>
    import('./student-info/student-info.module').then(
      (m) => m.StudentInfoPageModule
    ),
},
{
  path: 'roster',
  loadChildren: () =>
    import('./roster/roster.module').then((m) => m.RosterPageModule),
},
```

**After:**

```typescript
{
  path: 'home',
  loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
},
{
  path: 'student-info',
  children: [
    {
      path: ':id',
      loadComponent: () => import('./student-info/student-info.page').then((m) => m.StudentInfoPage),
    }
  ]
},
{
  path: 'roster',
  loadComponent: () => import('./roster/roster.page').then((m) => m.RosterPage),
},
```

Initially, I was leveraging the `loadChildren` method to lazily load entire modules. By replacing those with standalone components, that was no longer necessary, or even possible. So, I transitioned to the `loadComponent` field, which has essentially the same syntax. You import the component directly by file name, which returns a promise. Once it's loaded, you can grab the component itself in a type-safe manager in the callback.

It's a subtle change, but it significantly improved the code's readability, ensuring that future developers can navigate it with ease.

Once I did that, I was able to delete all the existing components' modules and run the app again.

#### Ionic 6.x Warning

This is a book about Angular, not Ionic. That said, I do want to point out one additional change I needed to make, given that the app in question uses Ionic components.

Ionic 6 supported standalone components through the use of an `environment` injector. Without that, an Angular app using Ionic with standalone components wouldn't work. The symptom is that the app won't render anything but a white screen.

Conveniently, the fix is printed right in the browser console.

To fix it, you simply add a couple of lines of code.

**Before: app.component.ts**

```typescript
constructor(private platform: Platform, private students: StudentsService) {
  this.initializeApp();
}
```

**After: app.component.ts**

```typescript
constructor(public environmentInjector: EnvironmentInjector, private platform: Platform, private students: StudentsService) {
  this.initializeApp();
}
```

I added the `EnvironmentInjector` object into my app component's constructor. Then, in the app component's HTML file, I used Angular data binding to insert it into the `<ion-router-outlet>`.

**Before: app.component.html**

```html
<ion-router-outlet
  id="main-content"
></ion-router-outlet>
```

**After: app.component.html**

```html
<ion-router-outlet
  id="main-content"
  [environmentInjector]="environmentInjector"
></ion-router-outlet>
```

_Note: Ionic 7 solves this problem entirely by supporting standalone components natively._

### Step 3: Bootstrap the Project Using Standalone APIs

As the final step, I bootstrapped the project using standalone APIs. That meant running the schematic one last time.

```shell
❯ npx ng generate @angular/core:standalone
? Choose the type of migration:
  Convert all components, directives and pipes to standalone
  Remove unnecessary NgModule classes
❯ Bootstrap the application using standalone APIs
? Which path in your project should be migrated? ./
    🎉 Automated migration step has finished! 🎉
    IMPORTANT! Please verify manually that your application builds and behaves as expected.
    See https://angular.io/guide/standalone-migration for more information.
DELETE src/app/app.module.ts
UPDATE src/main.ts (995 bytes)
UPDATE src/app/app.component.ts (1159 bytes)
UPDATE src/app/app.component.spec.ts (2198 bytes)
```

Let's review what it did.

**Before: app.component.ts**

```typescript
@Component({
   selector: 'app-root',
   templateUrl: 'app.component.html',
   styleUrls: ['app.component.scss'],
})
```

**After: app.component.ts**

```typescript
@Component({
   selector: 'app-root',
   templateUrl: 'app.component.html',
   styleUrls: ['app.component.scss'],
   standalone: true,
   imports: [
       IonicModule,
       NgFor,
       RouterLinkActive,
       RouterLink,
   ],
})
```

In the `app.component.ts`, the schematic added the `standalone: true` property to the `@Component` decorator. Moreover, the necessary dependencies like `IonicModule`, `NgFor`, `RouterLinkActive`, and `RouterLink` were moved directly into the component's `imports` array.

The schematic then deleted the `app.module.ts` file completely.

**Before: main.ts**

```typescript
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
```

**After: main.ts**

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
    ),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
}).catch((err) => console.log(err));
```

In `main.ts`, rather than using the conventional `bootstrapModule` method to start the application with a module, the schematic changed it to call the `bootstrapApplication` function to initiate the app directly. Required providers and configurations were directly imported and integrated during this bootstrapping phase.

### Does it work?

Automatic upgrade code is great, but to be useful, it still has to work properly. I fired up the app with `npm start` and quickly ran through its functionality. It all worked as expected.

Satisfied with the results of the migration, I committed the code and pushed to my repository on GitHub.

## Conclusion

Migrating to standalone components in Angular was a significant transformation, but by taking a methodical approach, I ensured a successful migration. Regularly committing changes, running tests, and verifying the application's functionality at each stage gave me confidence in the process. I'm pleased with the result, and I feel that my codebase is now more streamlined and maintainable, aligning with modern development practices.
