Start from installation from [Node.js](https://nodejs.org/) website ( if you use Windows or OS X ). 

For Linux:
$ **sudo apt-get update**
$ **sudo apt-get install nodejs**

Then install the Node package manager called “npm”:
$ **sudo apt-get install npm**

Create a symbolic link for “node” as many Node.js tools use this name to execute:
$ **sudo ln -s /usr/bin/nodejs /usr/bin/node**

Install Gulp from the terminal:
$ **npm install --global gulp**

Use $ **npm install** with no args, and this command will install the dependencies from a package.json manifest to the local node_modules folder.

Run gulp commands:
$ **gulp build** - build all files from **app** to **public**;
