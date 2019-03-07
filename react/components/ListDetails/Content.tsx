import React, { Component, ReactNode, Fragment } from "react"
import { map } from 'ramda'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from "../../utils/translate"
import { Button } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'
import ItemDetails from './ItemDetails'

interface ContentProps {
  items: any
  onItemSelect: (itemId: string, product: any, isSelected: boolean) => void
  onItemRemove: (id: string) => void
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
          <ItemDetails {...this.props} item={item} />
        ), items)}
      </Fragment>
    )
  }

  public render(): ReactNode {
    const { items, intl } = this.props
    return (
      <div className="h-100 overflow-y-scroll flex flex-column">
        {
          items.length > 0 ? (
            <div>
              <div className="h3 flex items-center justify-center c-muted-1">
                <span className="mr2">{items.length}</span>
                <span>{translate('wishlist-quantity-of-items', intl)}</span>
              </div>
              {this.renderItems()}
            </div>
          )
            : this.renderListEmpty()
        }
      </div>
    )
  }
}

export default withRuntimeContext(injectIntl(Content))