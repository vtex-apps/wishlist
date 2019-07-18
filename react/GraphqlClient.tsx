import { ApolloClient } from 'apollo-client'
import { append, concat, contains, filter, map, path, without } from 'ramda'
import createListMutation from './graphql/mutations/createList.gql'
import deleteListMutation from './graphql/mutations/deleteList.gql'
import updateListMutation from './graphql/mutations/updateList.gql'
import getListQuery from './graphql/queries/getList.gql'
import getListDetailedQuery from './graphql/queries/getListDetails.gql'
import getListsByOwnerQuery from './graphql/queries/getListsByOwner.gql'

const WISHLIST_STORAGE_KEY = 'vtexwishlists'

export const getListsIdFromCookies = () => {
  const lists = localStorage.getItem(WISHLIST_STORAGE_KEY)
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
    const lists = localStorage.getItem(WISHLIST_STORAGE_KEY)
    const newLists = lists ? lists + ',' + id : id
    localStorage.setItem(WISHLIST_STORAGE_KEY, newLists)
  }
}

export const removeListIdFromLocalStorage = (listId: string): void => {
  const listsId = getListsIdFromCookies()
  const listsIdWithoutRemoved = filter((id: string) => id !== listId, listsId)
  localStorage.setItem(WISHLIST_STORAGE_KEY, listsIdWithoutRemoved.toString())
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

const fetchListsByOwner = (
  client: ApolloClient<ResponseList>,
  owner: string,
  page?: number,
  pageSize?: number
): Promise<ResponseList> =>
  client.query({
    fetchPolicy: 'network-only',
    query: getListsByOwnerQuery,
    variables: { owner, page, pageSize },
  })

const joinLists = (
  listsByOwner: List[] | undefined,
  listsNotIndexed: ResponseList[]
) => {
  const notIndexed = map(item => item.data.list || {}, listsNotIndexed)
  const lists = filter(
    item => contains(item.id, getListsIdFromCookies()),
    listsByOwner || []
  )
  return concat(lists, notIndexed)
}

const isListFromOwner = (listsNotIndexed: ResponseList[], owner: string) => {
  return (
    listsNotIndexed.length > 0 &&
    path(['data', 'list', 'owner'], listsNotIndexed[0]) !== owner
  )
}

const getSyncLists = async (
  client: ApolloClient<ResponseList>,
  owner: string
): Promise<ResponseList> => {
  let {
    data: { listsByOwner },
  } = await fetchListsByOwner(client, owner)

  const listsId = map(item => item.id, listsByOwner || [])
  const listIdFromLocal = getListsIdFromCookies()
  if (!listIdFromLocal || !listIdFromLocal.length) {
    map(id => saveListIdInLocalStorage(id), listsId)
  } else {
    const listsIdNotIndexed = without(listsId, listIdFromLocal)
    const listsNotIndexed = await Promise.all(
      map(id => getList(client, id || ''), listsIdNotIndexed)
    )

    if (isListFromOwner(listsNotIndexed, owner)) {
      localStorage.removeItem(WISHLIST_STORAGE_KEY)
      map(id => saveListIdInLocalStorage(id), listsId)
    } else {
      listsByOwner = joinLists(listsByOwner, listsNotIndexed)
    }
  }

  return { data: { listsByOwner } }
}

export const getListsByOwner = (
  client: ApolloClient<ResponseList>,
  owner: string
): Promise<ResponseList> => getSyncLists(client, owner)

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
  client
    .mutate({
      mutation: createListMutation,
      variables: {
        ...list,
      },
    })
    .then((response: ResponseList) => {
      const {
        data: { createList },
      } = response
      saveListIdInLocalStorage(createList ? createList.id : '')
      return response
    })

export const addProductToDefaultList = async (
  client: ApolloClient<ResponseList>,
  owner: string,
  listName: string,
  product: ListItem
): Promise<ResponseList> => {
  const {
    data: { listsByOwner },
  } = await getSyncLists(client, owner)
  if (listsByOwner && listsByOwner.length) {
    const list = listsByOwner[0]
    return updateList(client, list.id || '', {
      items: append(product, list ? list.items || [] : []),
      name: list ? list.name : '',
    })
  }
  return createList(client, {
    isEditable: false,
    items: [product],
    name: listName,
    owner,
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
