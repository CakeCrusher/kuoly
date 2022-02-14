type Props = {
  id: string;
};

declare namespace CatalogueHook {
  export type editCatalogue = GenericEdit;

  export type editCatalogueFile = GenericFileEdit;

  export type base = {
    incrementCatalogueViews: any;
    catalogueSubscription: any;
    catalogueQuery: any;
    editCatalogue: editCatalogue;
    editCatalogueFile: editCatalogueFile;
  };

  export type FC = (p: Props) => CatalogueHook.base;
}