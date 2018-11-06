import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Spinner, IconVisibilityOn, IconPlusLines } from 'vtex.styleguide'

import { WISHLIST_STORAKE_KEY } from '../'

interface AddToListProps {
  onAddList: () => void
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
    loading: false,
    loadedLists: [{ name: 'Viagem pra Parari', loading: false }]
  }

  public static proptypes = {
    onAddList: PropTypes.func.isRequired
  }

  public async componentDidMount() {
    // const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY)
    // if (!listsRefs) {
    //   return this.setState({loading: false})
    // }
    // const lists = await Promise.all(listsRefs.split(',').map((id: string) => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve({name: 'Lista bonita'})
    //     }, 2000)
    //   })
    // }))
    // this.setState({loadedLists: lists, loading: false})
  }

  public setListLoading = (listIndex: number, value: boolean): void => {
    const { loadedLists } = this.state
    const refreshedLists = [...loadedLists]
    refreshedLists[listIndex].loading = value
    this.setState({loadedLists: refreshedLists})
  }

  public addItemToList = (listIndex: number): void => {
    // do some async things here and whatnot...
    this.setListLoading(listIndex, true)
  }

  public renderItems = (): ReactNode => {
    const { loadedLists: lists } = this.state
    console.log(lists)
    if (!lists || !lists.length) return null
    return lists.map(
      ({ loading, name}, i): ReactNode => (
        <Fragment key={i}>
          <div className="flex flex-row justify-between w-100 h2 mv2 hover" onClick={() => this.addItemToList(i)} >
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

export default AddToList
