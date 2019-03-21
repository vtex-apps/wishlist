import { map } from 'ramda'
import React, { Component, ReactNode } from 'react'
import { InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import ProductPrice from 'vtex.store-components/ProductPrice'
import { Button, withToast } from 'vtex.styleguide'
import { translate } from '../../utils/translate'

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

  public render(): ReactNode {
    const { intl, items } = this.props
    const { isLoading } = this.state
    const totalPrice = this.calculateTotal()

    return (
      <div className="flex-column pa4 bt b--muted-4">
        <div className="tr">
          <span className="b">{items.length}</span>
          <span className="ml2">{translate('wishlist-quantity-selected-items', intl)}</span>
        </div>
        <div className="pv4 flex flex-row justify-end b">
          <span className="mr2">
            {translate('wishlist-total', intl)}
          </span>
          <ProductPrice
            sellingPrice={totalPrice}
            listPrice={totalPrice}
            showLabels={false}
            showListPrice={false}
          />
        </div>
        <div>
          <Button
            variation="primary"
            block
            disabled={items.length <= 0}
            onClick={this.onAddToCart}
            isLoading={isLoading}
          >
            {translate('wishlist-buy-items', intl)}
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
      showToast({ message: translate('wishlist-add-to-cart-success', intl) })
      this.setState({ isLoading: false })
    }).catch(err => {
      console.error(err)
      showToast({ message: translate('wishlist-add-to-cart-fail', intl) })
      this.setState({ isLoading: false })
    })
  }

}

export default withToast(injectIntl(Footer))