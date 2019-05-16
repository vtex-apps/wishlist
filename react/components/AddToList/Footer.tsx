import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import messages from '../../constants/messages'

import styles from '../../wishList.css'

interface FooterProps {
  isLoading?: boolean
  changedLists: number[]
  onClick: () => void
}

const Footer = ({
  isLoading,
  changedLists,
  onClick,
}: FooterProps): JSX.Element => (
  <div className={styles.confirmSelectedListsBtn}>
    <Button
      vatiation="primary"
      disabled={!changedLists.length}
      block
      onClick={onClick}
      isLoading={isLoading}
    >
      <FormattedMessage {...messages.apply} />
    </Button>
  </div>
)

export default Footer
