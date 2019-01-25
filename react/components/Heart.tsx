import React from 'react'

interface HeartProps {
  onClick: () => void,
  onLongClick: () => void,
}

const Heart: React.SFC<HeartProps> = ({ onClick, onLongClick }) => {
  return (
    <div
    className="z-9999 w2 h2 mt1 ml1 pa3 pointer hover-bg-light-gray"
    onClick={onClick}
    onLongClick={onLongClick}
    >
      <img src={require('../images/heart.svg')} alt="" />
    </div>
  )
}

export default Heart
