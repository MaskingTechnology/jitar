
import Response from '../../execution/models/Response.js';

type NextHandler = () => Promise<Response>;

export default NextHandler;
