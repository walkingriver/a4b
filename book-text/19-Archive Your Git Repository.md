# Archive Your Git Repository

Did you know there is a very simple and straightforward command to archive a complete Git repository, while including no historical information? Here I will explain both how and why I do it.

## Why Archive Your Git Repo?

Every few weeks or so, I find myself needing to archive my Git repo. Often I do this to send code to someone who has no reason to access the repo directly. They just need a snapshot of the code, with no history information, because they won't be contributing to it.

I also provide a snapshot of my code for every module in my [Pluralsight courses](https://bit.ly/ps-mike) (https://bit.ly/ps-mike). Being able to archive my Git repo into a zip file is very handy.

For some reason, I can never remember how to do this, and find myself looking it up repeatedly.

## How to Do It

If you want to back up a Git repo, completely detaching it from Git, use one of the following variations of the git archive command:

### Zip File

```bash
git archive --format zip --output /full/path/to/zipfile.zip master
```

### Tar File:

```bash
git archive master > /some/other/path/my-repo.tar
```

### Tar / Bzip:

```bash
git archive master | bzip2 > my-repo.tar.bz2
```

In each of these cases, the word master is the branch I am archiving. You can archive any branch you want, simply by replacing master with the name of your desired branch.

Though not strictly necessary, I like to create my archive from the root of my repo, and have my archive created outside of it.

Note: The archive will not contain the .git directory, but will contain other hidden git-specific files like .gitignore, .gitattributes, etc.

## Summary

In this chapter, I talk about the how and why of archiving a Git repository without its history. I often need to send code snapshots to people who don't need access to the full repo, or for my Pluralsight courses. I share three variations of the `git archive` command to create zip, tar, or tar/bzip archives. Despite its simplicity, I find myself frequently forgetting these commands, so I've documented them here. The archive won't include the .git directory but will have other Git-specific hidden files. I also provide a Stack Overflow link for additional info.

## Reference

- https://stackoverflow.com/questions/160608/do-a-git-export-like-svn-export
