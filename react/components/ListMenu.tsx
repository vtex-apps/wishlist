import React, { Component, ReactNode } from "react"
import ListMenuContent from './ListMenuContent'
import { createPortal } from 'react-dom'

interface ListMenuProps {
  product: any
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
}

interface ListMenuState { }

class ListMenu extends Component<ListMenuProps, ListMenuState> {
  public render(): ReactNode {
    return createPortal(
      <ListMenuContent {...this.props} />,
      document.body
    )
  }
}

export default ListMenu