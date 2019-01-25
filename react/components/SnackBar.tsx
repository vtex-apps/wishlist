import React from 'react'

interface SnackBarProps {
  text: string,
  action?: () => void,
  actionLabel?: string,
}

const SnackBar: React.SFC<SnackBarProps> = ({ text, action, actionLabel }) => {
  return (
    <div className="flex-row jcc aic bg-white fixed w-100 left-0 bottom-0 z-max pt3 bg-base--inverted pa5 c-muted-5">
      {/* <IconCheck size={17} /> */}
      <span className="fl">{text}</span>
      {action && actionLabel && (
        <span
          className="h-100 pointer ttu c-action-secondary fr"
          onClick={action}
        >
          {actionLabel}
        </span>
      )}
    </div>
  )
}

export default SnackBar
