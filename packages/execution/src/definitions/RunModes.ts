
const RunModes =
{
    NORMAL: 'normal',
    DRY: 'dry',
} as const;

export type RunMode = typeof RunModes[keyof typeof RunModes];

export default RunModes;
