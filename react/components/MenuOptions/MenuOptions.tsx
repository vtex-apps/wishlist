import React, { Component, ReactNode } from "react"
import { IconOptionsDots } from 'vtex.styleguide'
import MenuOptionsContent from './MenuOptionsContent'

interface MenuOptionsState {
  showContent?: boolean
}

interface MenuOptionsProps {
  options: Option[]
}

class MenuOptions extends Component<MenuOptionsProps, MenuOptionsState> {
  public state: MenuOptionsState = {}

  public render(): ReactNode {
    const { showContent } = this.state
    const { options } = this.props
    return (
      <div className="flex items-center c-action-primary pointer relative">
        <div
          onClick={() => this.setState({ showContent: true })}>
          <IconOptionsDots />
        </div>
        {showContent && (
          <MenuOptionsContent
          onClose={() => this.setState({ showContent: false })}
          options={options}/>
        )}
      </div>
    )
  }
}

export default MenuOptions