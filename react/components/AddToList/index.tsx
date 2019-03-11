import React, { Component, ReactNode } from "react"
import ListMenuContent from './Content'
import BottomBar from '../BottomBar'
import { isMobile } from 'react-device-detect'

interface AddToListProps {
  product: any
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
}

class AddToList extends Component<AddToListProps, {}> {
  public render(): ReactNode {
    const { onClose } = this.props
    const content = <ListMenuContent {...this.props} />
    return isMobile ? (
      <BottomBar onOutsideClick={onClose}>
        {content}
      </BottomBar>
    ) : null
  }
}

export default AddToList