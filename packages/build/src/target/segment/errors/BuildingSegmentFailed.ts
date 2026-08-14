
export default class BuildingSegmentFailed extends Error
{
    constructor(segmentName: string, cause: unknown)
    {
        super(`Failed building segment '${segmentName}'`, { cause });
    }
}
