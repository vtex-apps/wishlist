import React, { Component, ReactNode } from "react"
import ListMenuContent from './ListMenuContent'
import BottomBar from './BottomBar'

interface ListMenuProps {
  product: any
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
}

interface ListMenuState { }

class ListMenu extends Component<ListMenuProps, ListMenuState> {
  public render(): ReactNode {
    const { onClose } = this.props
    return (
      <BottomBar onOutsideClick={onClose}>
        <ListMenuContent {...this.props} />
      </BottomBar>
    )
  }
}

export default ListMenu