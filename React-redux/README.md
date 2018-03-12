# Morgan Stanley Angular Template Project

> This project is only suitable for developers who are part of the
> [Artifactory NPM pilot](http://wiki.ms.com/MSDE/ArtifactoryHome) at present. It requires
> its dependencies being provided by NPM which necessitates access to Artifactory.

  Language  | MV* Library |  Component Library  |   Theme(s) 
:----------:| :---------: | :-----------------: |:------------:
 TypeScript |  Angular 2  |        None         |     None

*For more information and documentation about technologies and themes available, please visit
our [Project Templates](http://wiki.ms.com/WebToolkits/ProjectTemplates).*

## Introduction

This template project was created by [Angular CLI](https://cli.angular.io/) and a few minor changes
have been applied to enable PhantomJS and provide [Train](http://train) support. These are all
things that most projects would have to do when using `ng new` so this template project was created
to help save time and effort.

Information about the what changes were made can be found in the
[Artifactory FAQ](http://wiki.ms.com/NodeJS/ArtifactoryPilot/ArtifactoryFAQ#Angular_CLI_Template_Project). 

## Prerequisites

This project depends on Node.js 6.x. It needs to be configured to connect to the Artifactory NPM
instance, the steps for which are covered in the
[Getting Started (One Off Configuration)](http://wiki.ms.com/NodeJS/ArtifactoryPilot/WebHome#Getting_Started_One_Off_Configur)
documentation.

```
$ module load ossjs/node/6.11.1
```

While the majority of the NPM modules will work from Artifactory without any special configuration
this project has a dependency on `node-sass` and `phantomjs-prebuilt` which provide binaries that
to need specific handling to work within the Firm environment. Please follow the
[documentation here](http://wiki.ms.com/NodeJS/ArtifactoryPilot/BinaryAndExecutableBasedNpmModules)
to set these dependencies up before installing the other NPM modules.

Train CLI and Yarn are also recommended, although this project can be used without them.

```
$ module load msde/traincli/prod
$ module load ossjs/yarn/0.24.6
```

Finally, due to limitations during the Artifactory NPM Pilot which mean that internally developed
modules cannot be published to it, the **train-generate-metadata** dependency needs to be loaded
from Git which requires a Git client to be available in order to download it.

```
$ module load msde/git/2.9.0
```

## Getting Started

This template project is fully compatible with the [Angular CLI commands](https://github.com/angular/angular-cli/wiki),
although [a handful of scripts](http://wiki.ms.com/NodeJS/ArtifactoryPilot/ArtifactoryFAQ#What_build_commands_can_I_run_fo)
have been provided that provide arguments suitable for the Firm environment and conventions.

To get started the Git project needs to be cloned.

```
$ git clone http://stashblue.ms.com:11990/atlassian-stash/scm/msde_train_examples/typescript_ui_angular_angularcli.git src 
$ cd src
```

### Yarn

The following steps must be followed to install the dependencies and run the application locally
using [Yarn](http://wiki.ms.com/NodeJS/ArtifactoryPilot/ArtifactoryFAQ#Why_is_yarn_recommended_instead).

```
$ yarn install
$ yarn global add @angular/cli
$ yarn run start
```

### npm

Alternatively `npm` can be used to install and run the application.

```
$ npm install
$ npm install -g @angular/cli
$ npm run start
```

### Viewing the Application

The template project is set up to serve the application from http://localhost.ms.com:4200. The
**start** script within `package.json` must be changed to host the application from different host
and/or port, as per the [ng serve documentation](https://github.com/angular/angular-cli/wiki/serve).
For example:

```
    "start": "ng serve --host=compile3.croydon.ms.com --port=8080"
```

Please refer to the `package.json`, the [Angular CLI documentation](https://github.com/angular/angular-cli/wiki),
and the [Angular CLI template project FAQ](http://wiki.ms.com/NodeJS/ArtifactoryPilot/ArtifactoryFAQ#What_build_commands_can_I_run_fo)
for information on the other commands that are available.

## Train Tasks

> Due to an issue with the setup of environment variables `train build` doesn't actually
> work in a environment where `yarn install` or `npm install` has not already been run. This
> will be addressed shortly - [JSTMPLS-103](http://jiraeai.ms.com/jira/browse/JSTMPLS-103).

`train.yaml` is set up for a single build task. It uses Yarn to install the dependencies, then runs
the lint, train-test, and build scripts defined within `package.json`. Finally it generates Train
metadata which is needed for the project to reach Train level 3 compliance.

> _Although it is not recommended, it is straightforward to use `npm` instead of `yarn`. The_
> _reference to ossjs/yarn/* must be removed from the `tools` configuration section in `train.yaml`,_
> _then the calls to `yarn` within `train-build.js` can be replaced with `npm`._

```
train build
```

It calls a small Node.js script `train-build.js` to provide cross-platform support. Please insert any additional build 
steps in that file.

The application is created in the `../installs/common/docs` folder, while the unit test and
coverage reports are output to `../build/reports` and can be uploaded as SDLC2 Release test
evidence.

## Tested Environments

This project was developed using Visual Studio Code and has been tested on Linux (RHEL 6) and
Windows 7. It should work in any environment that Angular CLI/Train supports, although it has not
been tested elsewhere yet.

## Support & Questions

If there are any problems using this project, especially when getting started, please refer to the
[Artifactory NPM Pilot home page](http://wiki.ms.com/NodeJS/ArtifactoryPilot/WebHome#Getting_Started_One_Off_Configur)
and the [Artifactory FAQ](http://wiki.ms.com/NodeJS/ArtifactoryPilot/ArtifactoryFAQ) to try to
resolve them. If the issues persist please contact [artifactory-npm-pilot](mailto:artifactory-npm-pilot)
to ask for assistance. If this doesn't help then escalate the problems to [msjshelp](mailto:msjshelp).
