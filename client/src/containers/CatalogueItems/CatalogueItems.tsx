import React from "react";
import {
  LabelContainer,
  Label,
  ListingCard,
  ListingCardsContainer,
  AddListing,
  DragAndDrop,
  Draggable,
  ListingsFilter,
} from "../../components";
import useListingApolloHooks from "../../graphql/hooks/listing";
import useLabelApolloHooks from "../../graphql/hooks/label";

import "./CatalogueItems.less";
import { useListingsFilter } from "../../state/store";
import { filteredListings } from "../../utils/functions";

type Props = {
  isEditing: boolean;
  catalogue: CatalogueType;
  labels: Label[];
  listings: Listing[];
  handleSelectListing: (listingId: string) => void;
};

const CatalogueItems: React.FC<Props> = ({
  labels,
  catalogue,
  listings,
  isEditing,
  handleSelectListing,
}) => {
  const { createListing, deleteListing, reorderListing } =
    useListingApolloHooks();
  const { listingsFilter, setListingsFilter } = useListingsFilter();

  const organizedListings = isEditing
    ? listings
    : filteredListings(listings, listingsFilter);

  return (
    <div className="catalogue-items-container">
      {/* add item, sort */}
      <div className="add-listing-sort">
        <div className="add-listing-wrapper">
          <AddListing handleSubmit={createListing(catalogue.id)} />
        </div>
        <div className="sort-wrapper">
          <ListingsFilter />
        </div>
      </div>
      {/* labels */}
      <div className="labels-container-wrapper">
        <LabelContainer
          isEditing={isEditing}
          catalogue={catalogue}
          labels={labels}
        />
      </div>
      {/* <div className="listing-cards-container-wrapper">
        <ListingCardsContainer>
          <DragAndDrop
            disabled={!isEditing}
            handleReorder={reorderListing(catalogue.id)}
          >
            {organizedListings.map((e: Listing) => (
              <Draggable key={e.id} refData={e}>
                <ListingCard
                  listing={e}
                  isEditing={isEditing}
                  selectListing={handleSelectListing}
                  deleteListing={deleteListing}
                />
              </Draggable>
            ))}
          </DragAndDrop>
        </ListingCardsContainer>
      </div> */}
    </div>
  );
};

export default CatalogueItems;
