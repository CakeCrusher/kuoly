import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  CatalogueHeader,
  CatalogueItems,
  CatalogueToolbar,
  ListingModal,
} from "../../containers";
import { cache } from "../../graphql/clientConfig";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import { UndoNotification } from "../../components";

import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";

const Catalogue: React.FC<{ is_edit_id?: boolean }> = ({ is_edit_id }) => {
  // Get Id from params and localStorage, especially for CatalogueApolloHooks
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );

  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();
  if (!corresponding_id) throw new Error("no id on params");

  // Inputs need to toggle from Editing to Display state
  const [isEditing, setIsEditing] = useState(true);

  // All ApolloHooks are moved to custom hook for organization
  const { incrementCatalogueViews, catalogueSubscription } =
    useCatalogueApolloHooks({
      id: corresponding_id,
    });

  // TODO: Need to make sure this only happens once per visit
  // (will currently trigger on each rerender)
  useEffect(() => {
    // delay gives time for the subscription to get set up
    setTimeout(() => {
      incrementCatalogueViews();
    }, 1000);
  }, []);
  if (!catalogueSubscription.data) {
    return <div>Loading...</div>;
  }

  // The catalogue being used in the catalogue state
  // will always be the cached catalogue as fetched
  // by CATALOGUE_FRAGMENT
  const catalogue: CatalogueType | null = cache.readFragment({
    id: `Catalogue:${catalogueSubscription.data.liveCatalogue.id}`,
    fragment: ALL_CATALOGUE_FIELDS,
    fragmentName: "AllCatalogueFields",
  });

  if (!catalogue) {
    return <h1>Catalogue not found</h1>;
  }

  let editable = is_edit_id || current_user_id === catalogue.user_id;

  // TODO: should sort this in the backend
  const sortedLabels =
    catalogue.labels && catalogue.labels[0]
      ? [...catalogue.labels].sort((a, b) => a.ordering - b.ordering)
      : [];

  // TODO: Should sort this in the backend
  const sortedListings =
    catalogue.listings && catalogue.listings[0]
      ? [...catalogue.listings].sort((a, b) => a.ordering - b.ordering)
      : [];

  const handleListingModalClose = () => {
    setSelectedListingId(null);
  };

  const handleSelectListing = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  const selectedListing = selectedListingId
    ? catalogue.listings.find((li: Listing) => li.id === selectedListingId)!
    : null;

  return (
    <div className="page-wrapper">
      <CatalogueToolbar editable={editable} />
      <CatalogueHeader
        isEditing={isEditing}
        catalogue={catalogue}
        toggleEdit={() => setIsEditing((prev) => !prev)}
      />
      <UndoNotification />
      <CatalogueItems
        catalogue={catalogue}
        isEditing={isEditing}
        labels={sortedLabels}
        listings={sortedListings}
        handleSelectListing={handleSelectListing}
      />
      <ListingModal
        isEditing={isEditing}
        labels={sortedLabels}
        listing={selectedListing}
        handleClose={handleListingModalClose}
      />
    </div>
  );
};

export default Catalogue;