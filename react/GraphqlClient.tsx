import createListMutation from './graphql/mutations/createList.gql'
import getListQuery from './graphql/queries/getList.gql'
import updateListMutation from './graphql/mutations/updateList.gql'
import { ApolloClient } from 'apollo-client'
import { append, map, path } from 'ramda'

const WISHLIST_STORAKE_KEY = 'vtexwishlists'

interface Product {
  id: string
  productId: string
  skuId: string
  quantity: number
}

const getListsIdFromCookies = () => {
  const lists = localStorage.getItem(WISHLIST_STORAKE_KEY)
  return lists && lists.split(',').map((id: string) => id.replace("\"", "").replace("\"", ""))
}

export const saveListIdInLocalStorage = (id: string): void => {
  const lists = localStorage.getItem(WISHLIST_STORAKE_KEY)
  let newLists = lists ? lists + ',' + id : id
  localStorage.setItem(WISHLIST_STORAKE_KEY, newLists)
}

export const ProductsToListItemInput = (items: any): any => (
  map((product: Product) => ({
    itemId: product.id,
    skuId: product.skuId,
    productId: product.productId,
    quantity: product.quantity
  }), items)
)

export const getList = (client: ApolloClient<any>, id: string): Promise<any> => {
  return client.query({
    query: getListQuery,
    variables: { id: id },
    fetchPolicy: 'network-only'
  })
}

export const updateList = (client: ApolloClient<any>, id: string, list: any): Promise<any> => {
  return client.mutate({
    mutation: updateListMutation,
    variables: { id: id, list: list }
  })
}

export const createList = (client: ApolloClient<any>, list: any): Promise<any> =>
  client.mutate({
    mutation: createListMutation,
    variables: {
      ...list
    }
  })

export const addProductToDefaultList = (listName: string, client: ApolloClient<any>, product: any) => {
  const listsId = getListsIdFromCookies()
  if (listsId && listsId.length) {
    return getList(client, listsId[0]).then((response: any) => {
      const list = response.data.list
      return updateList(
        client,
        listsId[0],
        { 
          name: list.name,
          items: append(product, ProductsToListItemInput(list.items)) }
      )
    })
  } else {
    return createList(client, {
      name: listName,
      items: [product]
    }).then((response: any) =>
      saveListIdInLocalStorage(path(['data', 'createList', 'id'], response) || '')
    )
  }
}

export const getListsFromLocaleStorage = (client: ApolloClient<any>): Promise<any> => {
  const listsId = getListsIdFromCookies() || []
  return Promise.all(
    map((id: string) => {
      return getList(client, id)
    }, listsId)
  )
}