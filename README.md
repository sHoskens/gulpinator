#GULPINATOR

A gulp-based workflow, intended for personal use. I realize there are better, more
advanced solutions and bundles out there. The purpose of this project was mostly
to learn gulp and node, and create a configuration that's perfectly suited to the
needs of me and my team.

Improvements and bugfixes are, of course, always welcome.

The main focus of this gulp workflow was to provide a flow suited to many different,
small scale projects, which can be easily configured with a json file without the need
for any gulp knowledge. Flexibility and configurability are key.

Note: This is still a work in progress.

##Contents

1. Installation
2. Overview
3. Configuration
4. Intended project structure
5. Work in progress: Wishlist

##1. Installation

Install using npm.

`npm install gulpinator`

Create a *gulpfile.js* in your project root, containing this:

`require('gulpinator').initGulp();`

Since this is a basic gulpfile, you can choose to add additional tasks here.
