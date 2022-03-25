import React from "react";
import Modal from "../Modal/Modal";
import useLinkApolloHooks from "../../graphql/hooks/link";
import { isUrl, rootUrl } from "../../utils/functions";

import "./LinksContainer.less";
import TextInput from "../fields/TextInput/TextInput";

type Props = {
  link: Link | null;
  handleClose: () => void;
};

const EditLinkModal: React.FC<Props> = ({ link, handleClose }) => {
  const { editLink } = useLinkApolloHooks();

  if (!link) return null;

  const handleSubmit = (text: string, keyProp: string) => {
    const key = keyProp.split(":").pop();
    if (!key) {
      console.warn("Key error");
      return;
    }
    editLink(link.id, text, key);
  };

  return (
    <Modal show={link !== null} close={handleClose}>
      <div className="row-container">
        <img
          src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${rootUrl(
            link.url
          )}&size=256`}
          alt="url favicon"
        />
        <TextInput
          isEditing={true}
          handleSubmit={handleSubmit}
          value={link.title || ""}
          fieldEditingProp={{
            typename: "Link",
            key: "title",
            id: link.id,
          }}
          placeholder="title"
        />
      </div>
      <TextInput
        isEditing={true}
        handleSubmit={handleSubmit}
        validator={isUrl}
        value={link.url || ""}
        fieldEditingProp={{
          typename: "Link",
          key: "url",
          id: link.id,
        }}
        placeholder="url"
      />
    </Modal>
  );
};

export default EditLinkModal;
