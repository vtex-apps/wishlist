import React, { Component, Fragment, ReactNode } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

interface DialogProps {
  onClose: () => void
  children: ReactNode
}

class Dialog extends Component<DialogProps, {}> {
  public render(): ReactNode {
    const { onClose, children } = this.props
    console.log('Dentro do dialog')
    return (
      <Fragment>
        <div
          className="vh-100 vw-100 bg-base--inverted fixed top-0 left-0 z-4 o-40"
        />
        <div className="vh-100 vw-100 fixed top-0 left-0 flex items-center justify-center z-4">
          <OutsideClickHandler onOutsideClick={() => onClose()}>
            <div className="bg-base flex flex-column pv6 ph7 shadow-3 mh7">
              {children}
            </div>
          </OutsideClickHandler>
        </div>
      </Fragment>
    )
  }
}

export default Dialog