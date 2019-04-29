import React, { Component, ReactNode } from 'react'

import { map, path } from 'ramda'
import { compose } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import {
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl'
import { withToast } from 'vtex.styleguide'

import BuyButton from 'vtex.store-components/BuyButton'
import ProductPrice from 'vtex.store-components/ProductPrice'

import styles from '../../wishList.css'

interface FooterProps extends InjectedIntlProps {
  items: any
}

interface FooterState {
  isLoading?: boolean
}

class Footer extends Component<FooterProps, FooterState> {
  public state: FooterState = {
    isLoading: false,
  }

  public render(): ReactNode {
    const { items } = this.props
    const totalPrice = this.calculateTotal()
    const itemsToAddToCart = map(this.productShape, items)

    return (
      <div className={`${styles.ListDetailsFooter} flex flex-column pa4 bt b--muted-4 w-100 items-end`}>
        <div className="tr">
          <span className={`${styles.quantityOfSelectedItemsLabel} ml2`}>
            <FormattedMessage
              id="wishlist-quantity-selected-items"
              values={{ selectedItemsQuantity: <b>{items.length}</b> }}
            />
          </span>
        </div>
        <div className={`${styles.pricesContainer} pv4 flex flex-row justify-end b`}>
          <span className={`${styles.totalPriceLabel} mr2`}>
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
        <div className={styles.buySelectedItemsBtnContainer}>
          <BuyButton
            available={items.length > 0}
            isAvailable
            skuItems={itemsToAddToCart}
            isOneClickBuy={false}
            large={isMobile}
          >
            <FormattedMessage id="wishlist-buy-items" />
          </BuyButton>
        </div>
      </div>
    )
  }

  private findAvailableProduct = (item: any): any =>
    item.sellers.find(({ commertialOffer }: any) => commertialOffer.AvailableQuantity > 0)

  private normalizeProduct = (product: any): any => {
    if (!product) {
      return null
    }
    const normalizedProduct = { ...product }
    const items = product.items || []
    const sku = items.find(this.findAvailableProduct)
    if (sku) {
      const [seller = { commertialOffer: { Price: 0, ListPrice: 0 } }] =
        path(['sellers'], sku) || []
      const [referenceId = { Value: '' }] = path(['referenceId'], sku) || []
      const [image = { imageUrl: '' }] = path(['images'], sku) || []
      const resizedImage = image.imageUrl
      const normalizedImage = { ...image, imageUrl: resizedImage }
      normalizedProduct.sku = {
        ...sku,
        image: normalizedImage,
        referenceId,
        seller,
      }
    }
    return normalizedProduct
  }

  private productShape = (item: any): any => {
    const product = this.normalizeProduct(item.product)
    return (path(['sku', 'itemId'], product) && {
      brand: product.brand,
      detailUrl: `/${product.linkText}/p`,
      imageUrl: path(['sku', 'image', 'imageUrl'], product),
      listPrice: path(
        ['sku', 'seller', 'commertialOffer', 'ListPrice'],
        product
      ),
      name: product.productName,
      price: path(
        ['sku', 'seller', 'commertialOffer', 'Price'],
        product
      ),
      quantity: 1,
      seller: path(['sku', 'seller', 'sellerId'], product),
      skuId: path(['sku', 'itemId'], product),
      variant: path(['sku', 'name'], product),
    })
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

}

export default compose(
  withToast,
  injectIntl
)(Footer)