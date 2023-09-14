# Best Practices for Handling Changes to Input Properties in Angular

## The Pros and Cons of Property Setters vs ngOnChanges

As Angular developers, one of the challenges we often face is how to handle changes to input properties in our components. There are a few different approaches we can take, and in this article, we'll take a look at the pros and cons of using property setters versus the ngOnChanges lifecycle hook. We'll also provide some guidelines for deciding which approach is best for your project.

A recent tweet about @Input() changes in Angular got a lot of discussion going. It got enough attention and discussion that I thought it would be valuable to capture the ideas and suggestions into a single place. At the time of this writing, I still haven't decided which of the various approaches I personally prefer, though I will tell you what I did in this particular application.

## The Scenario That Started It All

I have a UI component I've written in Angular that needs to display a collection of buttons. The component doesn't know or care what the buttons contain. It simply ensures that only one button is selected at a time and emits an event when that selection changes.

For simplicity, here is one possible use of this component. Think of them as "radio buttons" implemented as a collection of "pill buttons" as you can see in Figure 12.1.

![Figure 12.1, Radio "pill" buttons](image-12.png)

What I want to point out are the captions above each button. When I started to implement this component, I found an existing component in my project that implemented most of this functionality, but didn't support those captions. You can see an example of these in Figure 12.2.

![Figure 12.2, Buttons without a label caption](image-13.png)

When I added support for the captions, I found I needed a top margin to prevent the captions from running into the content above. That broke the spacing for the buttons with no captions. I decided that maybe I could introduce a class that added some top margin if any of the buttons contained a caption.

## The Case for ngOnChanges

At first, I simply dropped the code I needed into a fresh ngOnChanges function, using this code to recalculate the value whenever the input changed.

```typescript
// When the selectableTimes input changes, check for captions and set a local variable if any are found.
ngOnChanges(changes: SimpleChanges) {
  if (changes.selectableTimes) {
    this.hasCaptions = this.selectableTimes.some(
      (selectableTime) => selectableTime.caption
    );
  }
}
```

It worked, but then it occurred to me that a setter might make more sense. I immediately sent the tweet above to get others' opinions.

One commenter suggested that we should use ngOnChanges because "business logic in setters are strange."

Igor made a strong case for ngOnChanges, going so far as posting another twitter thread with sample code. His warning about not using setters if they have to read any other input properties was something I hadn't considered. My use case did not, but it was something to keep in mind.

The opinions kept coming.

Josh said "anything that updates a computed value or needs to react based on multiple inputs, I will use ngOnChanges. For instance, building a slider with min/max inputs...convert min/max to numbers, validate range in ngOnChanges."

Ryan lent his support for ngOnChanges for my use case, saying that I should use "OnChange for inputs as it feels more visible and correct. I only really used setters for simple things like aliasing form controls etc." The implication is that because I was computing other values from the change, it makes more sense to do as part of a "change" event.

Another response from Rob was to use ngOnChanges to update internal observables that are then bound to the template with async pipes. He didn't provide sample code, but I imagine the change would trigger a new value on an internal RxJS Subject.

# Best Practices for Handling Changes to Input Properties in Angular

## The Case for Setters

Despite the opinions above, I decided to try a setter to see if it looked or felt any better. Using a property setter gave me the direct option to run additional logic whenever the input value changed. Quite frankly, there is little difference between this and the ngOnChanges code, except I don't need a conditional to see what had changed.

```typescript
@Input()
set selectableTimes(value: SelectableTime[]) {
  this._selectableTimes = value;
  this.hasCaptions = value.some(
    (selectableTime) => selectableTime.caption
  );
}
```

## What did others think?

Many people simply replied "setters" without explanation. This is fine, as it's what I asked for. Some added that setters look cleaner, citing the fact that with ngOnChanges, you have to have some sort of conditional to determine exactly what changed.

Ashish prefers setters for this case, particularly because it "takes away the extra check to identify what changed... Also code readability and clear intent."

Aissaoui pointed out that setters trigger on your Input changes, but ngOnchange will trigger on all of inputs [changed].

This pattern was pretty consistent across those favoring setters.

## How Many Inputs?

Ben pointed out that the decision may depend on the number of inputs your component has.

He went on to add that "setters may fire in an unpredictable order...if you need to control the order across multiple inputs, or you need the value of multiple inputs, then use ngOnChanges."

This warning was repeated by others.

## Use a Component Store

Jason suggested not using Inputs at all but use some sort of component store. In fact, the number of suggestions to use a component store may have outnumbered the rest entirely. For my simple use case, I felt this would be overkill.

## Property Change Notification?

This appears to be a missing feature in Angular, as pointed out by Rob. Jay pointed out [an npm package he built](https://www.npmjs.com/package/@trellisorg/update) (https://www.npmjs.com/package/@trellisorg/update) to fill this functional gap. As he describes it, it "Provides a decorator (@Update) that allows you to hook into the assignment of a property in a class and then call some function on an injectable to update it."

This appears to be an elegant solution. If I find myself needing this type of functionality more broadly, I may try it.

## Observable Inputs

A few people made the comment that we could use Observables with our inputs, which could then be directly piped within the component for additional processing. The resulting Observables would then be available for consumption anywhere in the template with little additional effort.

I would consider this approach for a component that has application context logic, but in this case, I'm building something little more than a reusable widget, so I didn't want to build those kinds of smarts into it.

## My Solution

What did I ultimately decide to do? If you look back at my use case, it was simple enough that I could have gone with any of these approaches. In the end, I decided to go with none of them.

I realized that the hosting component has all the knowledge it needs _at compile_ time, so it would be the best authority of when to set this extra CSS class.

```typescript
@Input() showCaptions: boolean;
```

My final code simply adds a new @Input to the component that is set by the user of the component. I was able to remove all the additional logic and ship a simpler component.

## Conclusion

It's important to carefully consider the best approach for handling changes to input properties in your Angular components. While both property setters and the ngOnChanges lifecycle hook have their advantages and disadvantages, it's possible to overthink the problem and end up complicating your solution unnecessarily.

If you find yourself struggling to decide which approach is best for your use case, it can be helpful to step back and consider whether a simpler solution might be sufficient. Remember, the key is to choose an approach that is effective, maintainable, and easy to understand for yourself and your team.
