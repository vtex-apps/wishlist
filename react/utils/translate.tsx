import { IntlShape } from 'react-intl'

export const translate = (id: string, intl: IntlShape) =>
    intl.formatMessage({ id: `${id}` }, '', '', '', '')