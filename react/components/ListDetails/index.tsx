import React, { Component, Fragment, ReactNode } from 'react'
import { ActionMenu, IconOptionsDots } from 'vtex.styleguide'
import {
  compose,
  graphql,
  WithApolloClient,
  withApollo,
  ChildDataProps,
} from 'react-apollo'
import { append, filter, map } from 'ramda'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'

import { deleteList, updateList } from '../../GraphqlClient'
import DialogMessage from '../Dialog/DialogMessage'
import UpdateList from '../Form/UpdateList'
import Header from '../Header'
import renderLoading from '../Loading'
import Content from './Content'
import Footer from './Footer'

import LIST_DETAILS_QUERY from '../../graphql/queries/getListDetails.gql'
import Loading from '../Loading'
import withSettings from '../../withSettings'

interface ListDetailState {
  isAddingToCart?: boolean
  selectedItems: ListItemWithProduct[]
  showDeleteConfirmation?: boolean
  showUpdateList?: boolean
}

interface ListDetailProps
  extends InjectedIntlProps,
    WithApolloClient<{}>,
    ChildDataProps<{}, { list: List }, {}>,
    SettingsProps {
  listId: string
  onClose: (lists?: List[]) => void
  onDeleted?: (id: string) => void
  runtime: Runtime
}

const messages = defineMessages({
  optionConfiguration: {
    defaultMessage: '',
    id: 'store/wishlist-option-configuration',
  },
  optionDelete: {
    defaultMessage: '',
    id: 'store/wishlist-option-delete',
  },
  messageDeleteConfirmation: {
    defaultMessage: '',
    id: 'store/wishlist-delete-confirmation-message',
  },
  defaultListName: {
    id: 'store/wishlist-default-list-name',
    defaultMessage: '',
  },
})

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  public state: ListDetailState = {
    selectedItems: [],
  }

  public render(): ReactNode {
    const { showDeleteConfirmation, showUpdateList } = this.state
    const {
      intl,
      listId,
      data: { loading, list },
    } = this.props

    return list ? (
      <div className="fixed top-0 left-0 vw-100 vh-100 flex flex-column z-4 bg-base">
        {loading ? renderLoading() : this.renderContent()}
        {showDeleteConfirmation && (
          <DialogMessage
            message={intl.formatMessage(messages.messageDeleteConfirmation, {
              listName: list.name,
            })}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            onSuccess={this.handleDeleteList}
          />
        )}
        {showUpdateList && (
          <div className="fixed top-0 left-0 w-100 bg-base">
            <UpdateList
              onClose={() => this.setState({ showUpdateList: false })}
              list={{ ...list, id: listId }}
              onFinishUpdate={this.handleFinishUpdate}
            />
          </div>
        )}
      </div>
    ) : null
  }

  private renderContent = (): ReactNode => {
    const { selectedItems } = this.state
    const {
      data: { loading, list },
      onClose,
      intl: { formatMessage },
      settings: { appSettings },
    } = this.props
    const options = [
      {
        onClick: () => this.setState({ showUpdateList: true }),
        label: this.props.intl.formatMessage(messages.optionConfiguration),
      },
      {
        onClick: () => this.setState({ showDeleteConfirmation: true }),
        label: this.props.intl.formatMessage(messages.optionDelete),
      },
    ]

    if (loading || !list) {
      return <Loading />
    }
    const { isEditable, name } = list

    const title = !isEditable
      ? (appSettings && appSettings.defaultListName) ||
        formatMessage(messages.defaultListName)
      : name

    return (
      <Fragment>
        <Header
          title={title}
          onClose={this.handleOnClose}
          showIconBack={!!onClose}
        >
          {!loading && list.isEditable && (
            <ActionMenu
              options={options}
              hideCaretIcon
              buttonProps={{
                variation: 'tertiary',
                size: 'small',
                icon: <IconOptionsDots size={20} />,
              }}
            />
          )}
        </Header>
        <Content
          items={list.items}
          onItemSelect={this.handleItemSelectedChange}
          onItemRemove={this.handleItemRemove}
        />
        {selectedItems.length > 0 && <Footer items={selectedItems} />}
      </Fragment>
    )
  }

  private handleItemSelectedChange = (
    itemId: string,
    product: {},
    isSelected: boolean
  ) => {
    const { selectedItems } = this.state
    if (isSelected) {
      this.setState({
        selectedItems: append({ itemId, product }, selectedItems),
      })
    } else {
      this.setState({
        selectedItems: filter(({ itemId: id }) => id !== itemId, selectedItems),
      })
    }
  }

  private itemWithoutProduct = ({
    id,
    productId,
    skuId,
    quantity,
  }: ListItem): ListItem => ({ id, productId, skuId, quantity })

  private handleItemRemove = async (itemId: string): Promise<void> => {
    const {
      client,
      listId,
      data: { list, refetch },
    } = this.props
    const { selectedItems } = this.state
    if (list) {
      const listUpdated = {
        ...list,
        items: filter(({ id }: ListItem) => id !== itemId, list.items || []),
      }
      const itemsUpdated = map(
        item => this.itemWithoutProduct(item),
        listUpdated.items
      )

      await updateList(client, listId, { ...list, items: itemsUpdated })
      refetch({ id: listId })
      this.setState({
        selectedItems: filter(({ itemId: id }) => id !== itemId, selectedItems),
      })
    }
  }

  private handleFinishUpdate = (): void => {
    this.setState({ showUpdateList: false })
  }

  private handleOnClose = (): void => {
    const {
      onClose,
      data: { list },
      runtime: { goBack },
    } = this.props
    if (!onClose) {
      goBack()
    } else if (list) {
      const currentList: List = {
        ...list,
        items: map(item => this.itemWithoutProduct(item), list.items || []),
      }
      onClose([currentList])
    }
  }

  private handleDeleteList = (): void => {
    const { client, listId, onDeleted, onClose } = this.props
    deleteList(client, listId)
      .then(() => {
        if (onDeleted) {
          onDeleted(listId)
        }
        onClose()
      })
      .catch(error => console.error(error))
  }
}

const withQuery = graphql(LIST_DETAILS_QUERY, {
  options: (props: ListDetailProps) => ({
    fetchPolicy: 'network-only',
    variables: {
      id: props.listId,
    },
  }),
})

export default compose(
  withApollo,
  withQuery,
  withSettings,
  injectIntl,
  withRuntimeContext
)(ListDetail)
