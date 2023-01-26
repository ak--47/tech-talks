
# git gud at git

## wat
`git` is the most popular [version control system](https://www.atlassian.com/git/tutorials/what-is-version-control) for managing code. version control is how we maintain our code over time. all business applications need some kind of version control system in order to:

- keep track of (and document) how an app has changed
- develop, test, and deploy things in separate environments
- facilitate rapid iteration + collaboration 

fundamentally, developing an app is all about trying something new without breaking the thing that already works. `git` brings standards to this workflow, so developers can focus on writing features and not worry about how to manage changes.

conceptually, you can think of _version control_ as similar to the "track changes" or "version history" features you have used for documents and spreadsheets. instead of `myNeatApp_v1_final` we have constructs like `dev`, `staging`, and `production`. instead of `myNeatApp_v2_ak` we have constructs like `branches` and `forks`. instead sending emails like `hey i just made some changes; download the lastest version` we have `commits` and `pull requests`. 

the ultimate purpose of version control is to **standardize the history of any app's development lifecycle**

by itself, `git` just keeps track of changes to files on your local computer. it doesn't keep entire "copies" of old versions... instead it only tracks only what has changed (using line numbers) between "saves". here's a visual representation of what a single "change log" might look like:

![only the "change" is tracked](https://aktunes.neocities.org/trackChanges.png)

all of these "change logs" are stored in a `/.git/` folder, at the top level of a project. a typical `/.git/` folder might look like this:

![an example of a git repo](https://aktunes.neocities.org/gitShot.png)

*these files are **not** meant to be read directly* (i.e. they are not human readable). instead we use other software (command line interface or desktop apps) to read and manage them.

**GitHub** is an online registry and repository of projects tracked with `git`. more simply, it is a web application to manage `git` repositories so many developers can easily collaborate on a single project. 

event though a repository ("repo") is an entire folder of files, you will frequently see GitHub repos referenced as URLs that end `*.git`:

[https://github.com/ak--47/mpBatchImport-node.git](https://github.com/ak--47/mpBatchImport-node.git)

by convention, all `git` repos (and therefore all GitHub projects) have a `master` or `main` `branch`. this is usually where the "production" or "latest release" of the code is stored. a `branch` is a version of the code which diverges from the `main` or `master` branch.

a typical implementation of branching might look like this:

![branches fork out from master and are eventually merged back in](https://www.nobledesktop.com/image/gitresources/git-branches-merge.png)

it is **not** essential that you learn all the features of `git`. it *is* essential that you can:

 - `clone` a git repository
 - `pull` new changes to that repository
 - `branch` a repository to work on your own stuff
 - `revert` a repository to return the app to a working state

there are tools to help you do this as well as an assessment to test your skills. go forth, and learn.

## tools
- GitHub Desktop: https://desktop.github.com/
- git CLI cheatsheet: https://education.github.com/git-cheat-sheet-education.pdf
- sublime text editor: https://www.sublimetext.com/
- vsCode text editor: https://code.visualstudio.com/


## tutorials

- AK's git overview: https://youtu.be/6Ikd4DiIieE
- git desktop app: https://www.youtube.com/watch?v=ci3W1T88mzw
- git CLI: https://www.youtube.com/watch?v=ci3W1T88mzw

## further reading (optional)
- The many verbs of `git`: https://kancane.nl/git-in-a-nutshell/
- Ignoring files in `git`: https://www.atlassian.com/git/tutorials/saving-changes/gitignore
- Twelve Factor App: https://12factor.net/codebase 
- Branching: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
- Actions: https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions


## assessment
There is a file in this folder called `index.html` ... it is a webpage... you should be able to:

 - open this webpage in a browser
 - make some changes to it
 - see your changes reflected in `git` (CLI or desktop app)
 - revert your changes to the original version

### Extra Credit

- create a new branch
- make some changes to `index.html`
- switch _between_ branches to see how your changes are maitained on your branch
- create a `pull request` to merge the changes in your branch into `master`


