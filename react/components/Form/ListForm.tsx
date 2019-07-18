import React, { Component, FormEvent, Fragment, ReactNode } from 'react'
import {
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
  defineMessages,
} from 'react-intl'
import { Button, Input, Toggle } from 'vtex.styleguide'

import styles from '../../wishList.css'

const LIST_NAME_MINIMUM_LENGTH = 1
const messages = defineMessages({
  listNamePlaceholder: {
    defaultMessage: '',
    id: 'store/wishlist-list-name-placeholder',
  },
  listNameLabel: {
    defaultMessage: '',
    id: 'store/wishlist-list-name-label',
  },
  isPublic: {
    defaultMessage: '',
    id: 'store/wishlist-is-public',
  },
  isPublicHint: {
    defaultMessage: '',
    id: 'store/wishlist-is-public-hint',
  },
})

interface ListFormProps extends InjectedIntlProps {
  buttonLabel: string
  onSubmit: (listData: List) => void
  list?: List
  isLoading?: boolean
}

interface ListFormState {
  listData: List
  isLoading?: boolean
  isValid?: boolean
  isChanged?: boolean
}

class ListForm extends Component<ListFormProps, ListFormState> {
  public state: ListFormState = {
    listData: {},
  }

  public componentDidMount(): void {
    const { list } = this.props
    if (list) {
      this.setState({ listData: list })
    }
  }

  public render(): ReactNode {
    const { intl, onSubmit, isLoading, buttonLabel } = this.props
    const {
      isValid,
      isChanged,
      listData: { name, isPublic },
      listData,
    } = this.state
    return (
      <Fragment>
        <div className={`${styles.form} w-100 gray f5 pv5 ph5`}>
          <div className={`${styles.nameInputContainer} tl`}>
            <Input
              autoFocus
              value={name || ''}
              placeholder={intl.formatMessage(messages.listNamePlaceholder)}
              label={intl.formatMessage(messages.listNameLabel)}
              onChange={this.handleChangeName}
            />
          </div>
          <div
            className={`${
              styles.isPublicContainer
            } flex flex-row justify-between tl mt5`}
          >
            <div className="flex flex-column">
              <span className={`${styles.isPublicLabel} c-on-base mt1 t-small`}>
                <FormattedMessage {...messages.isPublic} />
              </span>
              <span className={`${styles.isPublicHint} light-gray mt3`}>
                <FormattedMessage {...messages.isPublicHint} />
              </span>
            </div>
            <Toggle
              size="regular"
              checked={!isPublic}
              onChange={this.handleChangePublic}
            />
          </div>
        </div>
        <div
          className={`${
            styles.createListButtonContainer
          } flex flex-row justify-center pb5`}
        >
          <Button
            variation="primary"
            size="small"
            disabled={!isValid || !isChanged}
            isLoading={isLoading}
            onClick={() => onSubmit(listData)}
          >
            {buttonLabel}
          </Button>
        </div>
      </Fragment>
    )
  }

  private handleChangeName = (event: FormEvent<HTMLInputElement>): void => {
    const { listData } = this.state
    const { list } = this.props
    const target = event.target as HTMLInputElement
    const name = target.value
    this.setState({
      isChanged: !list || list.name !== name,
      isValid: this.isNameValid(name),
      listData: { isPublic: listData.isPublic, name },
    })
  }

  private handleChangePublic = (): void => {
    const { isPublic, name } = this.state.listData
    const { list } = this.props
    this.setState({
      isChanged: !list || list.isPublic !== !isPublic,
      isValid: this.isNameValid(name),
      listData: { ...this.state.listData, isPublic: !isPublic },
    })
  }

  private isNameValid = (name?: string): boolean => {
    return name !== undefined && name.length >= LIST_NAME_MINIMUM_LENGTH
  }
}

export default injectIntl(ListForm)
