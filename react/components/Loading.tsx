import React, { ReactNode } from 'react'
import { Spinner } from 'vtex.styleguide'

export default (): ReactNode => {
  return (
    <div className="flex justify-center pt4">
      <span className="dib c-muted-1">
        <Spinner color="currentColor" size={20} />
      </span>
    </div>
  )
}