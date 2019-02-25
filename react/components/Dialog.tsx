import React, { Component, ReactNode, Fragment } from "react"
import OutsideClickHandler from 'react-outside-click-handler'
import { Button } from 'vtex.styleguide'
import { translate } from '../utils/translate'
import { injectIntl, intlShape } from 'react-intl'

interface DialogProps {
  message: string
  onClose: () => void
  onSuccess: () => void
  intl?: intlShape
}

interface DialogState {
  isLoading?: boolean
}

class Dialog extends Component<DialogProps, DialogState> {
  public state: DialogState = {}

  public render(): ReactNode {
    const { message, onClose, onSuccess, intl } = this.props
    const { isLoading } = this.state
    return (
      <Fragment>
        <div
          className="vh-100 vw-100 bg-base--inverted fixed top-0 left-0 z-max o-40"
        />
        <div className="vh-100 vw-100 fixed top-0 left-0 flex items-center justify-center z-max">
          <OutsideClickHandler onOutsideClick={() => !isLoading && onClose()}>
            <div className="bg-base flex flex-column pv6 ph7 shadow-3 mh7">
              <span className="tc c-muted-1 t-small">{message}</span>
              <div className="flex flex-row mt4 justify-center">
                <Button
                  variation="secondary"
                  size="small"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {translate("wishlist-dialog-cancel", intl)}
                </Button>
                <div className="ml3">
                  <Button
                    variation="primary"
                    size="small"
                    onClick={() => { this.setState({ isLoading: true }); onSuccess() }}
                    isLoading={isLoading}
                  >
                    {translate("wishlist-dialog-confirm", intl)}
                  </Button>
                </div>
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(Dialog)