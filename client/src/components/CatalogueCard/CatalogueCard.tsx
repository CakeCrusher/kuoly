import React from "react";
import { DeleteCatalogueButton } from "..";
import { Share2 } from "../../assets";
import { handleCopy } from "../../utils/functions";
import ReactTooltip from "react-tooltip";

import "./CatalogueCard.less";

type Props = {
  catalogue: CatalogueStub;
};

const CatalogueCard: React.FC<Props> = ({ catalogue }) => {
  const handleShareClick = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
    // This card will likely be wrapped in a link
    // preventDefault will stop navigation
    evt.preventDefault();
    handleCopy(`/ctg/${catalogue.id}`);
  };

  let sortedListings = catalogue.listings ? [...catalogue.listings] : null;
  if (sortedListings) {
    sortedListings.sort((a, b) => a.ordering - b.ordering);
  }
  // 0.35 in hex

  return (
    <div className="card f-col catalogue-card">
      {/*TODO: need to somehow maintain aspect ratio of 6:1*/}
      <div
        className="card-header"
        style={{
          backgroundColor: !catalogue.profile_picture_url
            ? catalogue.header_color
            : "",
        }}
      >
        <img src={catalogue.header_image_url || "#"} />
      </div>
      <div className="f-col card-body">
        <div className="f-row avatar-title-author">
          <img
            className="profile-image"
            src={catalogue.profile_picture_url || "#"}
          />
          <div className="f-col title-author">
            <p className="author">{catalogue.author}</p>
            <h5 className="title">{catalogue.title}</h5>
          </div>
        </div>
        <div className="description-row">
          <p>{catalogue.description}</p>
        </div>
        <div className="f-row images-row">
          {sortedListings &&
            sortedListings.slice(0, 3).map((ls) => (
              <div key={ls.id}>
                <img
                  // style={{ backgroundColor: `${catalogue.header_color}66` }}
                  src={
                    ls.image_url ||
                    "https://storage.googleapis.com/givespace-pictures/Logo%20Placeholder%202.png"
                  }
                  alt=""
                />
              </div>
            ))}
        </div>
        <div className="f-row options-row">
          <DeleteCatalogueButton id={catalogue.id} />
          <button
            data-tip
            data-for="share"
            className="btn f-row option"
            onClick={handleShareClick}
          >
            <div>
              <img src={Share2} alt="share" />
            </div>
            <div className="fs-1">Share</div>
          </button>
          <ReactTooltip id="share" place="top" effect="solid">
            Copy list link
          </ReactTooltip>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCard;
