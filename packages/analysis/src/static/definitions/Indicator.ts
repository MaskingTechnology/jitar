
const Indicator =
{
    GENERATOR: '*',
    PRIVATE: '#'
};

const Indicators = Object.values(Indicator);

function isIndicator(value: string): boolean
{
    return Indicators.includes(value);
}

export { Indicator, isIndicator };
