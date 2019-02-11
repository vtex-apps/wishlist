import React, { Component, ReactNode } from "react"
import ListMenuContent from './ListMenuContent'
import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

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
    return createPortal(
      <OutsideClickHandler onOutsideClick={onClose}>
      <ListMenuContent {...this.props} />
      </OutsideClickHandler >,
      document.body
    )
  }
}

export default ListMenu