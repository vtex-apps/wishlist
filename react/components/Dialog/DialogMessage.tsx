import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'
import Dialog from './index'

interface DialogMessageProps {
  message: string
  onClose: () => void
  onSuccess: () => void
  intl?: IntlShape
}

interface DialogMessageState {
  isLoading?: boolean
}

class DialogMessage extends Component<DialogMessageProps & InjectedIntlProps, DialogMessageState> {
  public state: DialogMessageState = {}

  public render(): ReactNode {
    const { message, onClose, onSuccess } = this.props
    const { isLoading } = this.state
    return (
      <Dialog onClose={() => !isLoading && onClose()}>
        <Fragment>
          <span className="tc c-muted-1 t-small">{message}</span>
          <div className="flex flex-row mt4 justify-center">
            <Button
              variation="secondary"
              size="small"
              onClick={onClose}
              disabled={isLoading}
            >
              <FormattedMessage id="wishlist-dialog-cancel" />
            </Button>
            <div className="ml3">
              <Button
                variation="primary"
                size="small"
                onClick={() => { this.setState({ isLoading: true }); onSuccess() }}
                isLoading={isLoading}
              >
                <FormattedMessage id="wishlist-dialog-confirm" />
              </Button>
            </div>
          </div>
        </Fragment>
      </Dialog>
    )
  }
}

export default injectIntl(DialogMessage)