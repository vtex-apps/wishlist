import React, { ComponentType, Component, ReactNode, Children } from 'react'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import getList from '../graphql/queries/getList.gql'
import { WISHLIST_STORAKE_KEY } from '../'

interface WithUserListsProps {
  client: ApolloClient<any>
}

interface WithUserListsState {
  lists: any[]
  loading: boolean
}

const withUserListsProps = <P extends object>(
  WrappedComponent: ComponentType<P>
) =>
  class WithLists extends Component<
    P & WithUserListsProps,
    WithUserListsState
  > {
    state: WithUserListsState = {
      lists: null,
      loading: true
    }

    componentDidMount = async () => {
    //   const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY)
    //   if (!listsRefs) {
    //     return this.setState({ loading: false })
    //   }
    //   const { client } = this.props
    //   const lists = await Promise.all(
    //     listsRefs.split(',').map((id: string) => {
    //       return client
    //         .query({
    //           query: getList,
    //           variables: {
    //             id
    //           }
    //         })
    //         .then(({ data: { list } }) => ({ ...list, id, loading: false }))
    //     })
    //   )
    //   this.setState({ lists, loading: false })
    }

    render = () => {
        const { loading, lists } = this.state
        return <WrappedComponent {...this.props} loadingLists={loading} lists={lists} />
    }
  }

export default withApollo<WithUserListsProps, {any}>(withUserListsProps)
// export default withUserListsProps

