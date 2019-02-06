import React, { Component, ReactNode } from 'react'
import AddProduct from './AddProduct'
import Icon from 'vtex.use-svg/Icon'
import { withToast } from 'vtex.styleguide'
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
  showContent: boolean
}

class AddProductBtn extends Component<AddProductBtnProps, AddProductBtnState> {
  public state: AddProductBtnState = {
    showContent: false
  }

  private handleAddProductSuccess = (response: any): void => {
    const { intl } = this.props
    this.props.showToast({
      message: translate('wishlist-add-product-success', intl),
      action: {
        label: translate('wishlist-see-lists', intl),
        onClick: () => this.setState({ showContent: true })
      }
    })
  }

  private handleAddProductFailed = (error: string): void => {
    const { intl } = this.props
    console.error('Add product error', error)
    this.props.showToast({ message: translate('wishlist-add-product-fail', intl) })
  }

  private onAddProductClick = (): void => {
    const { client, product } = this.props
    addProductToDefaultList(client, product)
      .then(this.handleAddProductSuccess)
      .catch(this.handleAddProductFailed)
  }

  public render(): ReactNode {
    const { showContent } = this.state
    return (
      <div
        className="z-9999 w2 h2 mt1 ml1 pa3 pointer hover-bg-light-gray"
        onClick={this.onAddProductClick}
      >
        <Icon id="mpa-heart" />
        {showContent && (
          <AddProduct
            onClose={() => this.setState({ showContent: false })}
          />
        )}
      </div>
    )
  }
}

export default injectIntl(withToast(withApollo<AddProductBtnProps, {}>(AddProductBtn)))