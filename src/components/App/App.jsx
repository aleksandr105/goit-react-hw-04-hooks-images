import { searchImages } from '../../services/api';
import { SearchBar } from 'components/SearchBar/SearchBar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { HelpText, Wrapper } from './App.styled';
import { LoadMore } from 'components/ButtonLoadMore/LoadMore';
import { Spiner } from 'components/Loader/Loader';
import { useState, useEffect } from 'react';

export const App = () => {
  const [dataGallery, setDataGallery] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalElSearch, setTotalElSearch] = useState(null);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    searchImages(searchQuery, page)
      .then(dataSearch => {
        if (dataSearch.hits.length === 0) {
          return Promise.reject(
            `Can't find ${searchQuery} :-(, try something else`
          );
        } else {
          setTotalElSearch(dataSearch.totalHits);
          setDataGallery(prev => [...prev, ...dataSearch.hits]);
          setError(null);
        }
      })
      .catch(error => setError(error))
      .finally(() => setStatus('resolved'));
  }, [page, searchQuery]);

  const onSearch = ({ searchData }, { resetForm }) => {
    if (searchData.trim() === '') {
      alert('Please enter a query keyword');
      return;
    }

    if (searchData === searchQuery) {
      alert('request is the same as before');
      return;
    }

    setTotalElSearch(null);
    setPage(1);
    setSearchQuery(searchData);
    setStatus('pending');
    setDataGallery([]);

    resetForm();
  };

  const onLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <Wrapper>
      <SearchBar onSearch={onSearch} />

      {status === 'idle' && (
        <HelpText>
          Please enter a keyword to display a collection of pictures!!!
        </HelpText>
      )}

      {status === 'resolved' && dataGallery.length !== 0 && (
        <ImageGallery dataGalleryArray={dataGallery} />
      )}

      {status === 'pending' && <Spiner />}

      {error && <HelpText>{error}</HelpText>}

      {dataGallery.length < totalElSearch && status !== 'pending' && (
        <LoadMore onLoadMore={onLoadMore} />
      )}
    </Wrapper>
  );
};
