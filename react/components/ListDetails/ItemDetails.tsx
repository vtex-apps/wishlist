import React, { Component, ReactNode } from 'react'

import classNames from 'classnames'
import { append, head, map, path } from 'ramda'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { ExtensionPoint, withRuntimeContext } from 'vtex.render-runtime'
import {
  ButtonWithIcon,
  Checkbox,
  IconDelete,
  withToast,
  ActionMenu
} from 'vtex.styleguide'
import renderLoading from '../Loading'

import { getListDetailed, updateList } from '../../GraphqlClient'

import styles from '../../wishList.css'

interface ItemDetailsProps extends WithApolloClient<{}>, InjectedIntlProps {
  lists?: List[]
  item: ListItem
  onItemSelect: (itemId: string, product: Product, isSelected: boolean) => void
  onItemRemove: (id: string) => Promise<{}>
  showToast: (toastInput: ToastInput) => void
  runtime: Runtime
}

interface ItemDetailsState {
  isSelected?: boolean
  isLoading?: boolean
  isCopying?: boolean
}

class ItemDetails extends Component<ItemDetailsProps, ItemDetailsState> {
  public state: ItemDetailsState = {}
  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render(): ReactNode {
    const {
      item: { product },
      lists,
      intl,
    } = this.props
    const { isSelected, isLoading, isCopying } = this.state
    const deleteIcon = <IconDelete />
    const className = classNames(styles.summaryContainer, 'h4 bb b--muted-4', {
      [styles.summaryContainerLarge]: !isMobile,
    })

    return (
      <div className="relative">
        <div className="absolute ml4 mt4">
          <label className="db pa3">
            <Checkbox
              checked={isSelected}
              onChange={this.handleItemSelectedChange}
            />
          </label>
        </div>
        <div className="absolute top-0 right-0 flex flex-column items-end">
          {isLoading ? (
            <div className="mr4">{renderLoading()}</div>
          ) : (
            <div className="ph3">
              <ButtonWithIcon
                icon={deleteIcon}
                variation="tertiary"
                onClick={this.handleItemRemove}
              />
            </div>
          )}
          <div className="mt2 mr3">
            {lists &&
              (isCopying ? (
                <div className="mr4">{renderLoading()}</div>
              ) : (
                <ActionMenu
                  label={intl.formatMessage({ id: 'wishlist-copy-to' })}
                  options={this.getActionMenuOptions(lists)}
                  buttonProps={{
                    variation: 'tertiary',
                    size: 'small',
                    disabled: !(lists && lists.length > 0),
                  }}
                />
              ))}
          </div>
        </div>
        <div className={className}>
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

  private getActionMenuOptions = (lists: List[]) : ActionMenuItem[] =>
    lists.map(({ id, name }) => ({
      label: name,
      onClick: () => this.copyProductToList(String(id)),
    }))

  private normalizeProduct = (product: Product | undefined): {} | null => {
    if (!product) {
      return null
    }
    const normalizedProduct = { ...product }
    const sku = head(normalizedProduct.items || [])
    if (sku) {
      const [seller = { commertialOffer: { Price: 0, ListPrice: 0 } }] =
        path(['sellers'], sku) || []
      const [referenceId = { Value: '' }] = path(['referenceId'], sku) || []
      const [image = { imageUrl: '' }] = path(['images'], sku) || []
      const unmixedImage = {
        ...image,
        imageUrl: image.imageUrl.replace(/^https?:/, ''),
      }
      normalizedProduct.sku = {
        ...sku,
        seller,
        referenceId,
        image: unmixedImage,
      }
    }
    return normalizedProduct
  }

  private handleItemSelectedChange = (): void => {
    const {
      item: { id, product },
      onItemSelect,
    } = this.props
    const { isSelected } = this.state
    this.setState({ isSelected: !isSelected })
    onItemSelect(id || '', product || { items: [], sku: '' }, !isSelected)
  }

  private handleItemRemove = (): void => {
    const { onItemRemove, item } = this.props
    this.setState({ isLoading: true })
    onItemRemove(item.id || '')
      .then(
        () => this.isComponentMounted && this.setState({ isLoading: false })
      )
      .catch(
        () => this.isComponentMounted && this.setState({ isLoading: false })
      )
  }

  private copyProductToList = async (listId: string): Promise<void> => {
    const { client, item } = this.props
    this.setState({ isCopying: true })
    const {
      data: { list },
    } = await getListDetailed(client, listId)
    list.items = append(
      this.itemWithoutProduct(item),
      map((listItem: ListItem) => this.itemWithoutProduct(listItem), list.items)
    )
    await updateList(client, listId, list)
    this.showMessage(list.name || '', listId)
    this.setState({ isCopying: false })
  }

  private itemWithoutProduct = ({
    id,
    productId,
    skuId,
    quantity,
  }: ListItem): ListItem => ({ id, productId, skuId, quantity })

  private showMessage = (listName: string, listId: string) => {
    const {
      showToast,
      intl,
      runtime: { setQuery },
    } = this.props
    showToast({
      action: {
        label: intl.formatMessage({ id: 'wishlist-see' }),
        onClick: () => setQuery({ listId }, { merge: false, replace: true }),
      },
      message: intl.formatMessage({ id: 'wishlist-copied' }, { listName }),
    })
  }
}

export default compose(
  withToast,
  withApollo,
  injectIntl,
  withRuntimeContext
)(ItemDetails)
