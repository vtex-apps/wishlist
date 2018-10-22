import React, { Component, Fragment, ReactNode } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'

interface AddToListProps {
  onAddList: () => void
  intl: any
}

interface AddToListState {}

/**
 * Wishlist element to add a new list
 */
class AddToList extends Component<AddToListProps, AddToListState> {
  public static proptypes = {
    onAddList: PropTypes.func.isRequired
  }

  render(): ReactNode {
    const { onAddList } = this.props

    return (
      <Fragment>
        <div className="w-100 h2 bb pv3 ttu dark-gray b--light-gray">
          Adicionar a Lista
        </div>
        <div className="w-100 gray f5 pv5">Você não possui listas salvas</div>
        <div
          className="w-100 pv3 dark-gray bg-light-gray pointer"
          onClick={onAddList}
        >
          + criar nova lista
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(AddToList)
