import { ApolloClient } from 'apollo-client'
import { append, path } from 'ramda'
import createListMutation from './graphql/mutations/createList.gql'
import deleteListMutation from './graphql/mutations/deleteList.gql'
import updateListMutation from './graphql/mutations/updateList.gql'
import getListQuery from './graphql/queries/getList.gql'
import getListDetailedQuery from './graphql/queries/getListDetails.gql'
import getListByOwnerQuery from './graphql/queries/getListByOwner.gql'

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

export const getListByOwner = (
  client: ApolloClient<ResponseList>,
  owner: string,
  page?: number,
  pageSize?: number
): Promise<ResponseList> =>
  client.query({
    fetchPolicy: 'network-only',
    query: getListByOwnerQuery,
    variables: { owner, page, pageSize },
  })

export const addProductToDefaultList = async (
  client: ApolloClient<ResponseList>,
  owner: string,
  listName: string,
  product: ListItem
): Promise<ResponseList> => {
  const response = await getListByOwner(client, owner, 1, 1)
  const lists: List[] | undefined = path(['data', 'listsByOwner'], response)
  if (lists && lists.length > 0 && lists[0]) {
    return updateList(client, lists[0].id || '', {
      items: append(product, lists[0].items || []),
      name: lists[0].name,
    })
  }
  return createList(client, {
    isEditable: false,
    items: [product],
    name: listName,
    owner,
  })
}

export const deleteList = (
  client: ApolloClient<ResponseList>,
  listId: string
): Promise<void> => {
  return client.mutate({
    mutation: deleteListMutation,
    variables: {
      id: listId,
    },
  })
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
