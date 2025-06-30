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

We provide a CLI tool to quickly create a project with or without a frontend framework. To create a Jitar application, run in your terminal:

```bash
npm install -g jitar
jitar init --name=project-name --template=react
```

You can also use our `vue` template, or `jitar-only` if you don't need a frontend framework.

Next, run the prompted commands.

```bash
cd [project-name]
npm install
npm run build
npm run standalone
```

Now you should be able to access the application on [http://localhost:3000](http://localhost:3000){target="_blank"}

With Jitar all set up you're ready to build your application. In the [DEVELOP section](../develop/application-structure) you can find more information on how to structure and build great applications.

## Existing projects

For existing projects Jitar can be added as additional dependency by running the following command in your terminal:

```bash
npm install --save jitar
```

For integrating Jitar in your project you can follow [our tutorial](../guides/add-jitar-to-an-existing-project).
