
import { Procedure, Implementation, Version, AccessLevels } from '@jitar/execution';

const publicProcedure = new Procedure('public');
publicProcedure.addImplementation(new Implementation(Version.DEFAULT, AccessLevels.PUBLIC, [], () => 'public'));

const protectedProcedure = new Procedure('protected');
protectedProcedure.addImplementation(new Implementation(Version.DEFAULT, AccessLevels.PROTECTED, [], () => 'protected'));

export const PROCEDURES =
{
    PUBLIC: publicProcedure,
    PROTECTED: protectedProcedure
};
