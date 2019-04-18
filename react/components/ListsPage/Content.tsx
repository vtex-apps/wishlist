import React, { Component, ReactNode } from 'react'

import ApolloClient from 'apollo-client'
import { withApollo, WithApolloClient } from 'react-apollo'
import { getListDetailed } from '../../GraphqlClient'
import ListItems from '../ListDetails/Content'
import Header from './Header'

interface ContentProps {
  listId: string
  onListCreated: (list: List) => void
  onListUpdated: (list: List) => void
  onListDeleted: () => void
  client?: ApolloClient<any>
}

interface ContentState {
  list?: List
  isLoading?: boolean
}

class Content extends Component<ContentProps & WithApolloClient<any>, ContentState> {
  public state: ContentState = {}
  private isComponentMounted = false

  public componentWillUnmount(): void {
    this.isComponentMounted = false
  }

  public componentDidMount(): void {
    this.isComponentMounted = true
    this.fetchListDetails()
  }

  public componentDidUpdate(prevProps: any): void {
    if (this.props !== prevProps) {
      this.fetchListDetails()
    }
  }

  public render(): ReactNode {
    const { list } = this.state
    const { listId } = this.props
    return (
      <div>
        <Header
          list={{ ...list, id: listId }}
          onListCreated={this.props.onListCreated}
          onListUpdated={this.props.onListUpdated}
          onListDeleted={this.props.onListDeleted}
        />
        <div className="ba b--muted-1">
          <ListItems
            items={list ? list.items : []}
            onItemSelect={(itemId: string, product: any, isSelected: boolean) => console.log('hello on item selected')}
            onItemRemove={(id: string) => console.log('on item removed')}
          />
        </div>
      </div>
    )
  }

  private fetchListDetails(): void {
    const { client, listId } = this.props
    if (client) {
      getListDetailed(client, listId)
        .then(response => {
          if (this.isComponentMounted) {
            this.setState({ list: response.data.list, isLoading: false })
          }
        })
    }
  }
}

export default withApollo(Content)