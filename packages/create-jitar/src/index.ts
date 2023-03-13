#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';

const CURR_DIR = process.cwd();
const CHOICES = fs.readdirSync(`../../examples/4-integrations/`);

const QUESTIONS = [
    {
        name: 'project-choice',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: function (input: string)
        {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];

inquirer.prompt(QUESTIONS)
    .then(answers =>
    {
        const projectChoice = answers['project-choice'];
        const projectName = answers['project-name'];
        const templatePath = `../../examples/4-integrations/${projectChoice}`;

        fs.mkdirSync(`${CURR_DIR}/${projectName}`);

        createDirectoryContents(templatePath, projectName);
    });

function createDirectoryContents(templatePath: string, newProjectPath: string)
{
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file =>
    {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile())
        {
            const contents = fs.readFileSync(origFilePath, 'utf8');

            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory())
        {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
}