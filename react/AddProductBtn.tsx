import React, { Component } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconHeart } from 'vtex.store-icons'
import { ButtonWithIcon, withToast } from 'vtex.styleguide'
import AddToList from './components/AddToList/index'
import MyLists from './MyLists'

import { addProductToDefaultList, getListsIdFromCookies } from './GraphqlClient'

interface AddProductBtnProps extends InjectedIntlProps, WithApolloClient<{}> {
  large?: boolean
  product: ListItem
  showToast: (toastInput: ToastInput) => void
  runtime: Runtime
}

interface AddProductBtnState {
  showContent?: boolean
  showLists?: boolean
  isLoading?: boolean
}

const ICON_SIZE_SMALL = 16
const ICON_SIZE_LARGE = 32

class AddProductBtn extends Component<AddProductBtnProps, AddProductBtnState> {
  public state: AddProductBtnState = {}

  public render() {
    const { product, large } = this.props
    const { showContent, showLists, isLoading } = this.state
    return (
      <div className="relative">
        <ButtonWithIcon
          variation="tertiary"
          onClick={this.handleAddProductClick}
          isLoading={isLoading}
          icon={
            <IconHeart
              color="c-muted-3"
              width={large ? ICON_SIZE_LARGE : ICON_SIZE_SMALL}
              height={large ? ICON_SIZE_LARGE : ICON_SIZE_SMALL}
            />
          }
        />
        {showContent && (
          <AddToList
            onAddToListsFail={this.handleAddToListsFail}
            onAddToListsSuccess={this.handleAddToListsSuccess}
            product={product}
            onClose={() => this.setState({ showContent: false })}
          />
        )}
        {showLists && (
          <MyLists onClose={() => this.setState({ showLists: false })} />
        )}
      </div>
    )
  }

  private handleAddProductSuccess = (): void => {
    const [listId] = getListsIdFromCookies()
    const {
      showToast,
      intl,
      runtime: { navigate },
    } = this.props
    this.setState({ showContent: isMobile, isLoading: false })

    if (!isMobile) {
      showToast({
        action: {
          label: intl.formatMessage({ id: 'wishlist-see-lists' }),
          onClick: () =>
            navigate({
              page: 'store.lists',
              query: `listId=${listId}`,
            }),
        },
        message: intl.formatMessage({ id: 'wishlist-product-added-to-list' }),
      })
    }
  }

  private handleAddProductFailed = (error: string): void => {
    const { intl } = this.props
    this.setState({ isLoading: false })
    console.error(error)
    this.props.showToast({
      message: intl.formatMessage({ id: 'wishlist-add-product-fail' }),
    })
  }

  private handleAddProductClick = (): void => {
    const { isLoading } = this.state
    if (isLoading) {
      return
    }
    const { client, product, intl } = this.props
    this.setState({ isLoading: true })
    addProductToDefaultList(
      intl.formatMessage({ id: 'wishlist-default-list-name' }),
      client,
      product
    )
      .then(this.handleAddProductSuccess)
      .catch(this.handleAddProductFailed)
  }

  private handleAddToListsFail = (): void => {
    const { showToast, intl } = this.props
    showToast({
      message: intl.formatMessage({ id: 'wishlist-add-product-fail' }),
    })
  }

  private handleAddToListsSuccess = (): void => {
    const {
      showToast,
      intl,
      runtime: { navigate },
    } = this.props
    showToast({
      action: {
        label: intl.formatMessage({ id: 'wishlist-see-lists' }),
        onClick: () => {
          if (isMobile) {
            this.setState({ showLists: true })
          } else {
            navigate({ page: 'store.lists' })
          }
        },
      },
      message: intl.formatMessage({ id: 'wishlist-product-added-to-list' }),
    })
  }
}

export default compose(
  withRuntimeContext,
  injectIntl,
  withToast,
  withApollo
)(AddProductBtn)
