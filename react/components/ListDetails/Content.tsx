import React, { Component, ReactNode, Fragment } from "react"
import { map } from 'ramda'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from "../../utils/translate"

interface ContentProps {
  items: any
  intl?: intlShape
}

class Content extends Component<ContentProps, {}> {
  private renderListEmpty = (): ReactNode => {
    const { intl } = this.props
    return (
      <div className="flex-column">
        {translate('wishlist-list-empty', intl)}
      </div>
    )
  }

  private renderItems = (): ReactNode => {
    const { items } = this.props
    return (
      <Fragment>
        {map(item => (
          <div>
            {/* TODO: Use the product-summary as Extension point */}
            {item.product.productName}
          </div>
        ), items)}
      </Fragment>
    )
  }

  public render(): ReactNode {
    const { items } = this.props
    return (
      <div className="h-100 overflow-y">
        {
          items.length > 0 ?
            this.renderItems()
            : this.renderListEmpty()
        }
      </div>
    )
  }
}

export default injectIntl(Content)