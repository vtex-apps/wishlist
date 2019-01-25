import React, { Component, ReactNode, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { isMobile } from 'react-device-detect'
import Heart from '../Heart'
import WishListContent from '../WishListContent'
import SnackBar from './../SnackBar'

interface AddProductState {
  isOpened: boolean
  snackMessage?: string
  showMenu?: boolean
}

interface AddProductProps {
  skuId?: string
  productId?: string,
  showMenu?: boolean,
}

/**
 * AddProduct component
 */
class AddProduct extends Component<AddProductProps, AddProductState> {
  public state: AddProductState = {
    isOpened: false,
    snackMessage: "",
    showMenu: false,
  }

  public toggleMode = (): void => {
    this.setState({
      isOpened: !this.state.isOpened,
      showMenu: false,
    })
  }
  public onSuccess = (): void => {
    this.toggleMode()
    this.setState({ snackMessage: 'Produto adicionado com sucesso' })
    setTimeout(() => this.setState({ snackMessage: "" }), 2000)
  }

  public render(): ReactNode {
    const { isOpened, snackMessage } = this.state
    const { skuId, productId, showMenu } = this.props

    const large = isMobile || (window && window.innerWidth <= 480)

    return (
      <Fragment>
        <Heart
        onClick={this.toggleMode}
        onLongClick={() => this.setState({ showMenu: true })} />
        {isOpened &&
          ReactDOM.createPortal(
            <WishListContent
              showMenu={showMenu}
              large={large}
              skuId={skuId}
              productId={productId}
              onSuccess={this.onSuccess}
              onClose={this.toggleMode}
            />,
            document.body
          )}
        {snackMessage && ReactDOM.createPortal(<SnackBar text={snackMessage} />, document.body)}
      </Fragment>
    )
  }
}

export default AddProduct
