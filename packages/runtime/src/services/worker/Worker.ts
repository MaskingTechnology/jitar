
import RunnerService from '../RunnerService';

export default interface Worker extends RunnerService
{
   get trustKey(): string | undefined;
}
