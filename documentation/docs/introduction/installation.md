---
layout: doc

prev:
    text: What is jitar?
    link: /introduction/what-is-jitar

next:
    text: Quick Start
    link: /introduction/quick-start
---

# Installation
Jitar can be used in new and existing projects.

## New projects
We provide a CLI tool to quickly create a project with or without a frontend framework. We currently support React, Vue, Svelte, SolidJs and Lit. To create a Jitar application, run in your terminal:

```bash
npm create jitar@latest
```

Enter the project name, select a frontend framework (or none) and run the prompted commands.

```bash
cd [project-name]
npm install
npm run build
npm run standalone
```

Now you should be able to access the application on [http://localhost:3000](http://localhost:3000){target="_blank"}

## Existing projects
For existing projects Jitar can be added as additional dependency by running the following command in your terminal:

```bash
npm install --save jitar
```

For integrating Jitar in your project you can follow [our tutorial](../tutorials/add-jitar-to-an-existing-project).
