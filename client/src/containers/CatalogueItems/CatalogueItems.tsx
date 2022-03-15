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
  const { createLabel, deleteLabel, reorderLabel } = useLabelApolloHooks({
    catalogue_id: catalogue.id,
  });
  const {listingsFilter, setListingsFilter} = useListingsFilter()
  const toggleListingFilter = (listingId: string) => {
    if (!isEditing) {
      // if listingsFilter.labelIds includes listingId, remove it
      if (listingsFilter.labelIds.includes(listingId)) {
        setListingsFilter({
          ...listingsFilter,
          labelIds: listingsFilter.labelIds.filter(
            (labelId) => labelId !== listingId
          ),
        });
      }
      // if not, add it
      else {
        setListingsFilter({
          ...listingsFilter,
          labelIds: [...listingsFilter.labelIds, listingId],
        });
      }
    }
  };

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
        <LabelContainer createLabel={createLabel} isEditing={isEditing}>
          <DragAndDrop disabled={!isEditing} handleReorder={reorderLabel}>
            {labels.map((e: Label) => (
              <Draggable key={e.id} refData={e}>
                <Label
                  key={e.id}
                  className={`label ${isEditing ? "can-delete" : ""}`}
                  label={e}
                  isEditing={isEditing}
                  onClick={() => toggleListingFilter(e.id)}
                  faint={!isEditing && !listingsFilter.labelIds.includes(e.id)}
                  deleteLabel={(id) => deleteLabel(id, catalogue)}
                />
              </Draggable>
            ))}
          </DragAndDrop>
        </LabelContainer>
      </div>
      <div className="listing-cards-container-wrapper">
        <ListingCardsContainer>
          <DragAndDrop
            disabled={!isEditing}
            handleReorder={reorderListing(catalogue.id)}
          >
            {listings.map((e: Listing) => (
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
      </div>
    </div>
  );
};

export default CatalogueItems;
