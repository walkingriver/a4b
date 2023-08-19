# Fix Mistaken Git Commits

Recently one of my development teams had a merge problem. For version control, they use a modified form of GitFlow ([https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)), and it was time to merge from the develop branch to the release branch. If things are done correctly, this should always be a clean, simple merge. It is especially true in this case because it was their first release for a new project. The team opened a pull request from develop to release and then reported to me that GitHub was reporting merge conflicts. Huh? How is that possible? The release branch should be empty. Except that it wasn't.

As it turned out, a well-meaning developer on the team knew that the code eventually needed to go into release, so that's he committed all his changes. Locking down branches is a topic for another day, I suppose. I had to deal with the problem in front of me first.

I ran the following command on the release branch.

```bash
git log --oneline
```

Its output showed something like this:

```bash
1 852291a blah blah blah
2 f575c87 blah blah
3 83d855d blah blah
4 9fa11df blah blah blah blah
5 111b003 blah blah
6 2b3a530 blah blah blah
7 a4c5f54 blah blah blah blah blah blah
8 b2a62fa blah blah blah blah blah blah blah blah blah
9 5fb67b9 blah blah blah
10 4d1a5fc blah blah blah
11 ed40aec Initial commit
```

No, we really don't use "blah blah" as commit messages. As I said, these commits were made directly to the release branch, and not through a merge or pull request from develop, which is the prescribed method. I don't hold any grudges against the well-intended developer. Both git and this workflow are new to that team, and I mostly blame myself for not at least setting up a 30-minute discussion ahead of time. They weren't new to source control, just this particular process.

Regardless of my feelings or the good intentions of the team, I was faced with a problem I had to solve. A new pull request from develop to release was waiting. The test team was waiting for a release build, and that wasn't happening. I decided that the best and safest thing to do was to undo each of those commits.

So after a bit of Google- and Bing-foo, I landed on some questions and answers at StackOverflow ([about:blank](about:blank)) that enabled me to find just the right sequence of git commands to fix the release branch. I include the experience here in the hopes it may help you someday.

The first thing I had to do was figure out how to revert a series of commits. There were only 11, so I could have done them one at a time, but what if there had been 111 instead? I wanted to understand the process regardless of the number of commits. After reviewing the various commands that are available, I settled on the following syntax:

```bash
git revert --no-edit <oldest-commit-hash>..<newest-commit-hash>
```

This actually took a few tries, because most of the documentation said things like "first bad commit" and "last bad commit." Is "first" the oldest, or is it #1 in the log? Turns out, it's the oldest, which is the highest number in the commit log.

So, to undo all of those commits in the above list, I used the following command:

```bash
git revert --no-edit ed40aec..852291a
```

The --no-edit flag kept git from prompting me to edit the commit message for each of the 11 reverse commits it made. Instead, it used the original commit message, preceded by the word "Revert." Fine by me. After that command completed, each of my commits had a mirrored revert, in reverse order. Checking the directory showed that the only thing present was the initial README.md file. Perfect! So the only thing left to do was push the branch back up to the server:

```bash
git push origin release
```

Back on the server, I checked the open pull request from develop to release, and there were no merge conflicts. I completed the pull request, and the build was able to continue.

Now the testers can get on with their work, and we can all live happily ever after --- until the next problem, of course.

## Summary

Hopefully, reverting a huge series of commits isn't something you need to do often. However, if you do find yourself in a similar situation, remember that it's entirely possible to regain control and restore order. We faced an unexpected situation where a release branch contained numerous direct commits instead of simply being updated through a pull request from the develop branch. Using the `git revert` command, we successfully undid these problematic commits and achieved a smooth pull request and build.
