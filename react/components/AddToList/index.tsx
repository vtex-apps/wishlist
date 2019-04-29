import React from 'react'
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

export default (props: AddToListProps): JSX.Element => {
  const { onClose } = props
  const content = <ListMenuContent {...props} />
  return isMobile ? (
    <BottomBar onOutsideClick={onClose}>
      {content}
    </BottomBar>
  ) : <Popover onOutsideClick={onClose} left>
      {content}
    </Popover>
}