import React, { Component, ReactNode } from "react"
import { IconOptionsDots } from 'vtex.styleguide'
import MenuOptionsContent from './MenuOptionsContent'

enum Size {
  large, small
}

interface MenuOptionsState {
  showContent?: boolean
}

interface MenuOptionsProps {
  options: Option[]
  size: Size
}

const ICON_SIZE: any = {
  'large': 20,
  'small': 16
}

class MenuOptions extends Component<MenuOptionsProps, MenuOptionsState> {
  public state: MenuOptionsState = {}

  public defaultProps: MenuOptionsProps = {
    size: Size.small,
    options: []
  }

  public render(): ReactNode {
    const { showContent } = this.state
    const { options, size } = this.props
    return (
      <div className="flex items-center c-action-primary pointer relative">
        <div
          onClick={() => this.setState({ showContent: true })}>
          <IconOptionsDots size={ICON_SIZE[size]} />
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