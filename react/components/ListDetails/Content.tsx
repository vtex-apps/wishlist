import React, { Component, Fragment, ReactNode } from 'react'

import { map } from 'ramda'
import { compose } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import ItemDetails from './ItemDetails'

import styles from '../../wishList.css'

interface ContentProps extends InjectedIntlProps {
  items: any
  lists?: any
  hideItemsQuantityLabel?: boolean
  onItemSelect: (itemId: string, product: any, isSelected: boolean) => void
  onItemRemove: (id: string) => Promise<any>
  runtime: any
}

class Content extends Component<ContentProps, {}> {
  public render(): ReactNode {
    const { items, hideItemsQuantityLabel } = this.props
    return (
      <div className={`${styles.listDetailsContent} h-100 overflow-y-auto flex flex-column`}>
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
      <div className={`${styles.listEmptyContainer} flex flex-column w-100 h-100 items-center mv8 c-muted-2`}>
        <div className={styles.listEmptyLabel}>
          <FormattedMessage id="wishlist-list-empty" />
        </div>
        <div className={`${styles.goToAddProductsButtonContainer} mt8`}>
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

export default compose(
  withRuntimeContext,
  injectIntl
)(Content)