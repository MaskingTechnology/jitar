
import ReflectionClass from './models/ReflectionClass.js';
import ReflectionField from './models/ReflectionField.js';
import ReflectionFunction from './models/ReflectionFunction.js';
import ReflectionGetter from './models/ReflectionGetter.js';
import ReflectionMember from './models/ReflectionMember.js';
import ReflectionSetter from './models/ReflectionSetter.js';
import Parser from './parser/Parser.js';

import fs from 'fs';
import ReflectionImport from './models/ReflectionImport.js';
import ReflectionExport from './models/ReflectionExport.js';

const code = fs.readFileSync('testcontent.js', 'utf8');

const parser = new Parser();
const module = parser.parse(code);

const imports = module.imports;
const members = module.exported;
const exports = module.exports;

console.log('------------ Imports ------------');
imports.forEach(imp => printImport(imp));
console.log('------------ Members ------------');
members.forEach(member => printMember(member));
console.log('------------ Exports ------------');
exports.forEach(exp => printExport(exp));

function printImport(model: ReflectionImport)
{
    console.log(`import ${model.name} as ${model.as} from ${model.from}`);
}

function printExport(model: ReflectionExport)
{
    console.log(`export ${model.name} as ${model.as}`);
}

function printMember(member: ReflectionMember, level = 0)
{
    if (member instanceof ReflectionClass)
    {
        printClass(member, level);
    }
    else if (member instanceof ReflectionGetter)
    {
        printGetter(member, level);
    }
    else if (member instanceof ReflectionSetter)
    {
        printSetter(member, level);
    }
    else if (member instanceof ReflectionFunction)
    {
        printFunction(member, level);
    }
    else if (member instanceof ReflectionField)
    {
        printField(member, level);
    }
}

function printClass(member: ReflectionClass, level:number)
{
    console.log(makeLevel(level), `Class ${member.name} ${member.parentName ? 'extends ' + member.parentName : ''}`);

    for (const submember of member.members)
    {
        printMember(submember, level + 1);
    }
}

function printGetter(member: ReflectionFunction, level:number)
{
    console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}get ${member.isPrivate ? '#' : ''}${member.name}() { code }`);
}

function printSetter(member: ReflectionFunction, level:number)
{
    console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}set ${member.isPrivate ? '#' : ''}${member.name}(${member.parameters.map(parameter => makeParameter(parameter))}) { code }`);
}

function printFunction(member: ReflectionFunction, level:number)
{
    console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}${member.isAsync ? 'async ' : ''}${level === 0 ? 'function ' : ''}${member.isPrivate ? '#' : ''}${member.name}(${member.parameters.map(parameter => makeParameter(parameter))}) { code }`);
}

function printField(member: ReflectionField, level:number)
{
    level === 0
        ? console.log(makeLevel(level), `let ${member.name}${member.value ? ' = ' + member.value : ''};`)
        : console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}${member.isPrivate ? '#' : ''}${member.name}${member.value ? ' = ' + member.value : ''};`);
}

function makeParameter(parameter: ReflectionField): string
{
    return `${parameter.name}${parameter.value ? ' = ' + parameter.value : ''}`;
}

function makeLevel(level:number)
{
    let result = '';

    for (let i = 0; i < level; i++)
    {
        result += '  ';
    }

    return result;
}
