import { ApolloClient } from "apollo-client"
import React, { Component } from 'react'
import { withApollo } from "react-apollo"
import { injectIntl, IntlShape } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { IconHeart } from 'vtex.store-icons'
import { Spinner, withToast } from 'vtex.styleguide'
import AddToList from './components/AddToList/index'
import { addProductToDefaultList } from './GraphqlClient'

interface AddProductBtnProps {
  large?: boolean
  product: Product
  showToast: ({ }) => void
  client: ApolloClient<any>
  intl: IntlShape
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
  private __isMounted: boolean = false

  public componentDidMount() {
    this.__isMounted = true
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }

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
    this.__isMounted && this.setState({ showContent: true, isLoading: false })
  }

  private handleAddProductFailed = (error: string): void => {
    const { intl } = this.props
    this.__isMounted && this.setState({ isLoading: false })
    console.error(error)
    this.props.showToast({ message: intl.formatMessage({ id: "wishlist-add-product-fail" }) })
  }

  private onAddProductClick = (): void => {
    const { isLoading } = this.state
    if (!isLoading) {
      const { client, product, intl } = this.props
      this.setState({ isLoading: true })
      addProductToDefaultList(intl.formatMessage({ id: "wishlist-default-list-name" }), client, product)
        .then(this.handleAddProductSuccess)
        .catch(this.handleAddProductFailed)
    }
  }

  private onAddToListsFail = (): void => {
    const { showToast, intl } = this.props
    showToast({ message: intl.formatMessage({ id: "wishlist-add-product-fail" }) })
  }

  private onAddToListsSuccess = (): void => {
    const { showToast, intl } = this.props
    showToast({
      action: {
        label: intl.formatMessage({ id: "wishlist-see-lists" }),
        onClick: () => this.setState({ showLists: true }),
      },
      message: intl.formatMessage({ id: "wishlist-product-added-to-list" }),
    })
  }

}

export default injectIntl(withToast(withApollo<AddProductBtnProps, {}>(AddProductBtn)))