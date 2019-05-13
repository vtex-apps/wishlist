# VTEX Wishlist app

## Description

The Wishlist is a canonical app that any VTEX store can use. This app is responsible for managing the costumer's lists of products.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [0.x]  | **Current Release** |   2019-04-03    |                       |             |         2.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

:construction: :construction:  Not implemented yet :construction: :construction: 


### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within `login` and `login-content` and describes if they are required or optional.

```json
{
  "login": {
    "component": "Login"
  },
  "login-content": {
    "component": "LoginContent"
  }
}
```

For now these blocks do not have any required or optional blocks.

#### Configuration

This app has no configuration yet.


### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.wishList.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

| Class name                 | Description                          | Component Source                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listPageItemsContainer`                | List page's container of the products                | [ListsPage/Content](/react/components/ListsPage/Content.tsx)                                                                                                                                                                                        |
| `listPage`                | List page's main container                | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `listPage`                | List page's main container                | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `applyButton`                | Container of the button to confirm selected lists to add a product in the mobile mode           | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `contentContainer`                | Container of the `AddToList`'s content           | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `popover`                | Container of the `Popover` component           | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `open`                | Class that is added to the body element when the `ListPage` is rendered           | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `formViewDialog`                | Dialog content of the FormView component in the desktop mode           | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `summaryContainer`                | Container of the `ProductSummary` in the list item details           | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `summaryContainerLarge`                | Container of the `ProductSummary` in the list item details in desktop mode          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `addToListContent`                | Main container of the `AddToList` component          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `addToListListsToSwitch`                | Container of the lists to be selected in the `AddToList` component          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `createList`                | Container of the `CreateList`          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `createListButtonContainer`                | Container of the button to create a new list          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `isPublicLabel`                | Label to show the privacy message in the `ListForm`          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `isPublicHint`                | Label to show the privacy hint in the `ListForm`          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `isPublicContainer`                | Container of the privacy information in the `ListForm`          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `nameInputContainer`                | Container of the list's name input          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `form`                | Main container of the `ListForm`          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `updateList`                | Main container of the update list form          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `listEmptyContainer`                | Container of the empty list message in in the list details          | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `listEmptyLabel`                | Container of the empty message label  when a list does not have products added to it         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `goToAddProductsButtonContainer`                | Container of the button that redirect to the `Galery`         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `listDetailsContent`                | Main container of the list details         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `buySelectedItemsBtnContainer`                | Container of the `BuyButton` that add to the cart the selected products of a list         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `totalPriceLabel`                | Label of the quantity of products in a list         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `pricesContainer`                | Label of the total price of the selected items from a list         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `quantityOfSelectedItemsLabel`                | Label of the quantity of selected items froma list         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |
| `ListDetailsFooter`                | Container of the list details' footer         | [ListsPage/index](/react/components/ListsPage/index.tsx)                                                                                                                                                                                        |


## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/wishlist/issues). Also feel free to [open issues](https://github.com/vtex-apps/wishlist/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Tests

:construction: :construction:  Not implemented yet :construction: :construction: 

