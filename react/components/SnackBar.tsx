import React from 'react'
import { IconCheck } from 'vtex.styleguide'

interface SnackBarProps {
  text: string
}

const SnackBar: React.SFC<SnackBarProps> = ({ text }) => {
  return (
    <div className="flex-row jcc aic tc bg-white fixed w-100 left-0 bottom-0 z-max h2 pt3 bg-muted-4">
      <IconCheck size={17} />
      <span className="pl1">{text}</span>
    </div>
  )
}

export default SnackBar
