import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextInput, FileInput, Dropdown } from "../../components";
import { updateCatalogueCache } from "../../utils/functions";
import useCatalogueApolloHooks from "./useCatalogueApolloHooks";

type ToolbarProps = {
  setIsEditing: (f: React.SetStateAction<boolean>) => void;
};

const CatalogueToolbar: React.FC<ToolbarProps> = ({ setIsEditing }) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  return (
    <div className="row">
      <div className="col-2">
        <a className="btn btn-primary" onClick={goBack}>
          Go Back
        </a>
        <button className="btn btn-warning" onClick={toggleEditing}>
          Edit
        </button>
      </div>
    </div>
  );
};

const Catalogue: React.FC<{ is_edit_id?: boolean }> = ({ is_edit_id }) => {
  // Get Id from params and localStorage, especially for CatalogueApolloHooks
  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();
  const CatalogueIdVariables = is_edit_id
    ? { edit_id: corresponding_id }
    : { id: corresponding_id };

  // Inputs need to toggle from Editing to Display state
  const [isEditing, setIsEditing] = useState(false);

  // All ApolloHooks are moved to custom hook for organization
  const {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueQuery,
    catalogueSubscription,
  } = useCatalogueApolloHooks({
    CatalogueIdVariables,
  });

  // TODO: Need to make sure this only happens once per visit
  // (will currently trigger on each rerender)
  useEffect(() => {
    incrementCatalogueViews();
  }, []);

  if (!catalogueQuery.data && !catalogueSubscription.data) {
    return <div>Loading...</div>;
  }

  // This needs to update cache
  const catalogue = catalogueSubscription.data
    ? catalogueSubscription.data.liveCatalogue
    : catalogueQuery.data.catalogues[0];

  if (!catalogue) {
    return <h1>Catalogue not found</h1>;
  }

  let editable = is_edit_id || current_user_id === catalogue.user_id;

  const handleTextInput = (text: string) => {
    updateCatalogueCache(`Catalogue:${catalogue.id}`, "title", text);
    updateCatalogue({
      variables: {
        id: catalogue.id,
        key: "title",
        value: text,
      },
    });
  };

  const handleFileInput = () => {};

  return (
    <div>
      {editable && <CatalogueToolbar setIsEditing={setIsEditing} />}
      {/* <div className="row">
        <ToggleEdit isEditing={isEditing}>
          <div className="toggle-input">
            <input type="file" onChange={handleFileInput} disabled />
            <div>display faded image behind file input</div>
          </div>
          <div className="toggle-display">display regular image</div>
        </ToggleEdit>
      </div> */}
      <div className="row">
        <TextInput
          isEditing={isEditing}
          handleSubmit={handleTextInput}
          value={catalogue.title}
        />
        <TextInput
          isEditing={isEditing}
          handleSubmit={handleTextInput}
          value={catalogue.title}
          className="fs-2"
        />
        <FileInput
          isEditing={isEditing}
          handleSubmit={handleFileInput}
          value={"test"}
        />
        <Dropdown value="test">
          <Dropdown.Toggle disable={!isEditing} />
          <Dropdown.Menu>
            <Dropdown.Item value={"test1"}>Test 1</Dropdown.Item>
            <Dropdown.Item value={"test2"}>Test 2</Dropdown.Item>
            <Dropdown.Item value={"test3"}>Test 3</Dropdown.Item>
            <Dropdown.Item value={"test4"}>Test 4</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <div>views: {catalogue.views}</div>
      </div>
    </div>
  );

  // console.warn("error", error);
  // return <div> Uh oh something went wrong</div>;
};

export default Catalogue;
