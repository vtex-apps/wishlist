import React, { Component, ReactNode } from "react"
import { injectIntl, intlShape } from 'react-intl'
import { translate } from './utils/translate'
import { Button, IconClose } from 'vtex.styleguide'

import wishlist from './wishList.css'

interface ListMenuContentProps {
  onClose: () => void
  intl: intlShape
}

class ListMenuContent extends Component<ListMenuContentProps, {}> {
  private renderHeader = (): ReactNode => {
    const { intl, onClose } = this.props
    return (
      <div className="flex flex-row pa4 items-center bb bt b--muted-4">
        <div className="flex items-center">
          <IconClose size={20} />
        </div>
        <span className="t-heading-6 w-100 mh5">
          {translate('wishlist-add-to-list', intl)}
        </span>
        <div className="flex items-center" onClick={onClose}>
          <IconClose size={20} />
        </div>
      </div>
    )
  }

  private renderMainContent = (): ReactNode => {
    return (
      <div>Main Content</div>
    )
  }

  private renderFooter = (): ReactNode => {
    const { intl } = this.props
    return (
      <div className={wishlist.applyButton}>
        <Button vatiation="primary" block>
          {translate("wishlist-apply", intl)}
        </Button>
      </div>
    )
  }

  public render(): ReactNode {
    return (
      <div className="w-100 bg-black fixed bottom-0 z-max bg-base">
        {this.renderHeader()}
        {this.renderMainContent()}
        {this.renderFooter()}
      </div>
    )
  }
}

export default injectIntl(ListMenuContent)