import React, { Component, Fragment } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'

/**
 * Wishlist element to add a new list
 */
class AddToList extends Component {
  static proptypes = {
    onAddList: PropTypes.func.isRequired
  }

  render() {
    const { onAddList } = this.props

    return (
      <Fragment>
        <div className="w-100 h2 bb pv3 ttu dark-gray b--light-gray">
          Adicionar a Lista
        </div>
        <div className="w-100 gray f5 pv5">Você não possui listas salvas</div>
        <div className="w-100 pv3 dark-gray bg-light-gray pointer" onClick={onAddList}>
          + criar nova lista
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(AddToList)
