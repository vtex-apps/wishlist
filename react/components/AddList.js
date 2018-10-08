import React, { Component, Fragment } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { IconCaretLeft, Input, Button, Toggle } from 'vtex.styleguide'

/**
 * Wishlist element to add product to a list
 */
class AddList extends Component {
  static proptypes = {
    onFinishAdding: PropTypes.func.isRequired,
  }

  render() {
    const { onFinishAdding } = this.props

    return (
      <Fragment>
        <div className="w-100 bb pv3 ttu dark-gray tc b--light-gray">
          <div className="pointer h3 absolute nt1 ml3" onClick={onFinishAdding}>
            <IconCaretLeft size={17} />
          </div>
          Criar Lista
        </div>
        <div className="w-100 gray f5 pv5 pa4">
          <div className="tl">
            <Input
              placeholder="ex: Para meu escritório"
              label="NOME DA LISTA"
            />
          </div>
          <div className="flex flex-row justify-around tl mt3">
            <div className="flex flex-column">
              <span className="gray mt2">Não Compartilhar</span>
              <span className="light-gray">
                Apenas você poderá ver essa lista
              </span>
            </div>
            <div className="mt2">
              <Toggle
                checked={true}
                size="small"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center pb3">
          <Button variation="primary" size="small">
            Criar
          </Button>
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(AddList)
