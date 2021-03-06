import React, { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useNavigationType,
} from "react-router-dom";

import {
  CatalogueHeader,
  CatalogueItems,
  ListingModal,
} from "../../containers";

import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import {
  cleanedPath,
  getCatalogueFromCache,
  removeFromCacheIfMFD,
} from "../../utils/functions";
import { useIsEditing, useMarkedForDeletion } from "../../state/store";

import "./Catalogue.less";

const Catalogue: React.FC = () => {
  // get navigation params
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const useQueryStrings = () => {
    return useMemo(
      () => new URLSearchParams(location.search),
      [location.search]
    );
  };
  const queryStrings = useQueryStrings();
  const isEditId = Boolean(queryStrings.get("edit"));
  const { markedForDeletion } = useMarkedForDeletion();

  let initialSelectedListingId: string | null = null;
  let splitPath = cleanedPath(location.pathname).split("/");
  if (splitPath.length > 3) {
    initialSelectedListingId = splitPath[3];
  }
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    initialSelectedListingId
  );

  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();
  if (!corresponding_id) throw new Error("no id on params");
  const idVariable = { [isEditId ? "edit_id" : "id"]: corresponding_id };

  // All ApolloHooks are moved to custom hook for organization
  const {
    incrementCatalogueViewsMuation,
    handleCatalogueSubscription,
    handleCatalogueQuery,
  } = useCatalogueApolloHooks({
    id: corresponding_id,
  });
  // query below scouts the catalogue and populates the cache
  // (that cache is how the catalogue is rendered)
  const catalogueQuery = handleCatalogueQuery(idVariable);
  handleCatalogueSubscription(idVariable);
  // Inputs need to toggle from Editing to Display state
  const { isEditing, setIsEditing } = useIsEditing();
  useEffect(() => {
    incrementCatalogueViewsMuation({
      variables: { ...idVariable },
    });
  }, []);

  let catalogue: CatalogueType | null = null;
  if (catalogueQuery.error) {
    return <div className="message">Catalogue not found</div>;
  }

  if (catalogueQuery.data && catalogueQuery.data.catalogues[0]) {
    // The catalogue being used in the catalogue state
    // will always be the cached catalogue as fetched
    // by CATALOGUE_FRAGMENT
    catalogue = getCatalogueFromCache(catalogueQuery.data.catalogues[0].id);
    if (catalogue) {
      removeFromCacheIfMFD(catalogue, markedForDeletion);
    }
  }

  if (!catalogue) {
    return <div className="message">Loading...</div>;
  }
  // console.log("catalogue", catalogue);

  // status conditions
  let editable = current_user_id === catalogue.user_id;
  switch (catalogue.status) {
    case "private":
      if (current_user_id !== catalogue.user_id) {
        if (isEditing) setIsEditing(false);
        return (
          <div className="message">
            Private catalogue, only visible to owner.
          </div>
        );
      }
      break;
    case "public":
      if (current_user_id !== catalogue.user_id && isEditing)
        setIsEditing(false);
      break;
    case "collaborative":
      if (isEditId) editable = true;
      break;
    default:
      break;
  }

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
    if (navigationType === "PUSH") {
      navigate(-1);
    } else {
      navigate(`/ctg/${corresponding_id}${location.search}`);
    }
    setSelectedListingId(null);
  };

  const handleSelectListing = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  const selectedListing =
    selectedListingId && catalogue.listings
      ? catalogue.listings.find((li: Listing) => li.id === selectedListingId)!
      : null;

  return (
    <div className="catalogue-container">
      <div
        style={{
          flex: "1 0 auto",
          backgroundColor: `${catalogue.header_color}22`,
        }}
      >
        <div className="page-wrapper">
          <CatalogueHeader
            isEditing={isEditing}
            editable={editable}
            catalogue={catalogue}
            toggleEdit={() => setIsEditing(!isEditing)}
          />

          <CatalogueItems
            catalogue={catalogue}
            isEditing={isEditing}
            labels={sortedLabels}
            listings={sortedListings}
            handleSelectListing={handleSelectListing}
          />
          <ListingModal
            catalogueId={catalogue.id}
            labels={sortedLabels}
            listingId={selectedListingId}
            listing={selectedListing}
            handleClose={handleListingModalClose}
            editable={editable}
          />
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
