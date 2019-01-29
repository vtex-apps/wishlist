import React, { Component, ReactNode, Fragment } from 'react'
import ListItem from './ListItem'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage } from 'react-intl'
import { Spinner, IconClose } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'
import getList from '../../graphql/queries/getList.gql'
import { WISHLIST_STORAKE_KEY } from '../../'
import ReactDOM from 'react-dom'

interface ListsStates {
  listSelected: null
  lists: any[]
  loading: boolean
  show: boolean
}

interface ListsProps {
  lists: any[]
  loadingLists: boolean
  client: ApolloClient<any>
  onClose: () => void
}

class Lists extends Component<ListsProps, ListsStates> {
  state: ListsStates = {
    lists: [],
    loading: true,
    listSelected: null,
    show: true,
  }

  public async componentDidMount() {
    const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY)
    if (!listsRefs) {
      this.setState({ loading: false })
    } else {
      const { client } = this.props
      const lists = await Promise.all(
        listsRefs.split(',').map((id: string) => {
          return client
            .query({
              query: getList,
              variables: { id: id.replace("\"", "").replace("\"", "") },
            })
            .then(({ data: { list } }) => ({ ...list, id, loading: false }))
            .catch(err => console.log('Error:', err))
        })
      )
      this.setState({ lists, loading: false })
    }
  }

  public goToListDetail = (id: string) => {
    this.setState({ show: false })
    const {
      runtime: { navigate },
    } = this.props
    navigate({ to: `/list/${id}` })
  }

  render = (): ReactNode => {
    const { loading, lists = [], show } = this.state
    const { onClose } = this.props
    if (!show) return null
    return (
      <aside>
        <div className="vw-100 vh-100 z-max fixed bg-white" style={{marginTop: "-56px"}}>
          <div className="w-100 tc ttu f4 pv4 bb c-muted-1 b--muted-2">
            <div className="pointer h3 absolute nt1 ml3" onClick={() => {this.setState({ show: false }); onClose()}}>
              <IconClose size={17} />
            </div>
            <FormattedMessage id="wishlist-my-lists" />
          </div>
          {loading && (
            <div className="flex justify-center pt4">
              <span className="dib c-muted-1">
                <Spinner color="currentColor" size={20} />
              </span>
            </div>
          )}
          {!loading &&
            lists.map(({ name, id, isPublic }, key) => (
              <ListItem
                key={key}
                name={name}
                onClick={() => {
                  this.goToListDetail(id)
                }}
                isPublic={isPublic}
              />
            ))}
          {!loading && !lists.length && (
            <div className="tc pv4 c-muted-2">
              <FormattedMessage id="wishlist-no-lists" />
            </div>
          )}
        </div>
      </aside>
    )
  }
}
export default withRuntimeContext(withApollo<ListsProps, {}>(Lists))
