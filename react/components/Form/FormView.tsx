import React, { Component, ReactNode } from 'react'
import isMobile from 'react-device-detect'
import Dialog from '../Dialog/index'
import Screen from '../Screen'

interface FormViewProps {
  onClose: () => void
  children: ReactNode
}

class FormView extends Component<FormViewProps, {}> {
  public render(): ReactNode {
    const { children, onClose } = this.props

    return isMobile ? (
      <Screen>
        {children}
      </Screen>
    ) : (
        <Dialog onClose={onClose}>
          {children}
        </Dialog>
      )
  }
}

export default FormView