import React, { Component, ReactNode, Fragment, FormEvent } from "react"
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Input, Button, Toggle } from 'vtex.styleguide'
import { translate } from '../utils/translate'

const LIST_NAME_MINIMUM_LENGTH = 1

interface ListFormProps {
  buttonLabel: string
  onSubmit: (listData: List) => void
  isLoading?: boolean
  intl?: intlShape
}

interface ListFormState {
  listData: List
  isLoading?: boolean
  isValid?: boolean
}

class ListForm extends Component<ListFormProps, ListFormState> {
  public state: ListFormState = {
    listData: {}
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

  public render(): ReactNode {
    const { intl, onSubmit, isLoading, buttonLabel } = this.props
    const { isValid, listData: { name, isPublic }, listData } = this.state
    return (
      <Fragment>
        <div className="w-100 gray f5 pv5 ph5">
          <div className="tl">
            <Input
              value={name}
              placeholder={translate('wishlist-list-name-placeholder', intl)}
              label={translate('wishlist-list-name-label', intl)}
              onChange={this.onChangeName}
            />
          </div>
          <div className="flex flex-row justify-between tl mt5">
            <div className="flex flex-column">
              <span className="c-on-base mt1 t-small">
                <FormattedMessage id="wishlist-is-public" />
              </span>
              <span className="light-gray mt3">
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
            onClick={() => onSubmit(listData)}
          >
            {buttonLabel}
          </Button>
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(ListForm)