import React, { Component, ReactNode } from "react"
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../../utils/translate'
import { Button } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'
import { map } from 'ramda'

interface FooterProps {
  items: any
  intl?: intlShape
}

class Footer extends Component<FooterProps, {}> {
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

  public render(): ReactNode {
    const { intl } = this.props
    const { items } = this.props
    const totalPrice = this.calculateTotal()
    return (
      <div className="flex-column pa4 bt b--muted-4">
        <div className="tr">
          <span>{items.length}</span>
          <span className="ml2">{translate('wishlist-quantity-selected-items', intl)}</span>
        </div>
        <div className="pv4 flex flex-row justify-end">
          <span className="mr2">{translate('wishlist-total', intl)}</span>
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
          >
            {translate('wishlist-buy-items', intl)}
          </Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(Footer)