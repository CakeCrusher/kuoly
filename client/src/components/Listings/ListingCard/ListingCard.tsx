import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton, Label, LabelContainer } from "../..";
import { cleanedPath } from "../../../utils/functions";

import { DragHorizontal, X } from "../../../assets";

import "./ListingCard.less";

type Props = {
  isEditing: boolean;
  listing: Listing;
  selectListing: (listingId: string) => void;
  deleteListing: (id: string) => void;
};

const ListingCard: React.FC<Props> = ({
  isEditing,
  listing,
  selectListing,
  deleteListing,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleDelete = () => {
    deleteListing(listing.id);
  };

  const handleSelect = () => {
    let urlToNavigate: string = cleanedPath(location.pathname);
    // listing
    urlToNavigate += `/${listing.id}`;
    // add location.search if it exists
    if (location.search) {
      urlToNavigate += location.search;
    }
    navigate(urlToNavigate);
    selectListing(listing.id);
  };

  return (
    <div className={`card ${isEditing ? "editing" : ""} listing-card`}>
      <div className="card-header text-center">
        <img src={DragHorizontal} alt="drag" />
        <IconButton onClick={handleDelete} src={X} />
      </div>
      <div className="card-body listing-card-body" onClick={handleSelect}>
        <div className="listing-image-wrapper">
          <img
            src={
              listing.image_url ||
              "https://media.wired.com/photos/592722c1af95806129f51b71/master/pass/MIT-Web-Loading.jpg"
            }
            draggable={false}
          />
        </div>

        <div className="listing-title-description">
          <h5>{listing.name}</h5>
          <p>{listing.description}</p>
        </div>

        <div className="listing-labels">
          <LabelContainer>
            {listing.labels &&
              listing.labels.map((e: any) => {
                return <Label label={e.label} />;
              })}
          </LabelContainer>
        </div>

        <div className="listing-price">
          {listing.show_price && (
            <span className="price">${listing.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
