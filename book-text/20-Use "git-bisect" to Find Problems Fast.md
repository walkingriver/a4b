# Use "git-bisect" to Find Problems Fast

Recently I noticed that one of the styles on a custom component got messed up. The component consists of a piece of text between two icons. There used to be some generous space between the icons and the text, but now there isn't, as you can see in Figure 20.1.

![Figure 20.1, Stepper buttons with no spacing](image-16.png)

I first suspected that a class had been changed. Maybe it had some padding and now it doesn't, but a quick check in the Chrome Developer Tools showed no such padding in the production version (which still looks right).

It became apparent that I broke it somewhere over the past week or so. I commit often, so looking through each commit would be laborious and time-consuming. If only there were a way to narrow down the commits and go through them logically and methodically.

Well, with git-bisect, there is!

## Git-Bisect to the Rescue

What is git-bisect? It's a clever and little-used utility that will let you blast through a series of commits by cutting the commits in half, testing the app, and then repeating the process.

Here's how it works, and how I used it.

First, find a commit somewhere in the past where you know for a fact that code worked. Copy this commit's hash. It will be your starting point. The other end of the bisect is your HEAD commit, the one you know is broken.

I had to look through my git log to find the commit that originally included my code. I ran `git log --- oneline | head -25` to see my last 25 commits. I found the one where I first implemented the code that is now broken, remembering it was working at the time. I made note of its commit hash, 2d8cf845.

Armed with this information, I entered the following commands:

```typescript
git bisect start
git bisect good 2d8cf845
git bisect bad HEAD
```

The first command initializes git-bisect, but otherwise doesn't do anything. The second command tells git that I know that commit was good. My final command indicates a commit that I know doesn't work: my bad commit. Instead of providing a commit hash, I simply used HEAD, which is my most recent commit.

The output from git-bisect tells me there are 6 revisions or commits between those two, and that it should take me 3 steps to find the culprit.

## Run the app

Now it's time to run the app and see if the problem exists. My issue is visual, so I'll have to build and run the app and inspect the output.

It looks perfect. You can see the spacing between the number 1 and the icons in Figure 20.2.

![Figure 20.2, Stepper buttons with desired spacing](image-17.png)

So, now I tell git that this is a good commit.

```typescript
git bisect good
```

Notice that I only needed to tell git-bisect that this commit is good. It then automatically selected a commit between that one and my bad one and checked it out for me.

I rebuilt and refreshed the app, and that one was also good.

This one was also good, so I repeated the above command.

The command output tells me that there are 0 revisions and 0 steps left, so this had better be the bad one, which it turned out to be.

With git-bisect's help, I only had to try three commits to find the culprit.

Had it not been my final commit, I would have marked it with `git bisect bad`, and then git would have continued narrowing down the changes until we finally found the offender.

## Find the Bug

Now that I have the commit, I can look at the diff and find out what I might have done to break it.

I loaded the project in GitHub and navigated to that commit. Fortunately, my commits aren't very big and I quickly spotted the problem. The custom component uses a 3rd party flex layout library, which is required for the components to render correctly. For some reason I cannot recall, I had removed the inclusion of that library from my main set of scripts.

Replacing that single deleted line solved my problem. Being the good team player that I am, I created a new fix branch and opened a pull request with that single-line change.

## Conclusion

Finding an unexpected bug is never a good feeling. It's even worse when you can't remember touching the code that broke. In my case, I had made the change haphazardly, thinking I was deleting an unused import. I was wrong.

Fortunately, I was able to use git-bisect to find the problem commit, identify the change that caused the break, and issue a correction. This entire experience, start-to-finish, took me about half an hour, including the time I spent keeping notes and writing up this explanation.

There is a lot more to git-bisect that what I've shown you here. If you have unit tests, and you're trying to find the commit that broke one or more of them, it's even possible to have git-bisect do most of the work for you. It can run your tests and decide for itself whether the commit was good or bad. That's an advanced topic for another day.

Hopefully, the next time you find yourself in a similar predicament, you'll remember this article and try git-bisect yourself.
