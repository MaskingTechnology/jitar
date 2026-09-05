
export default class ApplicationSegmentNotFound extends Error
{
    constructor(segmentName: string)
    {
        super(`Application segment not found '${segmentName}'`);
    }
}
