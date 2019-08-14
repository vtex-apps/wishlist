import React from 'react'
import { Spinner } from 'vtex.styleguide'

const SPINNER_SIZE = 20

const Loading = () => {
  return (
    <div className="flex justify-center pt4">
      <span className="dib c-muted-1">
        <Spinner color="currentColor" size={SPINNER_SIZE} />
      </span>
    </div>
  )
}

export default Loading
