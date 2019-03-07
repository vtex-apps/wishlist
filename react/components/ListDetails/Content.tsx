import React, { Component, ReactNode, Fragment } from "react"
import { map, path } from 'ramda'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from "../../utils/translate"
import { Button, Checkbox, ButtonWithIcon, IconDelete } from 'vtex.styleguide'
import { withRuntimeContext, ExtensionPoint } from 'vtex.render-runtime'

interface ContentProps {
  items: any
  intl?: intlShape
  runtime?: any
}

let change: boolean = false

class Content extends Component<ContentProps, {}> {
  private normalizeProduct = (product: any): any => {
    if (!product) return null
    const normalizedProduct = { ...product }
    const [sku] = normalizedProduct.items
    if (sku) {
      const [seller = { commertialOffer: { Price: 0, ListPrice: 0 } }] = path(['sellers'], sku) || []
      const [referenceId = { Value: '' }] = path(['referenceId'], sku) || []
      const [image = { imageUrl: '' }] = path(['images'], sku) || []
      const unmixedImage = { ...image, imageUrl: image.imageUrl.replace(/^https?:/, '') }
      normalizedProduct.sku = { ...sku, seller, referenceId, image: unmixedImage }
    }
    return normalizedProduct
  }

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
    const deleteIcon = <IconDelete />
    return (
      <Fragment>
        {map(item => (
          <div className="relative">
            <div className="absolute top-0 left-0 ml5 mt6 pl2">
              <Checkbox
                checked={change}
                onChange={() => change = !change}
              />
            </div>
            <div className="absolute top-0 right-0 mt4">
              <ButtonWithIcon
                icon={deleteIcon}
                variation="tertiary"
                onClick={() => console.log('Clicked in remove item')}
              />
            </div>
            <ExtensionPoint
              id="product-summary"
              showBorders
              product={this.normalizeProduct(item.product)}
              displayMode="inline"
              showListPrice={false}
              showBadge={false}
              showInstallments={false}
              showLabels={false}
            />
          </div>
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