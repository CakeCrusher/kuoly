import React, {
  ChangeEvent,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { IconButton, ImageCrop, Modal } from "..";
import { acceptedImageFiles } from "../../utils/references";
import { Camera } from "../../assets";

import "./AvatarImage.less";
import { FiTrash2, FiUpload } from "react-icons/fi";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogueFile;
  handleDelete: CatalogueHook.editCatalogue;
  value: string;
  keyProp: string;
  className?: string;
};

const AvatarImage: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  handleDelete,
  keyProp,
  value,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // ImageCrop: use `createRef` and assign `new ImageCrop.RefManager`
  const cropRef = createRef<ImageCrop.RefManager>();
  (cropRef as any).current = new ImageCrop.RefManager({
    aspect: 1,
    bound_h: 0.5,
    bound_w: 0.5,
    shape: "arc",
  });

  // ImageCrop: this `useEffect` clears the canvas and the render loop
  useEffect(() => {
    return () => {
      if (cropRef.current) {
        cropRef.current!.clear();
        (cropRef as any).current = null;
      }
    };
  }, [handleSubmit, isEditing, showModal]);

  const handleModal = () =>
    setShowModal((prev) => {
      (fileRef as any).current.value = "";
      return !prev;
    });

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      throw new Error("No files property on event target");
    }
    if (!cropRef.current) {
      throw new Error("Could not find cropRef for HeaderImage");
    }

    const file = evt.target.files[0];
    if (!acceptedImageFiles.includes(file.type)) {
      throw new Error("Invalid file type");
    } else {
      // ImageCrop: load a file
      cropRef.current.loadFile(file);
    }
  };

  const handleClickSubmit = () => {
    if (!fileRef.current)
      throw new Error("Could not find fileRef for AvatarImage");

    if (!cropRef.current)
      throw new Error("Could not find cropRef for HeaderImage");

    const { files } = fileRef.current;
    if (!files || !files[0]) throw new Error("No file selected");

    // ImageCrop: Good for testing
    //const display = document.getElementById(
    //  "avatar-image-display",
    //) as HTMLImageElement;
    //const input = document.getElementById(
    //  "avatar-image-input",
    //) as HTMLImageElement;
    //display.src = cropRef.current.getDataURL();
    //input.src = cropRef.current.getDataURL();

    // ImageCrop: Extract image data and package into file
    cropRef.current.getImageBlob(
      // BlobCallback
      (blob: BlobPart | null) => {
        // file name
        const splitFile = files[0].name.split(".");
        const filename = splitFile[0] + Date.now() + "." + splitFile[1];
        if (blob) {
          handleSubmit(new File([blob], filename), keyProp);
          handleModal();
        }
      },
      "image/jpg", // file type
      0.9 // image quality
    );
  };

  const handleFileDelete = () => {
    handleDelete("", keyProp);
  };

  return (
    <>
      <div
        className="avatar-image-container"
        style={value || isEditing ? {} : { display: "none" }}
      >
        {/* open modal, display image */}
        {/* TODO: Replace Icon */}
        <div className="toggle-wrapper">
          <div className={`toggle-input icons-container f-center`}>
            {isEditing && <IconButton onClick={handleModal} src={Camera} />}
          </div>
          <div className={`toggle-input image-wrapper`}>
            <img id="avatar-image-display" src={value} alt="" />
          </div>
          <div
            style={value ? {} : { borderWidth: "2px" }}
            className={`toggle-display image-wrapper`}
          >
            <img id="avatar-image-input" src={value} alt="" />
          </div>
        </div>
      </div>
      {/* file selection, image cropping, submit */}
      <Modal show={showModal} close={handleModal}>
        <Modal.Header close={handleModal}>Edit Avatar Image</Modal.Header>
        <Modal.Body>
          {/* ImageCrop: pass ref to component */}
          <ImageCrop ref={cropRef} />
          <div className="file-delete-row">
            <div className="file-input">
              <label
                className="btn btn-secondary-outline file-label"
                htmlFor={keyProp}
              >
                <FiUpload className="icon" />
                <div>Upload</div>
              </label>
              <input
                ref={fileRef}
                onChange={handleFileChange}
                className={`toggle-input file-input ${className || ""}`}
                type="file"
                name={keyProp}
                id={keyProp}
              />
            </div>
            <button
              onClick={handleFileDelete}
              className="btn btn-delete delete"
            >
              <FiTrash2 color="white" />
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary submit"
            onClick={handleClickSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AvatarImage;
