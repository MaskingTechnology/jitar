
type RemoveWorkerRequest =
{
    url: string;
    procedureNames: string[];
    trustKey?: string;
};

export default RemoveWorkerRequest;
