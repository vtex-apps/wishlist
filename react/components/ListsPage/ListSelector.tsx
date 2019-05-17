import React, { Component, ReactNode } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { ButtonWithIcon, IconPlusLines } from 'vtex.styleguide'
import CreateList from '../Form/CreateList'

import ListItem from '../ListItem'

interface ListSelectorProps {
  lists: List[]
  selectedListId: string
  onListCreated: (list: List) => void
  runtime: Runtime
}

interface ListSelectorState {
  showCreateList: boolean
}

const ICONS_SIZE = 20
const messages = defineMessages({
  myLists: {
    defaultMessage: '',
    id: 'store/wishlist-my-lists',
  },
})

class ListSelector extends Component<ListSelectorProps, ListSelectorState> {
  public state = {
    showCreateList: false,
  }

  public render(): ReactNode {
    const { showCreateList } = this.state
    const plusIcon = <IconPlusLines size={ICONS_SIZE} />

    return (
      <div className="flex flex-column w5 h-100">
        <div className="bl b--rebel-pink bw2 pa4 b flex items-center flex-row">
          <div className="w-100">
            <FormattedMessage {...messages.myLists} />
          </div>
          <ButtonWithIcon
            variation="tertiary"
            icon={plusIcon}
            onClick={this.handleCreateList}
          />
        </div>
        <div className="h-100 overflow-auto">{this.renderLists()}</div>
        {showCreateList && (
          <CreateList
            onClose={() => this.setState({ showCreateList: false })}
            onFinishAdding={this.handleListCreated}
          />
        )}
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

  private handleCreateList = () => {
    this.setState({ showCreateList: true })
  }

  private handleListCreated = (list: List): void => {
    const { onListCreated } = this.props
    this.setState({ showCreateList: false })
    onListCreated(list)
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
