import React, { Component, ReactNode } from "react"
import ListMenuContent from './AddToListContent'
import BottomBar from '../BottomBar'

interface AddToListProps {
  product: any
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
}

class AddToList extends Component<AddToListProps, {}> {
  public render(): ReactNode {
    const { onClose } = this.props
    return (
      <BottomBar onOutsideClick={onClose}>
        <ListMenuContent {...this.props} />
      </BottomBar>
    )
  }
}

export default AddToList