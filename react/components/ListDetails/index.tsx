import React, { Component, ReactNode, Fragment } from 'react'
import { withRuntimeContext, ExtensionPoint } from 'render'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage } from 'react-intl'
import getListDetails from '../../graphql/queries/getListDetails.gql'

interface ListDetailState {
  list: any
  loading: boolean
}

interface ListDetailProps {
  client: ApolloClient<any>
  runtime: any
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  state: ListDetailState = {
    loading: true,
    list: null
  }

  public async componentDidMount() {
    const {
      runtime: {
        route: {
          params: { listId }
        }
      },
      client
    } = this.props
    const list = await client
      .query({
        query: getListDetails,
        variables: {
          id: listId
        }
      })
      .then(({ data: { list } }) => list)
    this.setState({ list, loading: false })
  }

  createProductShapeFromItem = ({ product: {
    productName,
    linkText,
    items
  }}: any) => {
    console.log('name =>', productName)
    console.log('sku =>', items)
    const sku = items[0]
    return {
      productName,
      linkText,
      sku: {
        seller: sku.sellers[0],
        name: sku.name,
        itemId: sku.itemId,
        image: sku.images[0]
      }
    }
  }

  render = (): ReactNode => {
    const {
      loading,
      list
    } = this.state

    if (loading) return 'Carregando...'

    const { name, items } = list

    return (
      <div className="w-100">
        <div className="w-100 tc ttu f4 pv4 bb c-muted-1 b--muted-2">
          {name}
        </div>
        {items
          .map(this.createProductShapeFromItem)
          .map((product: any, i: any) => (
            <Fragment key={i}>
              <ExtensionPoint
                id="product-sumary"
                product={product}
                name={product.productName}
                showBorders
                displayMode="inline"
                showListPrice={false}
                showBadge={false}
                showInstallments={false}
                showLabels={false}
                actionOnClick={() => console.log('clicou')}
              />
            </Fragment>
          ))}
      </div>
    )
  }
}

export default withRuntimeContext(withApollo<ListDetailProps, {}>(ListDetail))
