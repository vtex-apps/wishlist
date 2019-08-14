import React, { Component, Fragment, ReactNode } from 'react'
import { withRuntimeContext, withSession } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import { concat, filter, findIndex, update } from 'ramda'
import { compose, withApollo, WithApolloClient, graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { session } from 'vtex.store-resources/Queries'
import { getProfile } from '../../utils/profile'
import { createList, getListsByOwner } from '../../GraphqlClient'

import Content from './Content'
import ListSelector from './ListSelector'
import Lists from '../Lists'

import styles from '../../wishList.css'
import { isMobile } from 'react-device-detect'

import withContext from '../../withContext'

const ON_LISTS_PAGE_CLASS = 'vtex-lists-page'
const messages = defineMessages({
  listNameDefault: {
    defaultMessage: '',
    id: 'store/wishlist-default-list-name',
  },
  title: {
    id: 'admin/editor.wishlist.title',
    defaultMessage: '',
  },
})

interface ListsPageState {
  lists: any
  selectedListId?: string
  isLoading?: boolean
}

interface ListsPageProps
  extends InjectedIntlProps,
    WithApolloClient<{}>,
    ContextProps {
  runtime: Runtime
  session: Session
}

class ListsPage extends Component<ListsPageProps, ListsPageState> {
  public state: ListsPageState = {
    isLoading: true,
    lists: [],
  }

  public componentWillUnmount(): void {
    document.body.classList.remove(ON_LISTS_PAGE_CLASS)
  }

  public componentDidUpdate(prevProps: ListsPageProps): void {
    const {
      runtime: { query },
      client,
      session,
    } = this.props
    // Verify if the selected list changed by checking the location query
    if (
      client &&
      prevProps.runtime.query &&
      prevProps.runtime.query.listId !== this.state.selectedListId
    ) {
      this.setState({ selectedListId: query.listId })
    }
    // Verify if the session is loaded, so it can fetch the user's lists
    else if (
      session !== prevProps.session &&
      prevProps.session &&
      !prevProps.session.loading
    ) {
      this.fetchLists(prevProps)
    }
  }

  public componentDidMount(): void {
    document.body.classList.add(ON_LISTS_PAGE_CLASS)
    this.fetchLists(this.props)
  }

  public render(): ReactNode {
    const {
      session,
      runtime: { goBack },
    } = this.props

    const profile = getProfile(session)

    if (!session || session.loading) {
      return null
    }

    if (session && !session.loading && !profile) {
      this.toLogin()
    }

    const { selectedListId: id, lists, isLoading } = this.state
    const selectedListId = id || (lists.length > 0 && lists[0].id)

    return isMobile ? (
      lists.length ? (
        <Lists
          {...this.props}
          loading={!session || session.loading || isLoading}
          lists={lists}
          onClose={goBack}
        />
      ) : null
    ) : (
      <div className={`${styles.listPage} flex flex-row mt6 ph10 pv8 h-100`}>
        {isLoading ? (
          <div className="flex justify-center w-100">
            <Spinner />
          </div>
        ) : (
          <Fragment>
            <div className="h-100 mr6">
              <ListSelector
                {...this.state}
                selectedListId={selectedListId}
                onListCreated={this.handleListCreated}
              />
            </div>
            <div className="w-100">
              <Content
                listId={selectedListId}
                lists={lists}
                onListUpdated={this.handleListUpdated}
                onListDeleted={this.handleListDeleted}
              />
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  private handleListCreated = (list: List): void => {
    const { lists } = this.state
    this.setState({ lists: concat(lists, [list]) })
  }

  private handleListUpdated = (listUpdated: List): void => {
    const { lists } = this.state
    const index = findIndex((list: List) => list.id === listUpdated.id, lists)
    this.setState({
      lists: update(index, listUpdated, lists),
    })
  }

  private handleListDeleted = (): void => {
    const { lists, selectedListId } = this.state
    const {
      runtime: { navigate },
    } = this.props
    const listsUpdate = filter((list: List) => list !== selectedListId, lists)
    this.setState({ lists: listsUpdate })
    navigate({
      page: 'store.lists',
      query: `listId=${lists[0].id}`,
    })
  }

  private fetchLists = async (props: ListsPageProps): Promise<void> => {
    const {
      client,
      runtime: { query },
      intl,
      session,
    } = props
    const profile = getProfile(session)

    if (session && !session.loading && profile && profile.email) {
      const {
        data: { listsByOwner: lists },
      } = await getListsByOwner(client, profile.email)

      if (lists) {
        if (lists.length == 0) {
          const {
            data: { createList: defaultList },
          } = await createList(client, {
            isEditable: false,
            items: [],
            owner: profile.email,
            name: intl.formatMessage(messages.listNameDefault),
          })
          this.setState({
            lists: [defaultList],
            selectedListId: defaultList ? defaultList.id : '',
          })
        } else {
          const selectedListId = query ? query.listId : lists[0].id
          this.setState({ lists, selectedListId })
        }
      }
      this.setState({ isLoading: false })
    }
  }

  private toLogin = (): void => {
    this.props.runtime.navigate({
      page: 'store.login',
      fallbackToWindowLocation: true,
    })
  }
}

const options = {
  name: 'session',
  options: () => ({ ssr: false }),
}

export default withContext(
  withSession()(
    compose(
      injectIntl,
      withRuntimeContext,
      withApollo,
      graphql(session, options)
    )(ListsPage)
  )
)
