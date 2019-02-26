import React, { Component, ReactNode, Fragment } from "react"
import { map } from 'ramda'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from "../../utils/translate"
import { Button } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'

interface ContentProps {
  items: any
  intl?: intlShape
  runtime?: any
}

class Content extends Component<ContentProps, {}> {
  private redirectToGallery = (): void => {
    const { runtime: { navigate } } = this.props
    navigate({
      to: '/',
      fallbackToWindowLocation: false
    })
  }
  private renderListEmpty = (): ReactNode => {
    const { intl } = this.props
    return (
      <div className="flex flex-column w-100 h-100 justify-center items-center">
        <div>
          <span>{translate('wishlist-list-empty', intl)}</span>
        </div>
        <div className="mt4">
          <Button variation="primary" onClick={this.redirectToGallery}>
            {translate("wishlist-add-itens", intl)}
          </Button>
        </div>
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
      <div className="h-100 overflow-y flex flex-column">
        {
          items.length > 0 ?
            this.renderItems()
            : this.renderListEmpty()
        }
      </div>
    )
  }
}

export default withRuntimeContext(injectIntl(Content))