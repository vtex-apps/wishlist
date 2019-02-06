import { intlShape } from 'react-intl'

export const translate = (id: string, intl: intlShape) =>
    intl.formatMessage({ id: `${id}` })