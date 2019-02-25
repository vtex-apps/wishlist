import React, { Component, ReactNode, Fragment } from 'react'
// import { ExtensionPoint } from 'vtex.render-runtime'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { map, path } from 'ramda'
// import { Button, Spinner } from 'vtex.styleguide'
// import ProductPrice from 'vtex.store-components/ProductPrice'
import { orderFormConsumer } from 'vtex.store-resources/OrderFormContext'
import Header from '../Header'
import renderLoading from '../Loading'

import { getListDetailed } from '../../GraphqlClient'

interface ListDetailState {
  list?: any
  isLoading: boolean
  isAddingToCart?: boolean
}

interface ListDetailProps {
  listId: string
  onClose: () => void
  client?: ApolloClient<any>
  orderFormContext?: any
  intl?: intlShape
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  state: ListDetailState = {
    isLoading: true
  }

  public componentDidMount(): void {
    const { listId, client } = this.props
    client && getListDetailed(client, listId)
      .then(response => {
        console.log('list with details', response)
        this.setState({ list: response.data.list, isLoading: false })
      })
      .catch(err => console.error('Something went wrong', err))
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

  private renderContent = (): ReactNode => {
    const { list: { items } } = this.state
    console.log(items)
    return (
      <div>oi</div>
    )
  }

  public render(): ReactNode {
    const { isLoading, list } = this.state
    const { onClose } = this.props
    return (
      <div className="vh-100">
        <Header title={list ? list.name : 'List details'} onClose={onClose} />
        {isLoading ? renderLoading() : this.renderContent()}
      </div>
    )

    // const { name, items } = list

    // const totalPrice = items
    //   .map(({ product: { items: [item] } }) => {
    //     const {
    //       sellers: [
    //         {
    //           commertialOffer: { Price },
    //         },
    //       ],
    //     } = item
    //     return Price
    //   })
    //   .reduce((a, b) => a + b, 0)

    // return (
    //   <div className="w-100">
    //     <div className="w-100 tc ttu f4 pv4 bb c-muted-1 b--muted-2">
    //       {name}
    //     </div>
    //     {items
    //       .map(this.createProductShapeFromItem)
    //       .map((product: any, i: any) => (
    //         <Fragment key={i}>
    //           <ExtensionPoint
    //             id="product-sumary"
    //             product={product}
    //             name={product.productName}
    //             showBorders
    //             displayMode="inline"
    //             showListPrice={false}
    //             showBadge={false}
    //             showInstallments={false}
    //             showLabels={false}
    //           />
    //         </Fragment>
    //       ))}
    //     <div>
    //       <div className="flex justify-between items-center ph3">
    //         <div className="c-muted-1">
    //           Total:{' '}
    //           {
    //             <ProductPrice
    //               sellingPrice={totalPrice}
    //               listPrice={totalPrice}
    //               showLabels={false}
    //               showListPrice={false}
    //             />
    //           }
    //         </div>
    //         <div>
    //           <Button
    //             variation="primary"
    //             size="small"
    //             onClick={this.addItensToCart}
    //             disabled={isAddingToCart}
    //           >
    //             <FormattedMessage id="wishlist-buy-all" />
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // )
  }
}

export default withApollo<ListDetailProps, {}>(orderFormConsumer(injectIntl(ListDetail)))
