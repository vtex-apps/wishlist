import React, { Component, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { Button } from 'vtex.styleguide'
import Dialog from './index'

interface DialogMessageProps extends InjectedIntlProps {
  message: string
  onClose: () => void
  onSuccess: () => void
}

interface DialogMessageState {
  isLoading?: boolean
}

const messages = defineMessages({
  cancelDialog: {
    defaultMessage: '',
    id: 'wishlist-dialog-cancel',
  },
  confirmDialog: {
    defaultMessage: '',
    id: 'wishlist-dialog-confirm',
  },
})

class DialogMessage extends Component<DialogMessageProps, DialogMessageState> {
  public state: DialogMessageState = {
    isLoading: false,
  }

  public render(): ReactNode {
    const { message, onClose, onSuccess } = this.props
    const { isLoading } = this.state
    return (
      <Dialog onClose={() => !isLoading && onClose()}>
        <div className="mv6 mh7">
          <span className="tc c-muted-1 t-small">{message}</span>
          <div className="flex flex-row mt4 justify-center">
            <Button
              variation="secondary"
              size="small"
              onClick={onClose}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.cancelDialog} />
            </Button>
            <div className="ml3">
              <Button
                variation="primary"
                size="small"
                onClick={() => {
                  this.setState({ isLoading: true })
                  onSuccess()
                }}
                isLoading={isLoading}
              >
                <FormattedMessage {...messages.confirmDialog} />
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
}

export default injectIntl(DialogMessage)
