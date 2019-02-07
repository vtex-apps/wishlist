import React, { Component, ReactNode } from "react"
import ListMenuContent from './ListMenuContent'
import { createPortal } from 'react-dom'

interface ListMenuProps {
  onClose: () => void
}

interface ListMenuState { }

class ListMenu extends Component<ListMenuProps, ListMenuState> {
  public render(): ReactNode {
    const { onClose } = this.props
    return createPortal(
      <ListMenuContent onClose={onClose} />,
      document.body
    )
  }
}

export default ListMenu