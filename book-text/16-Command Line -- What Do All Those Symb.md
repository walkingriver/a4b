# Command Line -- What Do All Those Symbols Mean?

_Do you know about all those weird symbols you can use on the command line?_

Even though you might spend most of your time in an interactive development environment (IDE), it's important to understand how to use the command line.

Recently, I saw a tweet suggesting that if you place a single ampersand between two shell commands, they run in parallel. While partially true, the tweet didn't fully explain the whole scenario. So, I thought of revisiting the basics and explaining just what these and other symbols do in a Linux, MacOS, or even Windows (Bash) terminal.

This is the tweet I referred to:

> _Did you know that a double ampersand && will run multiple scripts sequentially while a single & will run them in parallel?_  
> _--- Dan Vega (@therealdanvega) April 11, 2019_

**Note**: The examples contained below were all tested and work on a macOS terminal running the bash shell. They should work on any other common shell in Linux, and should even work in GitBash for Windows. As always, your mileage may vary.

## And `&&`

Most developers are familiar with this example, especially when dealing with build scripts. For example:

```bash
npm test && npm run build
```

The common understanding is that this command runs `npm test` and then `npm run build`. But that's not quite right. It's more accurate to say that it runs `npm test`, and only if `npm run` succeeds (exit code is 0), will it run `npm run build`. If the first command fails (exit code != 0), then the second command won't run at all. This is typically the behavior you'd want. For instance, in this example, if the tests fail, there is no reason to run the build.

To validate this, try the following in your terminal:

```bash
ls this-folder-does-not-exist-anywhere && echo "I will not execute"
```

You should see an error message, and the echoed string will not appear. You can chain as many commands as you like using `&&`, just remember that the first command that fails will interrupt the rest.

## Or `||`

What if you want the sequence of commands to continue regardless? You might try using the Or (`||`) operator, but that probably won't work the way you think. While the `&&` operator terminates after the first failure, `||` terminates after the first success. So, the second command will only run if the first command fails!

Here's a demonstration:

```bash
echo "I worked" || echo "Which means I will not execute"
```

This construct is often used as a simple test mechanism before creating a file or folder. Consider this example:

```bash
[ -d ~/i-do-not-exist ] || mkdir ~/i-do-not-exist
```

The first command tests whether a directory exists. Thus, the entire command says, "make this directory, but only if it does not already exist." This method avoids writing an error to the terminal, unlike using `ls ~/i-do-not-exist`.

## My Home Folder `~`

If you're unfamiliar with the tilde `~` symbol from the previous example, it's a handy shortcut representing your home directory. Here's how to expand it using the `echo` command:

```bash
echo ~
```

Output:

```bash
/Users/michael
```

## Background `&`

Let's return to the tweet suggesting that a single `&` allows the commands to run in parallel. While true, it doesn't tell the whole story. Generally, you'd use the `&` operator when you want a long-running shell script to execute in the background. Sure, you could open another terminal session, but that would use more resources.

Here's an example of a long-running command that searches for all PDF files in my home directory, writing each file's path into a text file named `my-pdf-files.txt`.

```bash
find ~ -name *.pdf > ~/my-pdf-files.txt
```

On my i7 MacBook Pro, this command takes over 2.5 minutes to execute. Adding the `&` operator to the end of that command causes it to run as a background job, allowing you to continue with other tasks.

```bash
find ~ -name *.pdf > ~/my-pdf-files.txt &
```

On execution, you get an immediate response like this:

```bash
[1] 35715
```

This output indicates that my background job is Job #1, and its process ID is 35715. You can check its status with the `jobs` command.

```bash
jobs
```

Output:

```bash
[1]+ Running find ~ -name *.pdf > ~/my-pdf-files.txt &
```

You can bring it to the foreground with the `fg 1` command, which blocks your terminal. Once in the foreground, you can suspend the job by typing `Ctrl+Z`, and then typing `bg` to send it back to the background.

