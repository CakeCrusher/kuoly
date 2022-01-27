import { gql } from "@apollo/client";
import { ALL_CATALOGUE_FIELDS, CATALOGUE_LIST_ITEM_FIELDS } from "./fragments";

export const GET_JWT = gql`
  query GetJwt {
    getJwt
  }
`;

export const GET_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  query Catalogues($id: ID, $edit_id: String) {
    catalogues(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }
`;

export const MY_CATALOGUES = gql`
  ${CATALOGUE_LIST_ITEM_FIELDS}
  query MyCatalogues {
    myCatalogues {
      ...CatalogueListItemFields
    }
  }
`;

export const CREATE_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation CreateCatalogue {
    createCatalogue {
      ...AllCatalogueFields
    }
  }
`;

export const DELTETE_CATALOGUE = gql`
  ${CATALOGUE_LIST_ITEM_FIELDS}
  mutation DeleteCatalogue($id: ID!) {
    deleteCatalogue(id: $id) {
      ...CatalogueListItemFields
    }
  }
`;

export const INCREMENT_CATALOGUE_VIEWS = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation IncrementCatalogueViews($id: ID, $edit_id: String) {
    incrementCatalogueViews(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }
`;

export const UPDATE_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation EditCatalogue($key: String!, $value: String!, $id: ID!) {
    editCatalogue(key: $key, value: $value, id: $id) {
      ...AllCatalogueFields
    }
  }
`;

export const LIVE_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  subscription LiveCatalogue($id: ID, $edit_id: String) {
    liveCatalogue(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }
`;

export const UPDATE_CATALOGUE_FILES = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation EditCatalogueFile($key: String!, $file: Upload!, $id: ID!) {
    editCatalogueFile(key: $key, id: $id, file: $file) {
      ...AllCatalogueFields
    }
  }
`;
