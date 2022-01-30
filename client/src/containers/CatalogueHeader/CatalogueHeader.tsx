import React from "react";
import {
  TextInput,
  Dropdown,
  HeaderImage,
  AvatarImage,
  CalendarInput,
} from "../../components";
import { statusOptions } from "../../utils/references";

type Props = {
  isEditing: any;
  catalogue: CatalogueType;
  handleTextInput: (t: string, objectKey: string) => void;
  handleFileInput: (f: File | undefined, objectKey: string) => void;
  handleDDSubmit: (t: string, objectKey: string) => void;
  handleDateInput: (ISOString: string, objectKey: string) => void;
  toggleEdit: () => void;
};

const CatalogueHeader: React.FC<Props> = ({
  isEditing,
  catalogue,
  handleTextInput,
  handleFileInput,
  handleDDSubmit,
  handleDateInput,
  toggleEdit,
}) => {
  return (
    <div className="row catalogue-header-container">
      {/* header image hero*/}
      <div className="col-12">
        <HeaderImage
          isEditing={isEditing}
          handleSubmit={handleFileInput}
          keyProp={"header_image_url"}
          value={catalogue.header_image_url || ""}
        />
      </div>
      {/* avatar, name, title, views, description, date, location */}
      <div className="col-12 d-flex flex-md-row flex-sm-column-reverse">
        <div className="flex-grow-1">
          <AvatarImage
            isEditing={isEditing}
            handleSubmit={handleFileInput}
            keyProp={"profile_picture_url"}
            value={catalogue.profile_picture_url || ""}
          />
          <TextInput
            isEditing={isEditing}
            handleSubmit={handleTextInput}
            keyProp="title"
            value={catalogue.title}
            className="fs-2"
          />
          <TextInput
            isEditing={isEditing}
            handleSubmit={handleTextInput}
            keyProp="description"
            value={catalogue.description || ""}
          />
          <div className="row">
            <div className="col-4">views: {catalogue.views}</div>
            <div className="col-4">
              <CalendarInput
                value={catalogue.event_date}
                keyProp="event_date"
                handleDateInput={handleDateInput}
              />
            </div>
          </div>
        </div>

        {/* edit toggle, editor link, share link, public/private options */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={toggleEdit}>
              Edit
            </button>
            <a className="btn btn-link">Copy Editor Link</a>
            <a className="btn btn-link">Share</a>
          </div>
          <div className="d-flex justify-content-end">
            <Dropdown
              value={catalogue.status}
              handleSubmit={handleDDSubmit}
              keyProp="status"
            >
              <Dropdown.Toggle disable={!isEditing} />
              <Dropdown.Menu>
                {statusOptions.map((option) => (
                  <Dropdown.Item key={option} value={option}>
                    {option}
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
