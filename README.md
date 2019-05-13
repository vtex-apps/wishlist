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
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

In order to use this app, install it on your store with:

`vtex install vtex.wishlist`

After that, the `ProductSummary` and the `ProductDetails` will have the button to add the product to the lists.


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
| `listPage`                | List page's main container                | [ListsPage/Content](/react/components/ListsPage/Content.tsx)                                                                                                                                                                                        |
| `applyButton`                | Container of the button to confirm selected lists to add a product in the mobile mode           | [AddToList/Footer](/react/components/AddToList/Footer.tsx)                                                                                                                                                                                        |
| `contentContainer`                | Container of the `AddToList`'s content           | [AddToList/Content](/react/components/AddToList/Content.tsx)                                                                                                                                                                                        |
| `popover`                | Container of the `Popover` component           | [Popover](/react/components/Popover.tsx)                                                                                                                                                                                        |
| `formViewDialog`                | Dialog content of the FormView component in the desktop mode           | [FormView](/react/components/Form/FormView.tsx)                                                                                                                                                                                        |
| `summaryContainer`                | Container of the `ProductSummary` in the list item details           | [ListDetails/ItemDetails](/react/components/ListDetails/ItemDetails.tsx)                                                                                                                                                                                        |
| `summaryContainerLarge`                | Container of the `ProductSummary` in the list item details in desktop mode          | [ListDetails/ItemDetails](/react/components/ListDetails/ItemDetails.tsx)                                                                                                                                                                                        |
| `addToListContent`                | Main container of the `AddToList` component          | [AddToList/Content](/react/components/AddToList/Content.tsx)                                                                                                                                                                                        |
| `addToListListsToSwitch`                | Container of the lists to be selected in the `AddToList` component          | [AddToList/Content](/react/components/AddToList/Content.tsx)                                                                                                                                                                                        |
| `createList`                | Container of the `CreateList`          | [CreateList](/react/components/Form/CreateList.tsx)                                                                                                                                                                                        |
| `createListButtonContainer`                | Container of the button to create a new list          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `isPublicLabel`                | Label to show the privacy message in the `ListForm`          | [ListForm](react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `isPublicHint`                | Label to show the privacy hint in the `ListForm`          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `isPublicContainer`                | Container of the privacy information in the `ListForm`          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `nameInputContainer`                | Container of the list's name input          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                       |
| `form`                | Main container of the `ListForm`          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                      |
| `updateList`                | Main container of the update list form          | [UpdateList](/react/components/Form/UpdateList.tsx)                                                                                                                                                                                        |
| `listEmptyContainer`                | Container of the empty list message in in the list details          | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `listEmptyLabel`                | Container of the empty message label  when a list does not have products added to it         | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `goToAddProductsButtonContainer`                | Container of the button that redirect to the `Galery`         | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `listDetailsContent`                | Main container of the list details         | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `buySelectedItemsBtnContainer`                | Container of the `BuyButton` that add to the cart the selected products of a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `totalPriceLabel`                | Label of the quantity of products in a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `pricesContainer`                | Label of the total price of the selected items from a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `quantityOfSelectedItemsLabel`                | Label of the quantity of selected items froma list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `ListDetailsFooter`                | Container of the list details' footer         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                      |


## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/wishlist/issues). Also feel free to [open issues](https://github.com/vtex-apps/wishlist/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Tests

:construction: :construction:  Not implemented yet :construction: :construction: 

