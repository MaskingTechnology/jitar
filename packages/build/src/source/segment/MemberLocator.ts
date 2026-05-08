
import { ESDeclaration } from '@jitar/analysis';

import { FileHelper } from '../../utils';
import type { Module, ModuleRepository } from '../module';

import MissingModuleExport from './errors/MissingModuleExport';
import ModuleNotFound from './errors/ModuleNotFound';

import ExportInfo from './types/ExportInfo';
import ImportInfo from './types/ImportInfo';

type TraceEntry = { filename: string, importKey: string };
type Trace = TraceEntry[];
type LocatedMember = { trace: Trace, model: ESDeclaration};

export default class MemberLocator
{
    readonly #repository: ModuleRepository;

    readonly #fileHelper = new FileHelper();

    constructor(repository: ModuleRepository)
    {
        this.#repository = repository;
    }

    locate(filename: string, importKey: string): LocatedMember
    {
        const trace: Trace = [];
        const model = this.#locate(filename, importKey, trace);

        return { trace, model };
    }

    #locate(filename: string, importKey: string, trace: Trace): ESDeclaration
    {
        trace.push({ filename, importKey });

        const module = this.#getModule(filename);

        return this.#isReexported(module, importKey)
            ? this.#relocate(module, importKey, trace)
            : this.#extract(module, importKey);
    }

    #getModule(filename: string): Module
    {
        const module = this.#repository.get(filename);

        if (module === undefined)
        {
            throw new ModuleNotFound(filename);
        }

        return module;
    }

    #isReexported(module: Module, importKey: string): boolean
    {
        const importItem = module.model.getImport(importKey);
        const exportItem = module.model.getExport(importKey);

        return importItem !== undefined
            || exportItem?.from !== undefined;
    }

    #relocate(module: Module, importKey: string, trace: Trace): ESDeclaration
    {
        const relocateInfo = this.#getImportInfo(module, importKey)
                          ?? this.#getExportInfo(module, importKey);

        const relocatePath = relocateInfo?.from as string;
        const relocateKey = relocateInfo?.name as string;

        const callingModulePath = this.#fileHelper.extractPath(module.filename);
        const relativeFrom = relocatePath;
        const absoluteFrom = this.#fileHelper.makePathAbsolute(relativeFrom, callingModulePath, '');

        return this.#locate(absoluteFrom, relocateKey, trace);
    }

    #extract(module: Module, importKey: string): ESDeclaration
    {
        const exportInfo = this.#getExportInfo(module, importKey);

        if (exportInfo === undefined)
        {
            throw new MissingModuleExport(module.filename, importKey);
        }

        const member = module.model.getDeclaration(exportInfo.name);

        if (member === undefined)
        {
            throw new MissingModuleExport(module.filename, exportInfo.name);
        }

        return member;
    }

    #getExportInfo(module: Module, importKey: string): ExportInfo | undefined
    {
        const exportItem = module.model.getExport(importKey);
        const exportMember = exportItem?.getMember(importKey);

        if (exportMember === undefined)
        {
            return undefined;
        }

        return { from: exportItem?.from, name: exportMember.identifier };
    }

    #getImportInfo(module: Module, importKey: string): ImportInfo | undefined
    {
        const importItem = module.model.getImport(importKey);
        const importMember = importItem?.getMember(importKey);

        if (importItem === undefined || importMember === undefined)
        {
            return undefined;
        }

        return { from: importItem.from, name: importMember.identifier };
    }
}
