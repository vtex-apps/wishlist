import { map } from 'ramda'
import React, { Component, ReactNode } from 'react'
import { InjectedIntlProps, injectIntl, IntlShape, FormattedMessage } from 'react-intl'
import ProductPrice from 'vtex.store-components/ProductPrice'
import { Button, withToast } from 'vtex.styleguide'

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
  private __isMounted: boolean = false

  public componentDidMount() {
    this.__isMounted = true
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }


  public render(): ReactNode {
    const { intl, items } = this.props
    const { isLoading } = this.state
    const totalPrice = this.calculateTotal()

    return (
      <div className="flex-column pa4 bt b--muted-4">
        <div className="tr">
          <span className="ml2">
            <FormattedMessage
              id="wishlist-quantity-selected-items"
              values={{ selectedItemsQuantity: <b>{items.length}</b> }}
            />
          </span>
        </div>
        <div className="pv4 flex flex-row justify-end b">
          <span className="mr2">
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
        <div>
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
    this.__isMounted && this.setState({ isLoading: true })
    onAddToCart().then(() => {
      showToast({ message: intl.formatMessage({ id: "wishlist-add-to-cart-success" }) })
      this.__isMounted && this.setState({ isLoading: false })
    }).catch((err: any) => {
      console.error(err)
      showToast({ message: intl.formatMessage({ id: "wishlist-add-to-cart-fail" }) })
      this.__isMounted && this.setState({ isLoading: false })
    })
  }

}

export default withToast(injectIntl(Footer))