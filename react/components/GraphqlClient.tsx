import { ApolloClient } from 'apollo-client'
import { append, filter, map, path } from 'ramda'
import createListMutation from './graphql/mutations/createList.gql'
import deleteListMutation from './graphql/mutations/deleteList.gql'
import updateListMutation from './graphql/mutations/updateList.gql'
import getListQuery from './graphql/queries/getList.gql'
import getListDetailedQuery from './graphql/queries/getListDetails.gql'

const WISHLIST_STORAKE_KEY = 'vtexwishlists'

export const getListsIdFromCookies = () => {
  const lists = localStorage.getItem(WISHLIST_STORAKE_KEY)
  return (
    (lists &&
      lists
        .split(',')
        .map((id: string) => id.replace('"', '').replace('"', ''))) ||
    []
  )
}

export const saveListIdInLocalStorage = (id: string | undefined): void => {
  if (id) {
    const lists = localStorage.getItem(WISHLIST_STORAKE_KEY)
    const newLists = lists ? lists + ',' + id : id
    localStorage.setItem(WISHLIST_STORAKE_KEY, newLists)
  }
}

export const removeListIdFromLocalStorage = (listId: string): void => {
  const listsId = getListsIdFromCookies()
  const listsIdWithoutRemoved = filter((id: string) => id !== listId, listsId)
  localStorage.setItem(WISHLIST_STORAKE_KEY, listsIdWithoutRemoved.toString())
}

export const getList = (
  client: ApolloClient<ResponseList>,
  id: string
): Promise<ResponseList> => {
  return client.query({
    fetchPolicy: 'network-only',
    query: getListQuery,
    variables: { id },
  })
}

export const updateList = (
  client: ApolloClient<ResponseList>,
  id: string,
  { name, isPublic, items }: List
): Promise<ResponseList> => {
  return client.mutate({
    mutation: updateListMutation,
    variables: {
      id,
      list: {
        isPublic,
        items,
        name,
      },
    },
  })
}

export const createList = (
  client: ApolloClient<ResponseList>,
  list: List
): Promise<ResponseList> =>
  client.mutate({
    mutation: createListMutation,
    variables: {
      ...list,
    },
  })

export const addProductToDefaultList = (
  listName: string,
  client: ApolloClient<ResponseList>,
  product: ListItem
): Promise<ResponseList> => {
  const listsId = getListsIdFromCookies()
  if (listsId && listsId.length) {
    return getList(client, listsId[0]).then((response: ResponseList) => {
      const list = response.data.list
      return updateList(client, listsId[0], {
        items: append(product, list.items || []),
        name: list.name,
      })
    })
  }
  return createList(client, {
    isEditable: false,
    items: [product],
    name: listName,
  }).then((response: ResponseList) => {
    saveListIdInLocalStorage(path(['data', 'createList', 'id'], response) || '')
    return response
  })
}

export const getListsFromLocaleStorage = (
  client: ApolloClient<ResponseList>
): Promise<ResponseList[]> => {
  const listsId = getListsIdFromCookies() || []
  return Promise.all(
    map((id: string) => {
      return getList(client, id)
    }, listsId)
  )
}

export const deleteList = (
  client: ApolloClient<ResponseList>,
  listId: string
): Promise<void> => {
  return client
    .mutate({
      mutation: deleteListMutation,
      variables: {
        id: listId,
      },
    })
    .then(() => removeListIdFromLocalStorage(listId))
}

export const getListDetailed = (
  client: ApolloClient<ResponseList>,
  listId: string
): Promise<ResponseList> =>
  client.query({
    fetchPolicy: 'network-only',
    query: getListDetailedQuery,
    variables: { id: listId },
  })
