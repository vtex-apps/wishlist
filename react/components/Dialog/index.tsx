import React from 'react'
import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

interface DialogProps {
  onClose: () => void
  children: JSX.Element
}

const Dialog = ({ onClose, children }: DialogProps): JSX.Element =>
  createPortal(
    <div className="vh-100 vw-100 fixed top-0 left-0 z-max">
      <div className="h-100 w-100 bg-base--inverted o-40" />
      <div className="vh-100 vw-100 fixed top-0 left-0 flex items-center justify-center z-4">
        <OutsideClickHandler onOutsideClick={() => onClose()}>
          <div className="bg-base flex flex-column shadow-3 mh7">
            {children}
          </div>
        </OutsideClickHandler>
      </div>
    </div>,
    document.body
  )

export default Dialog
