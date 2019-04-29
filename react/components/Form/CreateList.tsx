import React, { Component } from 'react'

import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { createList, saveListIdInLocalStorage } from '../../GraphqlClient'
import Header from '../Header'
import FormView from './FormView'
import ListForm from './ListForm'

import styles from '../../wishList.css'

interface CreateListProps extends InjectedIntlProps, WithApolloClient<any> {
  onFinishAdding: (list: List) => void
  onClose: () => void
}

interface CreateListState {
  isLoading?: boolean
}

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
            title={intl.formatMessage({ id: 'wishlist-new' })}
            onClose={onClose}
            showIconBack
          />
          <ListForm
            buttonLabel={intl.formatMessage({ id: 'wishlist-add-button' })}
            onSubmit={this.onSubmit}
            isLoading={isLoading}
          />
        </div>
      </FormView>
    )
  }

  private onSubmit = (listData: List): void => {
    const { client } = this.props
    this.setState({ isLoading: true })
    createList(client, { ...listData, items: [], isEditable: true })
      .then(response => {
        this.props.onFinishAdding(response.data.createList)
        saveListIdInLocalStorage(response.data.createList.id)
        if (this.isComponentMounted) {
          this.setState({ isLoading: false })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

}

export default compose(
  injectIntl,
  withApollo
)(CreateList)
