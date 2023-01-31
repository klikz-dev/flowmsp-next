import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import Dropzone from "react-dropzone";
import Image from "./Image";

export default class ImageStrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      selectedLocation: this.props.selectedLocation,
    };
    this.onInput = this.onInput.bind(this);
  }

  toggleUploading() {
    this.setState((prevState) => ({
      uploading: !prevState.uploading,
    }));
  }

  onInput(files) {
    const filesArray = [...files];
    const { onUpload } = this.props;
    this.toggleUploading();
    onUpload(filesArray)
      .then(() => this.toggleUploading())
      .catch(() => this.toggleUploading());
  }

  onDrop(files) {
    const { onUpload } = this.props;
    this.toggleUploading();
    onUpload(files)
      .then(() => this.toggleUploading())
      .catch(() => this.toggleUploading());
  }

  render() {
    const {
      images,
      selectedLocation,
      selectedLocationImageReorder,
      onSelection,
      onAnnotation,
      onTagging,
      onDelete,
      onLeft,
      onRight,
      onOK,
      onCancel,
      isFIO,
      isCommand,
      canEditImage,
      changeCounter,
      locationLoading,
    } = this.props;

    return (
      <Dropzone
        className="imageStrip"
        /* Next line is important as it overrides default Dropzone styles */
        style={{}}
        disableClick
        onDrop={this.onDrop.bind(this)}
      >
        {this.state.uploading || locationLoading ? (
          <img
            src="/images/flow-loader.svg"
            className="no-image"
            style={{ height: "150px", margin: "10px auto" }}
          />
        ) : null}
        {!this.state.uploading &&
        !locationLoading &&
        selectedLocation.id !== selectedLocationImageReorder &&
        selectedLocation.isMine &&
        canEditImage &&
        !isFIO &&
        !isCommand ? (
          <span className="imageContainer">
            <div>
              <label htmlFor="upload" className="custom-file-upload">
                <img src="/images/file-upload-scripts-square.jpg" />
              </label>
              <input
                id="upload"
                ref="upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(event) => {
                  this.onInput(event.target.files);
                }}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
            </div>
          </span>
        ) : null}
        {!this.state.uploading &&
        !locationLoading &&
        selectedLocation.id === selectedLocationImageReorder ? (
          <span className="imageContainer">
            <div>
              <Button bsStyle="primary" onClick={onOK(0)} block>
                Apply Reordering
              </Button>
              <Button bsStyle="danger" onClick={onCancel(0)} block>
                Cancel Reordering
              </Button>
              <Button bsStyle="link" block />
            </div>
          </span>
        ) : null}
        {!this.state.uploading &&
          !locationLoading &&
          (isFIO || isCommand || !selectedLocation.isMine || !canEditImage) &&
          !images && (
            <span className="imageContainer">
              <div>
                <img src="/images/no-image-available.jpg" />
              </div>
            </span>
          )}
        {!this.state.uploading &&
          !locationLoading &&
          (isFIO || isCommand || !selectedLocation.isMine || !canEditImage) &&
          images &&
          images.length < 1 && (
            <span className="imageContainer">
              <div>
                <img src="/images/no-image-available.jpg" />
              </div>
            </span>
          )}
        {images && !locationLoading && !this.state.uploading
          ? images.map((image, index) => (
              <Image
                src={
                  image.hrefThumbnail === "NoImage"
                    ? "/images/pdf-thumbnail.png"
                    : image.hrefThumbnail + "?" + changeCounter
                }
                key={index}
                reorder={selectedLocation.id === selectedLocationImageReorder}
                extremeleft={index === 0}
                extremeright={index === images.length - 1}
                onImageClick={onSelection(index)}
                onAnnotationClick={onAnnotation(index)}
                onTaggingClick={onTagging(index)}
                onDeleteClick={onDelete(index)}
                onLeftClick={onLeft(index)}
                onRightClick={onRight(index)}
                onOKClick={onOK(index)}
                pdfFileName={
                  image.hrefThumbnail === "NoImage" ? image.title : " "
                }
                canEditImage={canEditImage && image.hrefThumbnail !== "NoImage"}
                isPDF={image.hrefThumbnail === "NoImage"}
                isFIO={isFIO}
                isCommand={isCommand}
                isMine={selectedLocation.isMine}
              />
            ))
          : null}
      </Dropzone>
    );
  }
}
