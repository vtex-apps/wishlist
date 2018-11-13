import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Spinner, IconVisibilityOn, IconPlusLines } from 'vtex.styleguide'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client';
import { WISHLIST_STORAKE_KEY } from '../'
import getList from '../graphql/queries/getList.gql'
import addToList from '../graphql/mutations/addToList.gql'

interface AddToListProps {
  onAddList: () => void,
  client: ApolloClient<any>,
  skuId?: string
  productId?: string
}

interface AddToListState {
  loading: boolean
  loadedLists: Array<any>
}

/**
 * Wishlist element to add a new list
 */
class AddToList extends Component<AddToListProps, AddToListState> {
  state = {
    loading: true,
    loadedLists: []
  }

  public static proptypes = {
    onAddList: PropTypes.func.isRequired
  }

  public async componentDidMount() {
    console.log(this.props)
    const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY)
    if (!listsRefs) {
      return this.setState({loading: false})
    }
    const { client } = this.props
    const lists = await Promise.all(listsRefs.split(',').map((id: string) => {
      return client.query({
        query: getList,
        variables: {
          id
        }
      }).then(({data: { list }})=> ({...list, id, loading: false}))
    }))
    this.setState({loadedLists: lists, loading: false})
  }

  public setListLoading = (listIndex: number, value: boolean): void => {
    const { loadedLists } = this.state
    const refreshedLists = [...loadedLists]
    refreshedLists[listIndex].loading = value
    this.setState({loadedLists: refreshedLists})
  }

  public addItemToList = async (listIndex: number): Promise<any> => {
    console.log(this.state.loadedLists)
    const { id: listId } = this.state.loadedLists[listIndex]
    const { client, skuId, productId, onAddList } = this.props  
    this.setListLoading(listIndex, true)
    await client.mutate({
      mutation: addToList,
      variables: {
        listId,
        productId,
        skuId,
        quantity: 1   
      }
    })
    this.setListLoading(listIndex, false)
    onAddList()
  }

  public renderItems = (): ReactNode => {
    const { loadedLists: lists } = this.state
    if (!lists || !lists.length) return null
    return lists.map(
      ({ loading, name}, i): ReactNode => (
        <Fragment key={i}>
          <div className="flex flex-row justify-between w-100 h2 mv2 pointer" onClick={() => this.addItemToList(i)} >
            <div className="w-10 pt2">
              <IconVisibilityOn size={15} />
            </div>
            <div className="w-80 tl ttu mt2">{name}</div>
            <div className="w-10 pt2 pointer">
              {loading && <Spinner color="currentColor" size={15} />}
              {!loading && <IconPlusLines size={15} />}
            </div>
          </div>
        </Fragment>
      )
    )
  }

  public render(): ReactNode {
    const { onAddList } = this.props
    const { loading, loadedLists } = this.state

    return (
      <Fragment>
        <div className="w-100 h2 bb pv3 ttu dark-gray b--light-gray">
          <FormattedMessage id="wishlist-add-to-list" />
        </div>
        {loading && (
          <span className="pv3 dib c-muted-1">
            <Spinner color="currentColor" size={20} />
          </span>
        )}
        {!loading &&
          !loadedLists.length && (
            <Fragment>
              <div className="w-100 gray f5 pv5">
                <FormattedMessage id="wishlist-no-lists" />
              </div>
            </Fragment>
          )}
        {!loading &&
          loadedLists.length && <Fragment>{this.renderItems()}</Fragment>}
        <div
          className="w-100 pv3 dark-gray bg-light-gray pointer"
          onClick={onAddList}
        >
          <FormattedMessage id="wishlist-new-button" />
        </div>
      </Fragment>
    )
  }
}

export default withApollo<AddToListProps, {}>(AddToList)
