import React from 'react'

const Screen = ({ children }: any): JSX.Element => (
  <div className="fixed vh-100 w-100 left-0 top-0 z-4 bg-base">
    {children}
  </div>
)

export default Screen