To terminate the process, use the `kill 35715` command (the process ID from initial command's output).

How does this work with two commands? If the two commands are related to each other, it probably won't work well. But, if I want to run two similar `find` commands, one looking for PDFs and another for MP3 files, they can run in parallel as it doesn't matter which one completes first.

```bash
find ~ -name *.pdf > ~/my-pdf-files.txt & find ~ -name *.mp3 > ~/my-mp3-files.txt &
```

Output:

```bash
[1] 36782
[2] 36783
```

This command creates two background jobs, indicated by the two job numbers and process IDs provided. When they complete, your terminal will display something like this:

```bash
[1]- Exit 1 find ~ -name *.pdf > ~/my-pdf-files.txt
[2]+ Exit 1 find ~ -name *.mp3 > ~/my-mp3-files.txt
```

## Redirect Output `>`

If you have been following along with these examples, you may have seen a few error messages. Even though the commands are running in the background, the output of both is being displayed at the terminal. That is easy enough to fix, by redirecting its output, using the "greater than" or "right angle bracket" symbol (`>`). In fact, I used that in the previous two examples.

Using a single `>` symbol tells the shell to redirect the standard console output (stdout) to the file specified. So the `find` command above sends its standard output to the file. If the file does not exist, it will be created. If it does exist, it will be replaced.

If you want the command to append to the file instead of creating it from scratch, you can use two `>>` symbols.

None of that prevents errors from being displayed on the console, because that is a different output stream (known as stderr). You have a couple of alternatives here. You can send the errors into a different file, by specifying another redirect, like this.

```bash
find ~ -name *.pdf > ~/my-pdf-files.txt 2>~/errors.txt
```

The `2>` specifically indicates that you are redirecting `stderr`. As you might guess, `1>` indicates `stdout`, but the default redirect is `stdout`, so the `1` can be omitted.

Further complicating things, you can redirect `stderr` to the same target as `stdout`, by using `&1` as its target, like this...

```bash
find ~ -name *.pdf > ~/my-pdf-files.txt 2>&1
```

`&1`, another example of `&` that means something else entirely, is shortcut for "where `stdout` is being sent."

I do not often have occasion for `stdout` and `stderr` to end up in the same file, particularly in the above examples, where I am collecting files of a certain type into a file of those files. In those scenarios, I would prefer simply to throw those errors away.

In MacOS or Linux shells, I can choose to redirect `stderr` to `/dev/null`, a special file that simply ignores everything. On Windows, I understand there is a special file called `nul` that accomplishes the same thing.

So my complete command above will look like this.

```bash
find ~ -name *.pdf > ~/my-pdf-files.txt 2>/dev/null
```

## Redirect Input `<`

I see this used less often, as most commands accept the name of an input file as an argument. Back in the day™, many (if not most) commands operated on standard input (stdin), by default, the keyboard, and sent its output to `stdout`.

Imagine I want to know how many of those PDF files above were found. I could open the file in my favorite text editor and check, but there is an easier way. I can type this command in the terminal.

```bash
wc -l < ~/my-pdf-files.txt
```

Result:

```
3308
```

Yeah, I had no idea I have that many. `wc` is the "word count" command, and the `-l` switch tells it I only care about the number of lines. By default, `wc` takes its input from `stdin`, which you can see by typing the command by itself, entering any text you want, ending your input by typing `Ctrl+D`.

```bash
wc -l
```

Input:

```
Mike
was
here
Ctrl+D
```

Result:

```
3
```

Notice that the `Ctrl+D` isn't counted as a line. It also needs to be specified on a line by itself. If you type it at the end of a line, it will be part of that line.

This strategy works with any command that accepts input from `stdin`, which is most commands available in the terminal.

One command I see most often is `more`, which is used to page the output of a file.

```bash
more < ~/my-pdf-files.txt
```

Again, I do not see this used much anymore; most of these commands accept the file to be operated on as an argument. This version of the command is far more common.

```bash
more ~/my-pdf-files.txt
```

## I/O Pipe `|`

What about the single `|` operator? This is an I/O Pipe. It uses the output of the first command as input to the second command. Think of this as a combination of both `>` and `<`.

What if I wanted a sorted list of those PDF files? I could use the `sort` command after the fact. However, I could also use the `|` pipe as part of the `find` command, ignoring errors, sorting the output, finally depositing the information in a new file, executing the entire thing as a background job.

```bash
find ~ -name *.pdf 2>/dev/null | sort > ~/my-pdf-files.txt &
```

## Expand \$

Every system has environment variables. These are settings specific to the running system. On my Mac, I have more than 100 of them. If you need to use them inside of a shell script or another command, they can be convenient to know about, even when they have a command equivalent.

For example, I mentioned \~ above. You can also reference that with the \$HOME environment variable. On my system, I also have things like \$HOSTNAME, \$USER.

The outputs of these commands are often used inside of other commands.

```bash
echo My home directory is \~
echo My home directory is \$HOME
```

A very common use of this is to see what folders on your system are searched for executable files. This is allows you to type java -version instead of its absolute path, which would be much longer and more inconvenient to type.

```bash
echo \$PATH
```

## Expansion within \" \"

The echo command above is special. It can handle multiple parameters. Most commands prefer you to surround a string like that in quotes, to be considered a single parameter. In that case, it is important to know the difference between single quotes (\') and double quotes (\").

When you use double quotes, your environment variables will be expanded.

```bash
echo \"Hi, \$USER! Have you cleaned up your \$HOME folder today?\"
```

Output:

```
Hi, michael! Have you cleaned up your /Users/michael folder today?
```

In this command, the \$USER and \$HOME variables are both expanded. The entire string is passed as a single parameter to the echo command.

## No Expansion within \' \'

If you do not want the environment variables to be expanded, you can use single quotes instead (\').

```bash
echo \'Hi, \$USER! Have you cleaned up your \$HOME folder today?\'
```

Output:

```
Hi, \$USER! Have you cleaned up your \$HOME folder today?
```

## Use Command Output \`\`

What if you want to execute a command and include its output as part of another command? For that, you can surround the command with back-ticks (\`). This is different from output piping, as it is not necessarily redirecting the output of one command as the input to another command. Consider this overly simplistic example.

```bash
echo \"You have \`wc -l \< \~/my-pdf-files.txt\` PDF files.\"
```

Output:

```
You have 3308 PDF files.
```

The wc command is executed, its output is placed into the string at that point, and then the entire string is passed to the echo command.

Another place I use this pattern often is trying to find the actual location of an executable. On my Mac, most executables are symbolically linked into the /usr/bin folder. So this command does not provide the information I need.

```bash
which java
```

Output:

```
java is /usr/bin/java
```

To know where it really is, I will use the ls -l command on the output of the which java command, like so.

```bash
ls -l \`which -p java\`
```

The -p switch shortens the output to just the path, without the message \"java is\". On my system, this expands to the command I really want to run.

```bash
ls -l /usr/bin/java
```

Output:

```
lrwxr-xr-x 1 root wheel 74B Sep 11 2018 /usr/bin/java -\> /System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java
```

## History!

The last symbol I want to mention is the exclamation mark, or bang (!). This symbol allows you to execute any command in your command history. To see a list of these commands, enter the following command.

```bash
history
```

Output:

```
657 which -p java
658 ls -l \`which -p java\`
659 history
```

You will be presented with a possibly-lengthy list of commands, with the most recent at the end of the list. To execute any of them, simply type the bang followed by the command number shown next to the command.

```bash
!657
```

Output:

```
which -p java
/usr/bin/java
```

You can use the grep utility to search your history. For example, here are all the find commands I ran writing this chapter, piped through the uniq utility to get only unique commands.

```bash
history \| grep find \| uniq
```

Output:

```
585 find \~ -name \*.pdf \> \~/my-pdf-files.txt
586 find \~ -name \*.pdf \> \~/my-pdf-files.txt &
589 find \~ -name \*.pdf \> \~/my-pdf-files.txt & find \~ -name \*.mp3 \> \~/my-mp3-files.txt &
605 find \~ -name \*.pdf 2\>/dev/null \| sort \> \~/my-pdf-files.txt
606 find \~/Downloads/ -name \*.pdf 2\>/dev/null \| sort \> \~/my-pdf-files.txt
608 find \~/Downloads/ -name \*.pdf 2\>/dev/null \| sort \> \~/my-pdf-files.txt &
663 history \| grep find \| uniq
```

### Ctrl+R Search History

As a bonus, in some shells, you can also use the keyboard
shortcut Ctrl+R to search your history interactively. To see this in
action, type Ctrl+R followed by the text of a command, for
example, find. The most recent match will appear. Continue
typing Ctrl+R to step backwards through the history. At any point, you
can stop by pressing Space, or the right or left arrow keys. You are
then free to edit the command, pressing Enter to execute it.
Press Ctrl+C to get out of the history without doing anything.

### Summary

Even though they are specifically targeted to \*nix-based OSes, many of
these work in GitBash or similar on Windows.

I have only scratched the surface of the special symbols available in
many terminal shells.
