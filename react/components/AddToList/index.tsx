import React, { Component, ReactNode } from 'react'
import { isMobile } from 'react-device-detect'
import BottomBar from '../BottomBar'
import Popover from '../Popover'
import ListMenuContent from './Content'

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
    ) : <Popover onOutsideClick={onClose} left>
        {content}
      </Popover>
  }
}

export default AddToList