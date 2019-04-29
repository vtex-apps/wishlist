import React, { Component, ReactNode } from 'react'
import { IconOptionsDots } from 'vtex.styleguide'
import MenuOptionsContent from './MenuOptionsContent'

interface MenuOptionsState {
  showContent?: boolean
}

interface MenuOptionsProps {
  options: Option[]
  size?: number
}

const ICON_SIZE_DEFAULT = 16

class MenuOptions extends Component<MenuOptionsProps, MenuOptionsState> {
  public state: MenuOptionsState = {}

  public defaultProps: MenuOptionsProps = {
    options: [],
    size: ICON_SIZE_DEFAULT,
  }

  public render(): ReactNode {
    const { showContent } = this.state
    const { options, size } = this.props
    return (
      <div className="flex items-center c-action-primary pointer relative">
        <div
          onClick={() => this.setState({ showContent: true })}>
          <IconOptionsDots size={size} />
        </div>
        {showContent && (
          <MenuOptionsContent
            onClose={() => this.setState({ showContent: false })}
            options={options} />
        )}
      </div>
    )
  }
}

export default MenuOptions