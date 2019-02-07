import React, { Component, Fragment, ReactNode, FormEvent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { IconClose, Input, Button, Toggle } from 'vtex.styleguide'
import { createList, saveListIdInLocalStorage } from '../GraphqlClient'

const LIST_NAME_MINIMUM_LENGTH = 6

interface CreateListProps {
  onFinishAdding: (list: any) => void
  onClose: () => void
  intl?: any
  client?: ApolloClient<any>
}

interface CreateListState {
  listData: {
    name?: string
    isPublic?: boolean
  }
  isLoading: boolean
  isValid: boolean
}

/**
 * Wishlist element to add product to a list
 */
class CreateList extends Component<CreateListProps, CreateListState> {
  public state: CreateListState = {
    listData: {},
    isLoading: false,
    isValid: false
  }

  public onSubmit = (): void => {
    this.setState({ isLoading: true })
    const { client } = this.props
    const { listData } = this.state
    client && createList(client, { ...listData, items: [] })
      .then(response => {
        this.setState({ isLoading: false })
        this.props.onFinishAdding(response.data.createList)
      })
      .catch(err => {
        console.log('something went wrong', err)
      })
  }

  public onChangeName = (event: FormEvent<HTMLInputElement>): void => {
    const { listData } = this.state
    const target = event.target as HTMLInputElement
    const name = target.value
    this.setState({
      listData: { isPublic: listData.isPublic, name },
      isValid: this.isNameValid(name)
    })
  }

  public onChangePublic = (): void => {
    const { isPublic } = this.state.listData
    this.setState(
      {
        listData: { ...this.state.listData, isPublic: !isPublic }
      }
    )
  }

  public isNameValid = (name: string): boolean => {
    return (name !== 'undefined' && name.length >= LIST_NAME_MINIMUM_LENGTH)
  }

  public translateMessage = (id: string): string =>
    this.props.intl.formatMessage({ id: id })

  public static proptypes = {
    onFinishAdding: PropTypes.func.isRequired,
    intl: PropTypes.object
  }

  public render() {
    const { onClose } = this.props
    const { isLoading, isValid, listData: { name, isPublic } } = this.state

    return (
      <div className="vh-100">
        <div className="w-100 bb pv3 ttu dark-gray tc b--light-gray">
          <div className="pointer h3 absolute nt1 ml3" onClick={onClose}>
            <IconClose size={17} />
          </div>
          <FormattedMessage id="wishlist-new" />
        </div>
        <div className="w-100 gray f5 pv5 pa4">
          <div className="tl">
            <Input
              value={name}
              placeholder={this.translateMessage('wishlist-list-name-placeholder')}
              label={this.translateMessage('wishlist-list-name-label')}
              onChange={this.onChangeName}
            />
          </div>
          <div className="flex flex-row justify-between tl mt5">
            <div className="flex flex-column">
              <span className="gray mt2">
                <FormattedMessage id="wishlist-is-public" />
              </span>
              <span className="light-gray">
                <FormattedMessage id="wishlist-is-public-hint" />
              </span>
            </div>
            <Toggle
              size="small"
              checked={!isPublic}
              onChange={this.onChangePublic}
            />
          </div>
        </div>
        <div className="flex flex-row justify-center pb3">
          <Button
            variation="primary"
            size="small"
            disabled={!isValid}
            isLoading={isLoading}
            onClick={this.onSubmit}
          >
            <FormattedMessage id="wishlist-add-button" />
          </Button>
        </div>
      </div>
    )
  }
}

export default withApollo(injectIntl(CreateList))
