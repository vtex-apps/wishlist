import React, { Component } from 'react'

import { isMobile } from 'react-device-detect'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'

import { createList } from '../../GraphqlClient'
import Header from '../Header'
import FormView from './FormView'
import ListForm from './ListForm'

import styles from '../../wishList.css'

interface CreateListProps extends InjectedIntlProps, WithApolloClient<{}> {
  onFinishAdding: (list: List) => void
  onClose: () => void
  runtime: Runtime
}

interface CreateListState {
  isLoading?: boolean
}

const messages = defineMessages({
  new: {
    defaultMessage: '',
    id: 'store/wishlist-new',
  },
  addButton: {
    defaultMessage: '',
    id: 'store/wishlist-add-button',
  },
})

class CreateList extends Component<CreateListProps, CreateListState> {
  public state: CreateListState = {}
  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render() {
    const { onClose, intl } = this.props
    const { isLoading } = this.state
    return (
      <FormView onClose={onClose}>
        <div className={`${styles.createList} bg-base h-100`}>
          <Header
            title={intl.formatMessage(messages.new)}
            onClose={onClose}
            showIconBack
          />
          <ListForm
            buttonLabel={intl.formatMessage(messages.addButton)}
            onSubmit={this.handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </FormView>
    )
  }

  private handleSubmit = (listData: List): void => {
    const { client } = this.props
    this.setState({ isLoading: true })
    createList(client, { ...listData, items: [], isEditable: true })
      .then((response: ResponseList) => {
        if (response.data.createList) {
          !isMobile && this.redirectToList(response.data.createList.id)
          this.props.onFinishAdding(response.data.createList)
        }
        if (this.isComponentMounted) {
          this.setState({ isLoading: false })
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  private redirectToList = (id: string | undefined): void => {
    const {
      runtime: { setQuery },
    } = this.props
    setQuery({ listId: id }, { merge: false, replace: true })
  }
}

export default compose(
  injectIntl,
  withApollo,
  withRuntimeContext
)(CreateList)
