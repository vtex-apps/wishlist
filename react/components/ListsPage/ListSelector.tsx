import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'

import ListItem from '../ListItem'

interface ListSelectorProps {
  lists: List[]
  selectedListId: string
  runtime: Runtime
}

class ListSelector extends Component<ListSelectorProps, {}> {
  public render(): ReactNode {
    return (
      <div className="flex flex-column w5 h-100">
        <div className="bl b--rebel-pink bw2 pa4 b">
          <FormattedMessage id="wishlist-my-lists" />
        </div>
        <div className="h-100 overflow-auto">{this.renderLists()}</div>
      </div>
    )
  }

  private renderLists = (): ReactNode => {
    const { lists, selectedListId } = this.props
    return lists
      ? lists.map((list: List, index: number) => (
          <ListItem
            key={list.id}
            id={index}
            list={list}
            isDefault={false}
            hideAction
            hideBorders
            isSelected={list.id === selectedListId}
            onClick={this.handleOnListSelect}
          />
        ))
      : null
  }

  private handleOnListSelect = (id: number): void => {
    const {
      runtime: { setQuery },
      lists,
    } = this.props
    setQuery({ listId: lists[id].id }, { merge: false, replace: true })
  }
}

export default withRuntimeContext(ListSelector)
