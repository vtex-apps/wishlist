import React, { Component, ReactNode, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { isMobile } from 'react-device-detect'
import Heart from '../Heart'
import WishListContent from '../WishListContent'
import SnackBar from './../SnackBar'

interface AddProductState {
  isOpened: boolean
  snackMessage?: string
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
    isOpened: false,
    snackMessage: null
  }

  public toggleMode = (): void => {
    this.setState({
      isOpened: !this.state.isOpened
    })
  }
  public onSuccess = (): void => {
    this.toggleMode()
    this.setState({ snackMessage: 'Produto adicionado com sucesso' })
    setTimeout(() => this.setState({ snackMessage: null }), 2000)
  }

  public render(): ReactNode {
    const { isOpened, snackMessage, snackNode } = this.state
    const { skuId, productId } = this.props

    const large = isMobile || (window && window.innerWidth <= 480)

    if (typeof document === 'undefined') return null
    return (
      <Fragment>
        <Heart onClick={this.toggleMode} />
        {isOpened &&
          ReactDOM.createPortal(
            <WishListContent
              large={large}
              skuId={skuId}
              productId={productId}
              onSuccess={this.onSuccess}
            />,
            document.body
          )}
        {snackMessage && ReactDOM.createPortal(<SnackBar text={snackMessage} />, document.body)}
      </Fragment>
    )
  }
}

export default AddProduct
