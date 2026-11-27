
// Temporal is not available on every supported runtime, so instances are only created when it is
const TEMPORAL_SUPPORTED = typeof Temporal !== 'undefined';

function create<T>(factory: () => T): T
{
    return TEMPORAL_SUPPORTED ? factory() : undefined as T;
}

const INSTANT_STRING = '2021-01-01T00:00:00Z';
const ZONED_DATE_TIME_STRING = '2021-01-01T00:00:00+01:00[Europe/Amsterdam]';
const PLAIN_DATE_TIME_STRING = '2021-01-01T12:30:00';
const PLAIN_DATE_STRING = '2021-01-01';
const PLAIN_TIME_STRING = '12:30:00';
const PLAIN_YEAR_MONTH_STRING = '2021-01';
const PLAIN_MONTH_DAY_STRING = '01-01';
const DURATION_STRING = 'P1Y2M3DT4H5M6S';

export const TEMPORALS =
{
    SUPPORTED: TEMPORAL_SUPPORTED,

    INSTANT: create(() => Temporal.Instant.from(INSTANT_STRING)),
    ZONED_DATE_TIME: create(() => Temporal.ZonedDateTime.from(ZONED_DATE_TIME_STRING)),
    PLAIN_DATE_TIME: create(() => Temporal.PlainDateTime.from(PLAIN_DATE_TIME_STRING)),
    PLAIN_DATE: create(() => Temporal.PlainDate.from(PLAIN_DATE_STRING)),
    PLAIN_TIME: create(() => Temporal.PlainTime.from(PLAIN_TIME_STRING)),
    PLAIN_YEAR_MONTH: create(() => Temporal.PlainYearMonth.from(PLAIN_YEAR_MONTH_STRING)),
    PLAIN_MONTH_DAY: create(() => Temporal.PlainMonthDay.from(PLAIN_MONTH_DAY_STRING)),
    DURATION: create(() => Temporal.Duration.from(DURATION_STRING)),

    INSTANT_SERIALIZED: { serialized: true, name: 'Temporal', type: 'Instant', value: INSTANT_STRING },
    ZONED_DATE_TIME_SERIALIZED: { serialized: true, name: 'Temporal', type: 'ZonedDateTime', value: ZONED_DATE_TIME_STRING },
    PLAIN_DATE_TIME_SERIALIZED: { serialized: true, name: 'Temporal', type: 'PlainDateTime', value: PLAIN_DATE_TIME_STRING },
    PLAIN_DATE_SERIALIZED: { serialized: true, name: 'Temporal', type: 'PlainDate', value: PLAIN_DATE_STRING },
    PLAIN_TIME_SERIALIZED: { serialized: true, name: 'Temporal', type: 'PlainTime', value: PLAIN_TIME_STRING },
    PLAIN_YEAR_MONTH_SERIALIZED: { serialized: true, name: 'Temporal', type: 'PlainYearMonth', value: PLAIN_YEAR_MONTH_STRING },
    PLAIN_MONTH_DAY_SERIALIZED: { serialized: true, name: 'Temporal', type: 'PlainMonthDay', value: PLAIN_MONTH_DAY_STRING },
    DURATION_SERIALIZED: { serialized: true, name: 'Temporal', type: 'Duration', value: DURATION_STRING },

    NON_OBJECT: 42,
    NON_TEMPORAL: new Date(INSTANT_STRING),
    NOT_SERIALIZED: { name: 'Temporal', type: 'PlainDate', value: PLAIN_DATE_STRING },
    INVALID_NAME: { serialized: true, name: 'Date', type: 'PlainDate', value: PLAIN_DATE_STRING },
    INVALID_TYPE_VALUE: { serialized: true, name: 'Temporal', type: 42, value: PLAIN_DATE_STRING },
    INVALID_TEMPORAL_VALUE: { serialized: true, name: 'Temporal', type: 'PlainDate', value: true },
    UNKNOWN_TYPE: { serialized: true, name: 'Temporal', type: 'Calendar', value: PLAIN_DATE_STRING },
    INVALID_TEMPORAL_STRING: { serialized: true, name: 'Temporal', type: 'PlainDate', value: 'hello' }
};
