
import Response from '../models/Response.js';

type NextHandler = () => Promise<Response>;

export default NextHandler;
