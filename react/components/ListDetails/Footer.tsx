import React, { Component, ReactNode } from 'react'

import { map, path, head } from 'ramda'
import { compose } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import { FormattedMessage, InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { withToast } from 'vtex.styleguide'

import BuyButton from 'vtex.store-components/BuyButton'
import ProductPrice from 'vtex.store-components/ProductPrice'

import styles from '../../wishList.css'

interface FooterProps extends InjectedIntlProps {
  items: ListItemWithProduct[]
}

interface FooterState {
  isLoading?: boolean
}

const messages = defineMessages({
  selectedItemsQuantity: {
    defaultMessage: '',
    id: 'store/wishlist-quantity-selected-items',
  },
  total: {
    defaultMessage: '',
    id: 'store/wishlist-total',
  },
  buyItems: {
    defaultMessage: '',
    id: 'store/wishlist-buy-items',
  },
})

class Footer extends Component<FooterProps, FooterState> {
  public state: FooterState = {
    isLoading: false,
  }

  public render(): ReactNode {
    const { items } = this.props
    const totalPrice = this.calculateTotal()
    const itemsToAddToCart = map(this.productShape, items)

    return (
      <div
        className={`${
          styles.ListDetailsFooter
        } flex flex-column pa4 bt b--muted-4 w-100 items-end`}
      >
        <div className="tr">
          <span className={`${styles.quantityOfSelectedItemsLabel} ml2`}>
            <FormattedMessage
              id={messages.selectedItemsQuantity.id}
              values={{ selectedItemsQuantity: <b>{items.length}</b> }}
            />
          </span>
        </div>
        <div
          className={`${
            styles.pricesContainer
          } pv4 flex flex-row justify-end b`}
        >
          <span className={`${styles.totalPriceLabel} mr2`}>
            <FormattedMessage
              id={messages.total.id}
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
            <FormattedMessage {...messages.buyItems} />
          </BuyButton>
        </div>
      </div>
    )
  }

  private findAvailableProduct = (item: Item): boolean =>
    item.sellers.find(
      (seller: Seller) =>
        seller !== undefined &&
        seller.commertialOffer !== undefined &&
        seller.commertialOffer.AvailableQuantity !== undefined &&
        seller.commertialOffer.AvailableQuantity > 0
    ) !== undefined

  private normalizeProduct = (product: Product): Product | null => {
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

  private productShape = (item: ListItemWithProduct): Product | undefined => {
    const product = this.normalizeProduct(item.product)
    return product
      ? path(['sku', 'itemId'], product) && {
          brand: product.brand,
          detailUrl: `/${product.linkText}/p`,
          imageUrl: path(['sku', 'image', 'imageUrl'], product),
          listPrice: path(
            ['sku', 'seller', 'commertialOffer', 'ListPrice'],
            product
          ),
          name: product.productName,
          price: path(['sku', 'seller', 'commertialOffer', 'Price'], product),
          quantity: 1,
          seller: path(['sku', 'seller', 'sellerId'], product),
          skuId: path(['sku', 'itemId'], product),
          variant: path(['sku', 'name'], product),
        }
      : undefined
  }

  private calculateTotal = (): number => {
    const { items } = this.props
    if (items) {
      return map(({ product: { items } }) => {
        if (items && head(items)) {
          return items[0].sellers[0].commertialOffer.Price
        }
        return 0
      }, items).reduce((a, b) => a + b, 0)
    }
    return 0
  }
}

export default compose(
  withToast,
  injectIntl
)(Footer)
