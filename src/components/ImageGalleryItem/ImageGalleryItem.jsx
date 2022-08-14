import { ImageGalleryItem, GalleryItemPhoto } from './ImageGalleryItem.styled';
import { Modal } from 'components/Modal/Modal';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const GalleryItem = ({ dataGallery }) => {
  const [showModal, setShowModal] = useState(null);

  const openModal = e => {
    setShowModal(Number(e.target.id));
  };

  const closeModal = e => {
    const keyDown = e.code;
    if (keyDown === 'Escape') {
      setShowModal(null);
    }
  };

  return dataGallery.map(({ id, webformatURL, largeImageURL, tags }) => (
    <ImageGalleryItem key={id} onClick={openModal}>
      <GalleryItemPhoto src={webformatURL} alt={tags} id={id} />

      {showModal === id && (
        <Modal showModal={closeModal}>
          <img src={largeImageURL} alt={tags} id={id} />
        </Modal>
      )}
    </ImageGalleryItem>
  ));
};

GalleryItem.propTypes = {
  dataGalleryArray: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    })
  ),
};
