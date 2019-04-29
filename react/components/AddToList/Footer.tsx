import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import styles from '../../wishList.css'

interface FooterProps {
  isLoading?: boolean
  changedLists: any[]
  onClick: () => void
}

const Footer = ({ isLoading, changedLists, onClick }: FooterProps): JSX.Element => (
  <div className={styles.applyButton}>
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

export default Footer