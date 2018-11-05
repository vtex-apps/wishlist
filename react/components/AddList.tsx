import React, { Component, Fragment, ReactNode, FormEvent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { graphql, ChildProps, MutationFn, compose } from 'react-apollo'
import { IconCaretLeft, Input, Button, Toggle } from 'vtex.styleguide'
import createList from '../graphql/mutations/createList.gql'

interface Result {
  createList: {
    list: {
      name: string
      isPublic: boolean
    }
  }
}

interface AddListProps {
  onFinishAdding: () => void
  intl: any
}

interface AddListState {
  listData: {
    name: string
    isPublic: boolean
  }
  isLoading: boolean
  isValid: boolean
}

type Props = ChildProps<AddListProps, Result>

/**
 * Wishlist element to add product to a list
 */
class AddList extends Component<Props, AddListState> {
  public state: AddListState = {
    listData: {
      name: '',
      isPublic: true
    },
    isLoading: false,
    isValid: false
  }

  public onSubmit = async (): Promise<any> => {
    this.setState({ isLoading: true })
    const { listData } = this.state 
    const response: any = await this.props.mutate({variables: { ...listData}})
    this.setState({ isLoading: true })
    this.props.onFinishAdding()
  }

  public onChangeName = (event: FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement
    const name = target.value
    this.setState(
      { listData: { ...this.state.listData, name } },
      this.checkValidity
    )
  }

  public onChangePublic = (): void => {
    const { isPublic } = this.state.listData
    this.setState(
      {
        listData: { ...this.state.listData, isPublic: !isPublic }
      },
      this.checkValidity
    )
  }

  public checkValidity = (): void => {
    const { name } = this.state.listData
    this.setState({ isValid: (name && name.length > 6) || false })
  }

  public translateMessage = (id: string): string =>
    this.props.intl.formatMessage({ id: id })

  public static proptypes = {
    onFinishAdding: PropTypes.func.isRequired,
    intl: PropTypes.object
  }

  public render() {
    const { onFinishAdding } = this.props

    const { isLoading, isValid } = this.state

    const { name, isPublic } = this.state.listData

    return (
      <Fragment>
        <div className="w-100 bb pv3 ttu dark-gray tc b--light-gray">
          <div className="pointer h3 absolute nt1 ml3" onClick={onFinishAdding}>
            <IconCaretLeft size={17} />
          </div>
          <FormattedMessage id="wishlist-new" />
        </div>
        <div className="w-100 gray f5 pv5 pa4">
          <div className="tl">
            <Input
              value={name}
              placeholder={this.translateMessage(
                'wishlist-list-name-placeholder'
              )}
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
      </Fragment>
    )
  }
}

export default injectIntl(graphql<Props, any, any, Props>(createList)(AddList))