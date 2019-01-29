import React, { Component, ReactNode, Fragment } from 'react'
import { withRuntimeContext, ExtensionPoint } from 'vtex.render-runtime'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage } from 'react-intl'
import { head, map, path, pick, prop } from 'ramda'
import { Button, Spinner } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'
import {
  orderFormConsumer,
  contextPropTypes,
} from 'vtex.store-resources/OrderFormContext'

import getListDetails from '../../graphql/queries/getListDetails.gql'

interface ListDetailState {
  list: any
  loading: boolean
  isAddingToCart: boolean
}

interface ListDetailProps {
  client: ApolloClient<any>
  runtime: any
  orderFormContext: any
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  state: ListDetailState = {
    loading: true,
    list: null,
    isAddingToCart: false,
  }

  public async componentDidMount() {
    const {
      runtime: {
        route: {
          params: { listId },
        },
      },
      client,
    } = this.props
    const list = await client
      .query({
        query: getListDetails,
        variables: {
          id: listId,
        },
      })
      .then(({ data: { list } }) => list)
    this.setState({ list, loading: false })
  }

  public createProductShapeFromItem = ({
    product: { productName, linkText, items },
  }: any) => {
    const sku = items[0]
    return {
      linkText,
      productName,
      sku: {
        image: sku.images[0],
        itemId: sku.itemId,
        name: sku.name,
        seller: sku.sellers[0],
      },
    }
  }

  createItemShapeFromItem = ({ product: { items } }: any) => {
    const sku = items[0]
    return {
      quantity: 1,
      seller: Number(sku.sellers[0].sellerId),
      id: Number(sku.itemId),
    }
  }

  public addItensToCart = () => {
    const { orderFormContext } = this.props

    const {
      list: { items },
    } = this.state

    const minicartButton = document.querySelector('.vtex-minicart .vtex-button')

    this.setState({ isAddingToCart: true })
    orderFormContext
      .addItem({
        variables: {
          orderFormId: path(['orderForm', 'orderFormId'], orderFormContext),
          items: map(this.createItemShapeFromItem, items),
        },
      })
      .then(() => {
        this.setState({ isAddingToCart: false })
        orderFormContext
          .refetch()
          .then(() => minicartButton && (minicartButton as any).click())
      })
  }

  render = (): ReactNode => {
    const { loading, list, isAddingToCart } = this.state

    if (loading) {
      return (
        <div className="flex justify-center pt4">
          <span className="dib c-muted-1">
            <Spinner color="currentColor" size={20} />
          </span>
        </div>
      )
    }

    const { name, items } = list

    console.log('Items of list', items)

    const totalPrice = items
      .map(({ product: { items: [item] } }) => {
        const {
          sellers: [
            {
              commertialOffer: { Price },
            },
          ],
        } = item
        return Price
      })
      .reduce((a, b) => a + b, 0)

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
              />
            </Fragment>
          ))}
        <div>
          <div className="flex justify-between items-center ph3">
            <div className="c-muted-1">
              Total:{' '}
              {
                <ProductPrice
                  sellingPrice={totalPrice}
                  listPrice={totalPrice}
                  showLabels={false}
                  showListPrice={false}
                />
              }
            </div>
            <div>
              <Button
                variation="primary"
                size="small"
                onClick={this.addItensToCart}
                disabled={isAddingToCart}
              >
                <FormattedMessage id="wishlist-buy-all" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default orderFormConsumer(
  withRuntimeContext(withApollo<ListDetailProps, {}>(ListDetail))
)
