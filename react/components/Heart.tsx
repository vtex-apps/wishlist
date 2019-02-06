import React from 'react'
import Icon from 'vtex.use-svg/Icon'

interface HeartProps {
  onClick: () => void,
  onLongClick: () => void,
}

const Heart: React.SFC<HeartProps> = ({ onClick, onLongClick }) => {
  return (
    <div
      className="z-9999 w2 h2 pa3 pointer hover-bg-light-gray"
      onClick={onClick}
      onLongClick={onLongClick}
    >
      <Icon id="mpa-heart" />
    </div>
  )
}

export default Heart