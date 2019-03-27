import React, { Component, FormEvent, Fragment, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { Button, Input, Toggle } from 'vtex.styleguide'

const LIST_NAME_MINIMUM_LENGTH = 1

interface ListFormProps {
  buttonLabel: string
  onSubmit: (listData: List) => void
  list?: List
  isLoading?: boolean
  intl?: IntlShape
}

interface ListFormState {
  listData: List
  isLoading?: boolean
  isValid?: boolean
  isChanged?: boolean
}

class ListForm extends Component<ListFormProps & InjectedIntlProps, ListFormState> {
  public state: ListFormState = {
    listData: {},
  }
  private __isMounted: boolean = false

  public componentDidMount(): void {
    const { list } = this.props
    this.__isMounted = true
    if (list) {
      this.setState({ listData: list })
    }
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }

  public render(): ReactNode {
    const { intl, onSubmit, isLoading, buttonLabel } = this.props
    const { isValid, isChanged, listData: { name, isPublic }, listData } = this.state
    return (
      <Fragment>
        <div className="w-100 gray f5 pv5 ph5">
          <div className="tl">
            <Input
              value={name}
              placeholder={intl.formatMessage({ id: "wishlist-list-name-placeholder" })}
              label={intl.formatMessage({ id: "wishlist-list-name-label" })}
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
              size="regular"
              checked={!isPublic}
              onChange={this.onChangePublic}
            />
          </div>
        </div>
        <div className="flex flex-row justify-center pb3">
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

  private onChangeName = (event: FormEvent<HTMLInputElement>): void => {
    const { listData } = this.state
    const { list } = this.props
    const target = event.target as HTMLInputElement
    const name = target.value
    this.__isMounted && this.setState({
      isChanged: !list || (list.name !== name),
      isValid: this.isNameValid(name),
      listData: { isPublic: listData.isPublic, name },
    })
  }

  private onChangePublic = (): void => {
    const { isPublic, name } = this.state.listData
    const { list } = this.props
    this.__isMounted && this.setState(
      {
        isChanged: !list || (list.isPublic !== !isPublic),
        isValid: this.isNameValid(name),
        listData: { ...this.state.listData, isPublic: !isPublic },
      }
    )
  }

  private isNameValid = (name: string | undefined): any => {
    return (name && name.length >= LIST_NAME_MINIMUM_LENGTH)
  }

}

export default injectIntl(ListForm)