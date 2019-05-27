import React from 'react'
import { isMobile } from 'react-device-detect'
import BottomBar from '../BottomBar'
import Popover from '../Popover'
import ListMenuContent from './Content'

interface AddToListProps {
  product: ListItem
  iconSize: number | null
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
}

const AddToList = (props: AddToListProps): JSX.Element => {
  const { onClose, iconSize } = props
  const content = <ListMenuContent {...props} />
  return isMobile ? (
    <BottomBar onOutsideClick={onClose}>{content}</BottomBar>
  ) : (
    <Popover onOutsideClick={onClose} left iconSize={iconSize}>
      {content}
    </Popover>
  )
}

export default AddToList
