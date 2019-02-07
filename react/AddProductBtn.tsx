import React, { Component, ReactNode, Fragment } from 'react'
import ListMenu from './ListMenu'
import Icon from 'vtex.use-svg/Icon'
import { withToast, Spinner } from 'vtex.styleguide'
import { withApollo } from "react-apollo"
import { ApolloClient } from "apollo-client"
import { addProductToDefaultList } from './GraphqlClient'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from './utils/translate'

interface Product {
  productId: string
  skuId: string
  quantity: number
}

interface AddProductBtnProps {
  product: Product
  showToast: ({ }) => void
  client: ApolloClient<any>
  intl: intlShape
}

interface AddProductBtnState {
  showContent: boolean,
  isLoading?: boolean,
}

class AddProductBtn extends Component<AddProductBtnProps, AddProductBtnState> {
  public state: AddProductBtnState = {
    showContent: false
  }

  private handleAddProductSuccess = (): void => {
    const { intl } = this.props
    this.setState({ isLoading: false })
    this.props.showToast({
      message: translate('wishlist-add-to-list', intl),
      action: {
        label: translate('wishlist-see-lists', intl),
        onClick: () => this.setState({ showContent: true })
      }
    })
  }

  private handleAddProductFailed = (error: string): void => {
    const { intl } = this.props
    this.setState({ isLoading: false })
    console.error('Add product error', error)
    this.props.showToast({ message: translate('wishlist-add-product-fail', intl) })
  }

  private onAddProductClick = (): void => {
    const { client, product } = this.props
    this.setState({ isLoading: true })
    addProductToDefaultList(client, product)
      .then(this.handleAddProductSuccess)
      .catch(this.handleAddProductFailed)
  }

  public render(): ReactNode {
    const { showContent, isLoading } = this.state
    return (
      <Fragment>
        <div
          className="pa4 pointer hover-bg-light-gray flex items-center"
          onClick={!isLoading ? this.onAddProductClick : () => { }}
        >
          {isLoading ? <Spinner size={17} /> : <Icon id="mpa-heart" />}
        </div>
        {showContent && (
          <ListMenu
            onClose={() => this.setState({ showContent: false })}
          />
        )}
      </Fragment>
    )
  }
}

export default injectIntl(withToast(withApollo<AddProductBtnProps, {}>(AddProductBtn)))