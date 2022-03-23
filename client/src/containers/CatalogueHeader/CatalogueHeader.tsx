import React from "react";
import {
  FiBookmark,
  FiCalendar,
  FiEdit2,
  FiEye,
  FiShare2,
} from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import {
  TextInput,
  Dropdown,
  CatalogueBanner,
  AvatarImage,
  CalendarInput,
  TextareaInput,
} from "../../components";
import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import { handleCopy } from "../../utils/functions";
import { statusOptions, statusTitles } from "../../utils/references";

import "./CatalogueHeader.less";

type Props = {
  isEditing: any;
  editable: boolean;
  catalogue: CatalogueType;
  toggleEdit: () => void;
};

const CatalogueHeader: React.FC<Props> = ({
  isEditing,
  editable,
  catalogue,
  toggleEdit,
}) => {
  const { editCatalogue, editCatalogueFile } = useCatalogueApolloHooks({
    id: catalogue.id,
  });

  return (
    <div className="catalogue-header-container">
      {/* header image hero*/}
      <div className={`catalogue-banner-wrapper ${isEditing ? "editing" : ""}`}>
        {/* color border */}
        <CatalogueBanner
          isEditing={isEditing}
          handleSubmit={editCatalogueFile}
          handleDelete={editCatalogue}
          keyProp={"header_image_url"}
          value={catalogue.header_image_url || ""}
          catalogue={catalogue}
        />
        <div
          className="color-border"
          style={{ backgroundColor: catalogue.header_color }}
        ></div>
      </div>
      <div className="header-content">
        {/* left half */}
        <div className="left-half">
          {/* avatar, author, title */}
          <div className="avatar-author-title-container">
            <div className="avatar-image-wrapper">
              <AvatarImage
                isEditing={isEditing}
                handleSubmit={editCatalogueFile}
                handleDelete={editCatalogue}
                keyProp={"profile_picture_url"}
                value={catalogue.profile_picture_url || ""}
              />
            </div>
            <div className="author-title-wrapper">
              <TextInput
                isEditing={isEditing}
                handleSubmit={editCatalogue}
                fieldEditingProp={{
                  typename: "Catalogue",
                  key: "author",
                  id: catalogue.id,
                }}
                value={catalogue.author || ""}
                placeholder="Author"
                className="author"
              />
              <TextInput
                isEditing={isEditing}
                handleSubmit={editCatalogue}
                fieldEditingProp={{
                  typename: "Catalogue",
                  key: "title",
                  id: catalogue.id,
                }}
                placeholder="Title"
                value={catalogue.title || ""}
                className="title"
              />
            </div>
          </div>

          {/* event_date, views, location */}
          <div className="f-row event-date-views-location">
            <div className="views-wrapper">{catalogue.views} views</div>
            <div className="event-date-wrapper">
              {catalogue.event_date || isEditing ? (
                <FiCalendar size="1rem" />
              ) : null}
              <CalendarInput
                isEditing={isEditing}
                value={catalogue.event_date}
                handleOnSubmit={(date: string) =>
                  editCatalogue(date, "event_date")
                }
                className="calendar"
              />
            </div>
          </div>
          {/* description */}
          <div className="description-container">
            <TextareaInput
              isEditing={isEditing}
              handleSubmit={editCatalogue}
              fieldEditingProp={{
                typename: "Catalogue",
                key: "description",
                id: catalogue.id,
              }}
              placeholder="Description"
              value={catalogue.description || ""}
              className="description"
            />
          </div>
        </div>

        {/* right half */}
        <div className="right-half">
          {/* edit toggle, editor link, share link, public/private options */}
          <div className="edit-copy-share">
            <div className="btn-wrapper">
              {editable && (
                <>
                  <button
                    onClick={toggleEdit}
                    className="btn-icon btn-secondary edit-btn"
                  >
                    {isEditing ? (
                      <>
                        <FiEdit2 />
                        <div>Edit</div>
                      </>
                    ) : (
                      <>
                        <FiEye />
                        <div>Preview</div>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            {editable && (
              <div data-tip data-for="copy-edit" className="btn-wrapper">
                <a
                  onClick={() =>
                    handleCopy(`/ctg/${catalogue.edit_id}?edit=true`)
                  }
                  className="btn-icon btn"
                >
                  <FiBookmark />
                  <div>Editor Link</div>
                </a>
                <ReactTooltip id="copy-edit" place="top" effect="solid">
                  Copy Editor Link
                </ReactTooltip>
              </div>
            )}
            <div data-tip data-for="copy-share" className="btn-wrapper">
              <a
                onClick={() => handleCopy(`/ctg/${catalogue.id}`)}
                className="btn btn-icon"
              >
                <FiShare2 />
                <div>Share</div>
              </a>
              <ReactTooltip id="copy-share" place="top" effect="solid">
                Copy Link
              </ReactTooltip>
            </div>
          </div>
          <div className="dropdown-wrapper">
            <span className="status-label">This list is: </span>
            <Dropdown
              value={catalogue.status}
              handleSubmit={editCatalogue}
              fieldEditingProps={{
                typename: "Catalogue",
                key: "status",
                id: catalogue.id,
              }}
            >
              <Dropdown.Toggle
                className={isEditing ? "sudo-btn" : "status-padding"}
                disable={
                  !isEditing ||
                  catalogue.user_id !== localStorage.getItem("authorization")
                }
              />

              <Dropdown.Menu>
                {statusOptions
                  .filter((option) => option !== catalogue.status)
                  .map((option) => (
                    <Dropdown.Item
                      title={statusTitles[option]}
                      className="btn"
                      key={option}
                      value={option}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueHeader;
