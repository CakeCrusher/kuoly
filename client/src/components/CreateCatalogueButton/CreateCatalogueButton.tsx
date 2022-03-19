import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cache } from "../../graphql/clientConfig";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

type Props = {
  className?: string;
  simpleText?: boolean;
};

const CreateCatalogueButton = ({
  className,
  simpleText,
}: Props): React.ReactElement => {
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);
  apolloHookErrorHandler("CreateCatalogueButton.tsx", error);

  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && data) {
      cache.updateQuery({ query: MY_CATALOGUES }, (prev) => {
        return {
          myCatalogues: [...prev.myCatalogues, data.createCatalogue],
        };
      });
      navigate("/ctg/" + data.createCatalogue.id);
    }
  }, [loading, data]);

  const handleClick = async () => {
    createCatalogue();
  };

  if (simpleText) {
    return (
      <div onClick={handleClick} className={className}>
        Create Catalogue
      </div>
    );
  }

  return (
    <button onClick={handleClick} className={`btn ${className}`}>
      Create Catalogue
    </button>
  );
};

export default CreateCatalogueButton;
