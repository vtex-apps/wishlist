import React, { Component, Fragment } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

/**
 * Minicart content component
 */
class WishListContent extends Component {
  render() {
    return (
      <div className="flex flex-column tc bg-white f6 shadow-2">
        <div className="w-100 h2 bb pv3 ttu dark-gray b--light-gray">
          Adicionar a Lista
        </div>
        <div className="w-100 gray f5 pv5">
          Você não possui listas salvas
        </div>
        <div className="w-100 pv3 dark-gray bg-light-gray pointer">
          + criar nova lista
        </div>
      </div>
    )
  }
}

export default injectIntl(WishListContent)
