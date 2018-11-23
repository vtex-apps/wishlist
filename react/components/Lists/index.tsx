import React, { Component, ReactNode } from 'react'
import ListItem from './ListItem'
import { WISHLIST_STORAKE_KEY } from '../../'
import withUserLists from './../withUserLists'

interface ListsStates {
  listSelected: null
}

interface ListsProps {
  lists: any[]
  loadingLists: boolean
}

class Lists extends Component<ListsProps, ListsStates> {
  render = (): ReactNode => {
    const { loadingLists, lists = [] } = this.props
    return (
      <div className="w-100">
        <div className="w-100 tc ttu f4 pv4 bb c-muted-1 b--muted-2">
          Minhas Listas
        </div>
        <ListItem key={'as'} name={'lucis'} onClick={() => {}} isPublic />
        {loadingLists && 'Carregando...'}
        {/* {!loadingLists &&
          lists.map(({ name, id }, key) => (
            <ListItem key={key} name={name} onClick={() => {}} isPublic />
          ))} */}
      </div>
    )
  }
}
// export default withUserLists(Lists)
export default Lists

