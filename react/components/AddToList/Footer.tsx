import React, { Component, ReactNode } from "react"
import { InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { translate } from '../../utils/translate'
import wishlist from '../../wishList.css'

interface FooterProps {
  intl: IntlShape
  isLoading?: boolean
  changedLists: any[]
  onClick: () => void
}

class Footer extends Component<FooterProps & InjectedIntlProps, {}> {
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
          {translate('wishlist-apply', intl)}
        </Button>
      </div>
    )
  }
}

export default injectIntl(Footer)