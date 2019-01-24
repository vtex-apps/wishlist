import React from 'react'
import { IconCheck } from 'vtex.styleguide'

interface SnackBarProps {
  text: string
}

const SnackBar: React.SFC<SnackBarProps> = ({ text }) => {
  return (
    <div className="flex-row jcc aic tc bg-white fixed w-100 left-0 bottom-0 z-max pt3 bg-base--inverted pa5 c-muted-5">
      <IconCheck size={17} />
      <span className="pl3">{text}</span>
    </div>
  )
}

export default SnackBar
