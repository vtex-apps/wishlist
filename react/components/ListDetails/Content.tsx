import { map } from 'ramda'
import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import ItemDetails from './ItemDetails'

import wishlist from '../../wishList.css'

interface ContentProps {
  items: any
  lists?: any
  hideItemsQuantityLabel?: boolean
  onItemSelect: (itemId: string, product: any, isSelected: boolean) => void
  onItemRemove: (id: string) => Promise<any>
  intl?: IntlShape
  runtime?: any
}

class Content extends Component<ContentProps & InjectedIntlProps, {}> {
  public render(): ReactNode {
    const { items, hideItemsQuantityLabel } = this.props
    return (
      <div className={`${wishlist.listDetailsContent} h-100 overflow-y-auto flex flex-column`}>
        {
          items.length > 0 ? (
            <div>
              {!hideItemsQuantityLabel && (
                <div className="h3 flex items-center justify-center c-muted-1">
                  <span>
                    <FormattedMessage
                      id="wishlist-quantity-of-items"
                      values={{ itemsQuantity: items.length }}
                    />
                  </span>
                </div>
              )}
              {this.renderItems()}
            </div>
          )
            : this.renderListEmpty()
        }
      </div>
    )
  }

  private redirectToGallery = (): void => {
    const { runtime: { navigate } } = this.props
    navigate({
      fallbackToWindowLocation: false,
      to: '/',
    })
  }

  private renderListEmpty = (): ReactNode => {
    return (
      <div className={`${wishlist.listEmptyContainer} flex flex-column w-100 h-100 items-center mv8 c-muted-2`}>
        <div className={wishlist.listEmptyLabel}>
          <FormattedMessage id="wishlist-list-empty" />
        </div>
        <div className={`${wishlist.goToAddProductsButtonContainer} mt8`}>
          <Button variation="primary" onClick={this.redirectToGallery}>
            <FormattedMessage id="wishlist-add-itens" />
          </Button>
        </div>
      </div>
    )
  }

  private renderItems = (): ReactNode => {
    const { items, lists } = this.props
    return (
      <Fragment>
        {map(item => (
          <ItemDetails {...this.props} item={item} lists={lists} key={item.id} />
        ), items)}
      </Fragment>
    )
  }

}

export default withRuntimeContext(injectIntl(Content))