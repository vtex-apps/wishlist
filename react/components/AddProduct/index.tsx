import React, { Component, ReactNode, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { isMobile } from 'react-device-detect'
import Heart from '../Heart'
import WishListContent from '../WishListContent'

interface AddProductState {
  isOpened: boolean
}

interface AddProductProps {
  skuId?: string
  productId?: string
}

/**
 * AddProduct component
 */
class AddProduct extends Component<AddProductProps, AddProductState> {
  public state: AddProductState = {
    isOpened: false
  }

  public toggleMode = (): void => {
    this.setState({
      isOpened: !this.state.isOpened
    })
  }

  public render(): ReactNode {
    const { isOpened } = this.state
    const { skuId, productId } = this.props

    const large = isMobile || (window && window.innerWidth <= 480)

    return (
      <Fragment>
        <Heart onClick={this.toggleMode} />
        {isOpened &&
          ReactDOM.createPortal(
            <WishListContent
              large={large}
              skuId={skuId}
              productId={productId}
            />,
            document.body
          )}
      </Fragment>
    )
  }
}

export default AddProduct
