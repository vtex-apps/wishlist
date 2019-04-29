import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import wishlist from '../../wishList.css'

interface FooterProps {
  isLoading?: boolean
  changedLists: any[]
  onClick: () => void
}

export default ({ isLoading, changedLists, onClick }: FooterProps): JSX.Element => (
  <div className={wishlist.applyButton}>
    <Button
      vatiation="primary"
      disabled={!changedLists.length}
      block
      onClick={onClick}
      isLoading={isLoading}
    >
      <FormattedMessage id="wishlist-apply" />
    </Button>
  </div>
)