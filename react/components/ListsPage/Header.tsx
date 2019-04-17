import React, { Component, ReactNode } from 'react'
import { ButtonWithIcon, IconPlusLines } from 'vtex.styleguide'

import CreateList from '../Form/CreateList'
import ListSelector from './ListSelector'

interface HeaderState {
  showcreateList?: boolean
}

class Header extends Component<{}, HeaderState> {
  public state: HeaderState = {}

  public render(): ReactNode {
    const { showcreateList } = this.state
    const plusIcon = <IconPlusLines />

    return (
      <div className="w-100 ph8 flex">
        {/* <ListSelector /> */}
        <div className="w-100 flex items-end">
        <ButtonWithIcon
          icon={plusIcon}
          variation="tertiary"
          onClick={() => this.setState({ showcreateList: true })}
        />
        </div>
        {showcreateList && (
          <CreateList
            onClose={() => this.setState({ showcreateList: false })}
            onFinishAdding={this.onListCreated}
          />
        )}
      </div>
    )
  }

  private onListCreated = (list: any): void => {
    this.setState({ showcreateList: false })
    console.log('list created', list)
  }
}

export default Header