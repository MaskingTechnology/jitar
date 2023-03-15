
import inquirer from 'inquirer';
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `templates`,
);

const CURR_DIR = process.cwd();
const CHOICES = fs.readdirSync(templateDir);

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
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];

function createDirectoryContents(templatePath: string, newProjectPath: string)
{
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file =>
    {
        const origFilePath = `${templatePath}/${file}`;
        const stats = fs.statSync(origFilePath);

        if (stats.isFile())
        {
            const contents = fs.readFileSync(origFilePath, 'utf8');

            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory())
        {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
}

inquirer.prompt(QUESTIONS)
    .then(answers =>
    {
        const projectChoice = answers['project-choice'];
        const projectName = answers['project-name'];
        const templatePath = `${templateDir}/${projectChoice}`;

        fs.mkdirSync(`${CURR_DIR}/${projectName}`);

        createDirectoryContents(templatePath, projectName);
    });
