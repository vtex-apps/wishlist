import React, { Component, ReactNode } from 'react'

class Screen extends Component {
  public render(): ReactNode {
    return (
      <div className="fixed vh-100 w-100 left-0 top-0 z-4 bg-base">
        {this.props.children}
      </div>
    )
  }
}

export default Screen