import React, { Component, ReactNode, Fragment } from "react"
import { injectIntl, intlShape } from 'react-intl'
import { translate } from './utils/translate'
import {
  Button,
  IconClose,
  IconCheck,
  IconPlusLines,
  IconVisibilityOn,
  IconVisibilityOff,
  Spinner,
} from 'vtex.styleguide'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { getListsFromLocaleStorage } from './GraphqlClient'
import { map } from 'ramda'

import wishlist from './wishList.css'
import { number } from "prop-types";

interface List {
  id: string
  name: string
  isPublic: string
  isSelected?: boolean
}

interface ListMenuContentProps {
  onClose: () => void
  intl: intlShape
  client: ApolloClient<any>
}

interface ListMenuContentState {
  isLoading: boolean
  lists: List[]
}

class ListMenuContent extends Component<ListMenuContentProps, ListMenuContentState> {
  public state: ListMenuContentState = {
    isLoading: true,
    lists: []
  }

  public componentDidMount(): void {
    const { client } = this.props
    getListsFromLocaleStorage(client)
      .then(response => {
        const lists = map(item => item.data.list, response)
        this.setState({ isLoading: false, lists: lists })
      })
      .catch(() => this.setState({ isLoading: false }))
  }

  private renderHeader = (): ReactNode => {
    const { intl, onClose } = this.props
    return (
      <div className="flex flex-row pa4 items-center bb bt b--muted-4">
        <div className="flex items-center" onClick={onClose}>
          <IconClose size={24} />
        </div>
        <span className="t-heading-6 w-100 mh5 flex justify-center">
          {translate('wishlist-add-to-list', intl)}
        </span>
        <div className="flex items-center">
          <IconPlusLines size={20} />
        </div>
      </div>
    )
  }

  private renderLoading = (): ReactNode => {
    return (
      <div className="w-100 h3 flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  // private renderListElement = (list: List): ReactNode => {
  //   return (

  //   )
  // }

  private renderSwitchLists = (): ReactNode => {
    const { lists } = this.state
    return (
      <div className="flex flex-column">
        {
          lists.map((list: List, index: number) => (
            <div key={list.id} className="w-100 bt b--muted-4 flex flex-row pv3 ph4 c-muted-3">
              <div className="flex items-center">{list.isPublic ? <IconVisibilityOn /> : <IconVisibilityOff />}</div>
              <span className="w-100 mh4 mv1 c-muted-1">{list.name}</span>
              <div className="flex items-center c-success">{(list.isSelected || index === 0) && <IconCheck />}</div>
            </div>
          ))
        }
      </div>
    )
  }

  private renderMainContent = (): ReactNode => {
    const { isLoading } = this.state
    return isLoading ? this.renderLoading() : this.renderSwitchLists()
  }

  private renderFooter = (): ReactNode => {
    const { intl } = this.props
    return (
      <div className={wishlist.applyButton}>
        <Button vatiation="primary" block>
          {translate("wishlist-apply", intl)}
        </Button>
      </div>
    )
  }

  public render(): ReactNode {
    return (
      <div className="w-100 bg-black fixed bottom-0 z-max bg-base">
        {this.renderHeader()}
        {this.renderMainContent()}
        {this.renderFooter()}
      </div>
    )
  }
}

export default withApollo<ListMenuContentProps, {}>(injectIntl(ListMenuContent))