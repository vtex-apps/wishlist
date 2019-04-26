import React, { Component, ReactNode } from 'react'

import ApolloClient from 'apollo-client'
import { append, map, path } from 'ramda'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { ExtensionPoint, withRuntimeContext } from 'vtex.render-runtime'
import {
  ButtonWithIcon,
  Checkbox,
  Dropdown,
  IconDelete,
  withToast,
} from 'vtex.styleguide'
import renderLoading from '../Loading'

import { getListDetailed, updateList } from '../../GraphqlClient'

import wishlist from '../../wishList.css'

interface ItemDetailsProps {
  lists?: List[]
  item: any
  onItemSelect: (itemId: string, product: any, isSelected: boolean) => void
  onItemRemove: (id: string) => Promise<any>
  client?: ApolloClient<any>
  showToast?: ({ }) => void
  intl?: IntlShape
  runtime?: any
}

interface ItemDetailsState {
  isSelected?: boolean
  isLoading?: boolean
  isCopying?: boolean
}

class ItemDetails extends Component<ItemDetailsProps & WithApolloClient<any> & InjectedIntlProps, ItemDetailsState> {
  public state: ItemDetailsState = {}
  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render(): ReactNode {
    const { item: { product }, lists, intl } = this.props
    const { isSelected, isLoading, isCopying } = this.state
    const deleteIcon = <IconDelete />

    return (
      <div className="relative">
        <div className="absolute top-0 left-0 ml5 mt6 pl2">
          <Checkbox
            checked={isSelected}
            onChange={this.onItemSelectedChange}
          />
        </div>
        <div className="absolute top-0 right-0 flex flex-column items-end">
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
          <div className="mt2 mr3">
            {lists && (isCopying ? (
              renderLoading()
            ) : (
                <Dropdown
                  variation="inline"
                  size="large"
                  placeholder={intl.formatMessage({ id: 'wishlist-copy-to' })}
                  options={this.dropdownOptionsShape(lists)}
                  disabled={!(lists && lists.length > 0)}
                  onChange={(_: any, value: any) => this.copyProductToList(value)}
                />
              ))}
          </div>
        </div>
        <div className={`${wishlist.summaryContainer} h4 bb b--muted-4`}>
          <ExtensionPoint
            id="product-summary"
            showBorders
            product={this.normalizeProduct(product)}
            displayMode="inlinePrice"
            showListPrice={false}
            showBadge={false}
            showInstallments={false}
            showLabels={false}
            showQuantitySelector={false}
            priceAlignLeft
          />
        </div>
      </div>
    )
  }

  private dropdownOptionsShape = (lists: any): any => {
    return map(({ id, name }) => ({ value: id, label: name }), lists)
  }

  private normalizeProduct = (product: any): any => {
    if (!product) {
      return null
    }
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
      .then(() => this.isComponentMounted && this.setState({ isLoading: false }))
      .catch(() => this.isComponentMounted && this.setState({ isLoading: false }))
  }

  private copyProductToList = (listId: string): void => {
    const { client, item } = this.props
    if (client) {
      this.setState({ isCopying: true })
      getListDetailed(client, listId)
        .then((resp: any) => {
          const list = resp.data.list
          list.items = append(
            this.itemWithoutProduct(item),
            map((i: any) => this.itemWithoutProduct(i), list.items)
          )
          updateList(client, listId, list)
            .then(() => {
              this.showMessage(list.name, listId)
            })
            .catch((error: any) => console.error(error))
            .finally(() => {
              if (this.isComponentMounted) {
                this.setState({ isCopying: false })
              }
            })
        })
        .catch((err: any) => console.error(err))
    }
  }

  private itemWithoutProduct =
    ({ id, productId, skuId, quantity }: any): any => ({ id, productId, skuId, quantity })

  private showMessage = (listName: string, listId: string) => {
    const { showToast, intl, runtime: { navigate } } = this.props
    if (showToast) {
      showToast({
        action: {
          label: intl.formatMessage({ id: 'wishlist-see' }),
          onClick: () => navigate({
            page: 'store.listsWithId',
            params: { listId },
          }),
        },
        message: intl.formatMessage(
          { id: 'wishlist-copied' },
          { listName }
        ),
      })
    }
  }

}

export default withToast(
  withRuntimeContext(
    injectIntl(
      withApollo(ItemDetails)
    )
  )
)