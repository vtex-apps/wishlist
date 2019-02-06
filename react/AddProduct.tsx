import React, { Component, ReactNode } from "react"
import { withToast } from 'vtex.styleguide'

interface AddProductProps {
  productId: string
  skuId: string
  quantity: number
  onClose: () => void
}

interface AddProductState {
  showContent: boolean
}

class AddProduct extends Component<AddProductProps, AddProductState> {
  public state: AddProductState = {
    showContent: false
  }

  public render(): ReactNode {
    // const { showContent } = this.state
    // const { showToast } = this.props

    // if (!showContent) {
    //   showToast({ message: 'Hello from toast' })
    //   return null
    // }
    return (
      <span>Hi, guys!</span>
    )
  }
}

export default withToast(AddProduct)