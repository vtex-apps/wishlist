import React, { Component, ReactNode } from "react"
import { translate } from '../../utils/translate'
import { Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import wishlist from '../../wishList.css'

interface FooterProps {
  intl?: intlShape
  isLoading: boolean
  changedLists: any[]
  onClick: () => void
}

class Footer extends Component<FooterProps, {}> {
  public render(): ReactNode {
    const { intl, isLoading, changedLists, onClick } = this.props
    return (
      <div className={wishlist.applyButton}>
        <Button
          vatiation="primary"
          disabled={!changedLists.length}
          block
          onClick={onClick}
          isLoading={isLoading}
        >
          {translate("wishlist-apply", intl)}
        </Button>
      </div>
    )
  }
}

export default injectIntl(Footer)