import { ApolloClient } from 'apollo-client'
import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import { InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { ExtensionPoint, withRuntimeContext } from 'vtex.render-runtime'
import { IconHeart } from 'vtex.store-icons'
import { Spinner, withToast } from 'vtex.styleguide'
import AddToList from './components/AddToList/index'
import { addProductToDefaultList, getListsIdFromCookies } from './GraphqlClient'

interface AddProductBtnProps {
  large?: boolean
  product: Product
  showToast: ({ }) => void
  client: ApolloClient<any>
  intl: IntlShape
  runtime?: any
}

interface AddProductBtnState {
  showContent?: boolean
  showLists?: boolean
  isLoading?: boolean
}

const ICON_SIZE_SMALL = 16
const ICON_SIZE_LARGE = 32

class AddProductBtn extends Component<
  AddProductBtnProps & InjectedIntlProps,
  AddProductBtnState
  > {
  public state: AddProductBtnState = {}

  public render() {
    const { product, large } = this.props
    const { showContent, showLists, isLoading } = this.state
    return (
      <div className="relative">
        <div
          className="pa4 pointer hover-bg-light-gray flex items-center"
          onClick={this.onAddProductClick}
        >
          {isLoading ? (
            <Spinner size={17} />
          ) : (
              <IconHeart
                width={large ? ICON_SIZE_LARGE : ICON_SIZE_SMALL}
                height={large ? ICON_SIZE_LARGE : ICON_SIZE_SMALL}
              />
            )}
        </div>
        {showContent && (
          <AddToList
            onAddToListsFail={this.onAddToListsFail}
            onAddToListsSuccess={this.onAddToListsSuccess}
            product={product}
            onClose={() => this.setState({ showContent: false })}
          />
        )}
        {showLists && (
          <ExtensionPoint
            id="my-lists"
            onClose={() => this.setState({ showLists: false })}
          />
        )}
      </div>
    )
  }

  private handleAddProductSuccess = (): void => {
    const listId = getListsIdFromCookies()[0]
    const { showToast, intl, runtime: { navigate } } = this.props
    this.setState({ showContent: isMobile, isLoading: false })

    showToast({
      action: {
        label: intl.formatMessage({ id: 'wishlist-see-lists' }),
        onClick: () => navigate({ page: 'store.listsWithId', params: { listId } }),
      },
      message: intl.formatMessage({ id: 'wishlist-product-added-to-list' }),
    })
  }

  private handleAddProductFailed = (error: string): void => {
    const { intl } = this.props
    this.setState({ isLoading: false })
    console.error(error)
    this.props.showToast({
      message: intl.formatMessage({ id: 'wishlist-add-product-fail' }),
    })
  }

  private onAddProductClick = (): void => {
    const { isLoading } = this.state
    if (!isLoading) {
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
  }

  private onAddToListsFail = (): void => {
    const { showToast, intl } = this.props
    showToast({
      message: intl.formatMessage({ id: 'wishlist-add-product-fail' }),
    })
  }

  private onAddToListsSuccess = (): void => {
    const { showToast, intl, runtime: { navigate } } = this.props
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

export default withRuntimeContext(
  injectIntl(
    withToast(
      withApollo<AddProductBtnProps & InjectedIntlProps, {}>(AddProductBtn)
    )
  )
)
