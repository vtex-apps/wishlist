import { map } from 'ramda'
import React, { Component, ReactNode } from 'react'
import { InjectedIntlProps, injectIntl, IntlShape, FormattedMessage } from 'react-intl'
import ProductPrice from 'vtex.store-components/ProductPrice'
import { Button, withToast } from 'vtex.styleguide'

import wishlist from '../../wishList.css'

interface FooterProps {
  items: any
  onAddToCart: () => Promise<any>
  showToast: any
  intl: IntlShape
}

interface FooterState {
  isLoading?: boolean
}

class Footer extends Component<FooterProps & InjectedIntlProps, FooterState> {
  public state: FooterState = {}
  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render(): ReactNode {
    const { intl, items } = this.props
    const { isLoading } = this.state
    const totalPrice = this.calculateTotal()

    return (
      <div className={`${wishlist.ListDetailsFooter} flex-column pa4 bt b--muted-4`}>
        <div className="tr">
          <span className={`${wishlist.quantityOfSelectedItemsLabel} ml2`}>
            <FormattedMessage
              id="wishlist-quantity-selected-items"
              values={{ selectedItemsQuantity: <b>{items.length}</b> }}
            />
          </span>
        </div>
        <div className={`${wishlist.pricesContainer} pv4 flex flex-row justify-end b`}>
          <span className={`${wishlist.totalPriceLabel} mr2`}>
            <FormattedMessage
              id="wishlist-total"
              values={{ selectedItemsQuantity: <b>{items.length}</b> }}
            />
          </span>
          <ProductPrice
            sellingPrice={totalPrice}
            listPrice={totalPrice}
            showLabels={false}
            showListPrice={false}
          />
        </div>
        <div className={wishlist.buySelectedItemsBtnContainer}>
          <Button
            variation="primary"
            block
            disabled={items.length <= 0}
            onClick={this.onAddToCart}
            isLoading={isLoading}
          >
            <FormattedMessage id="wishlist-buy-items" />
          </Button>
        </div>
      </div>
    )
  }

  private calculateTotal = (): number => {
    const { items } = this.props
    return map(({ product: { items: [item] } }) => {
      const {
        sellers: [
          {
            commertialOffer: { Price },
          },
        ],
      } = item
      return Price
    }, items)
      .reduce((a, b) => a + b, 0)
  }

  private onAddToCart = (): void => {
    const { onAddToCart, showToast, intl } = this.props
      this.setState({ isLoading: true })
    onAddToCart().then(() => {
      showToast({ message: intl.formatMessage({ id: 'wishlist-add-to-cart-success' }) })
      if (this.isComponentMounted) {
        this.setState({ isLoading: false })
      }
    }).catch((err: any) => {
      console.error(err)
      showToast({ message: intl.formatMessage({ id: 'wishlist-add-to-cart-fail' }) })
      this.setState({ isLoading: false })
    })
  }

}

export default withToast(injectIntl(Footer))