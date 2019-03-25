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

class MenuOptions extends Component<MenuOptionsProps, MenuOptionsState> {
  public state: MenuOptionsState = {}

  public defaultProps: MenuOptionsProps = {
    options: [],
    size: 16,
  }

  private __isMounted: boolean = false

  public componentDidMount() {
    this.__isMounted = true
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }

  public render(): ReactNode {
    const { showContent } = this.state
    const { options, size } = this.props
    return (
      <div className="flex items-center c-action-primary pointer relative">
        <div
          onClick={() => this.__isMounted && this.setState({ showContent: true })}>
          <IconOptionsDots size={size} />
        </div>
        {showContent && (
          <MenuOptionsContent
            onClose={() => this.__isMounted && this.setState({ showContent: false })}
            options={options} />
        )}
      </div>
    )
  }
}

export default MenuOptions