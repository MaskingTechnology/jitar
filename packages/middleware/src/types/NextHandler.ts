
import { Response } from '@jitar/execution';

type NextHandler = () => Promise<Response>;

export default NextHandler;