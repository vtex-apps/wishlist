import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'

import ListItem from '../ListItem'

interface ListSelectorProps {
  lists: any
  selectedListId: string
  runtime?: any
}

class ListSelector extends Component<ListSelectorProps, {}> {
  public render(): ReactNode {
    return (
      <div className="flex flex-column">
        <div className="bl b--rebel-pink bw2 pa4 b">
          <FormattedMessage
            id="wishlist-my-lists"
          />
        </div>
        {this.renderLists()}
      </div>
    )
  }

  private renderLists = (): ReactNode => {
    const { lists, selectedListId } = this.props
    return lists ? lists.map((list: List, index: number) => (
      <ListItem
        key={index}
        id={index}
        list={list}
        isDefault={false}
        hideAction
        hideBorders
        isSelected={list.id === selectedListId}
        onClick={this.handleOnListSelect}
      />
    )) : null
  }

  private handleOnListSelect = (id: number): void => {
    const { runtime: { navigate }, lists } = this.props
    navigate({
      page: 'store.lists',
      params: { listId: lists[id].id },
    })
  }
}

export default withRuntimeContext(ListSelector)