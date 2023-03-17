
import RemoteNode from '../../../src/services/RemoteNode';

const API_URL = 'http://localhost:80';

const node = new RemoteNode(API_URL, ['FirstProcedure', 'SecondProcedure']);

export { API_URL, node }
