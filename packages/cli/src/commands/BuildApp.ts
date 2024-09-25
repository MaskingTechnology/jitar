
import { ConfigurationManager } from '@jitar/configuration';
import { BuildManager } from '@jitar/build';

import Command from '../Command';
import ArgumentProcessor from '../ArgumentProcessor';

export default class BuildApp implements Command
{
    async execute(args: ArgumentProcessor): Promise<void>
    {
        const environmentFile = args.getOptionalArgument('--env-file', undefined);
        const runtimeConfigFile = args.getOptionalArgument('--config', undefined);

        const configurationManager = new ConfigurationManager();

        await configurationManager.configureEnvironment(environmentFile);
        
        const configuration = await configurationManager.getRuntimeConfiguration(runtimeConfigFile);

        const buildManager = new BuildManager(configuration);

        return buildManager.build();
    }
}
