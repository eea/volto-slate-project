## Documentation


[![Build Status](https://ci.eionet.europa.eu/buildStatus/icon?job=Eionet/volto-slate-project/master&subject=Latest%20Build)](https://ci.eionet.europa.eu/job/Eionet/job/volto-slate-project/job/master/display/redirect)

[![Code Coverage(Master)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-project-master&metric=coverage)](https://sonarqube.eea.europa.eu/component_measures?id=volto-slate-project-master&metric=coverage)


[![Bugs(Master)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-project-develop&metric=bugs)](https://sonarqube.eea.europa.eu/component_measures?id=volto-slate-project-master&metric=bugs)


A demo project that integrates Volto with a volto addon, volto-slate.

## Quick Start

Below is a list of commands you will probably find useful.

### `yarn start`

Runs the project in development mode.
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

### `yarn build`

Builds the app for production to the build folder.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `yarn start:prod`

Runs the compiled app in production.

You can again view your application at `http://localhost:3000`

### `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `yarn i18n`

Runs the test i18n runner which extracts all the translation strings and
generates the needed files.


## CI-related commands

### `yarn ci:cypress:run`

Starts plone, frontend and cypress in docker. Runs cypress tests. Instuments the code and creates code coverage reports. Creates junit type reports. Generates json report per test.

### `yarn ci:start-api-plone`

Starts plone container, site /Plone exposed on port 8080

### `yarn ci:start-frontend`

Starts frontend container(builds the existing code in a node12 docker), exposed on port 3000. Add instrumentation for code coverage.

### `yarn cypress:run`

Starts a cypress container, connects to webapp container to run the tests. 

### `yarn ci:cypress:end`

Stops plone and webapp containers. They are removed on stop.

### `yarn ci:cypress:mochawsome:merge`

Merges the json test results files into one single json file. Location cypress/mochawesome/mochawesome.json

### `yarn ci:cypress:mochawsome:report`

Generates html report for tests. Location cypress/report/mochawesome.html

### mr_developer

[mr_developer](https://www.npmjs.com/package/mr-developer) is a great tool
for developing multiple packages at the same time.

mr_developer should work with this project by using the `--config` config option:

```bash
mrdeveloper --config=jsconfig.json
```

Volto's latest razzle config will pay attention to your jsconfig.json file
for any customizations.
