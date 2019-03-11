import React, { Component, ReactNode } from "react"
import { Checkbox, ButtonWithIcon, IconDelete } from 'vtex.styleguide'
import { ExtensionPoint } from 'vtex.render-runtime'
import { path } from 'ramda'
import renderLoading from '../Loading'

interface ItemDetailsProps {
  item: any
  onItemSelect: (itemId: string, product: any, isSelected: boolean) => void
  onItemRemove: (id: string) => Promise<any>
}

interface ItemDetailsState {
  isSelected?: boolean
  isLoading?: boolean
}

class ItemDetails extends Component<ItemDetailsProps, ItemDetailsState> {
  public state: ItemDetailsState = {}

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

  private onItemSelectedChange = (): void => {
    const { item: { id, product }, onItemSelect } = this.props
    const { isSelected } = this.state
    this.setState({ isSelected: !isSelected })
    onItemSelect(id, product, !isSelected)
  }

  private onItemRemove = (): void => {
    const { onItemRemove, item } = this.props
    this.setState({ isLoading: true })
    onItemRemove(item.id)
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }))
  }

  public render(): ReactNode {
    const { item: { product } } = this.props
    const { isSelected, isLoading } = this.state
    const deleteIcon = <IconDelete />

    return (
      <div className="relative">
        <div className="absolute top-0 left-0 ml5 mt6 pl2">
          <Checkbox
            checked={isSelected}
            onChange={this.onItemSelectedChange}
          />
        </div>
        <div className="absolute top-0 right-0">
          {isLoading ? (
            <div className="mr4">
              {renderLoading()}
            </div>
          ) : (
              <ButtonWithIcon
                icon={deleteIcon}
                variation="tertiary"
                onClick={this.onItemRemove}
              />
            )}
        </div>
        <ExtensionPoint
          id="product-summary"
          showBorders
          product={this.normalizeProduct(product)}
          displayMode="inline"
          showListPrice={false}
          showBadge={false}
          showInstallments={false}
          showLabels={false}
          showQuantitySelector={false}
        />
      </div>
    )
  }
}

export default ItemDetails