import React from 'react'

import { IconVisibilityOff, IconVisibilityOn, IconOptionsDots } from 'vtex.styleguide'

interface ListItemProps {
  onClick: () => void
  isPublic: boolean
  name: string
}

const EYE_SIZE = 15
const DOTS_SIZE = 20

const ListItem: React.SFC<ListItemProps> = ({
  isPublic,
  name,
  onClick
}) => {
  return (
    <div
      className="flex w-100 pt4 pb4 items-center bb b--muted-2 pointer"
      onClick={onClick}
    >
      <div className="w-10 flex items-center justify-center c-muted-3">
        {isPublic ? (
          <IconVisibilityOn size={EYE_SIZE} />
        ) : (
          <IconVisibilityOff size={EYE_SIZE} />
        )}
      </div>
      <div className="pl3 f5 fw2 ttu w-80 c-muted-1">{name}</div>
      <div className="w-10 flex items-center justify-center">
        <IconOptionsDots size={DOTS_SIZE} />
      </div>
    </div>
  )
}

export default ListItem
