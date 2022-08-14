import { searchImages } from '../../services/api';
import { SearchBar } from 'components/SearchBar/SearchBar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { HelpText, Wrapper } from './App.styled';
import { LoadMore } from 'components/ButtonLoadMore/LoadMore';
import { Spiner } from 'components/Loader/Loader';
import { useEffect, useState } from 'react';

export const App = () => {
  const [dataGallery, setDataGallery] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [totalElSearch, setTotalElSearch] = useState(null);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState('');

  const onSearch = ({ searchData }, { resetForm }) => {
    if (searchData.trim() === '') {
      alert('Please enter a query keyword');
      return;
    }

    setSearchData(searchData);
    setStatus('pending');
    setPage(1);

    searchImages(searchData, page)
      .then(dataSearch => {
        if (dataSearch.hits.length === 0) {
          return Promise.reject(
            `Can't find ${searchData} :-(, try something else`
          );
        } else {
          setTotalElSearch(dataSearch.totalHits);
          setDataGallery(dataSearch.hits);
          setError(null);
        }
      })
      .catch(error => setError(error))
      .finally(setStatus('resolved'));

    resetForm();
  };

  useEffect(() => {
    if (page === 1) {
      return;
    }
    setStatus('pending');

    searchImages(searchData, page)
      .then(dataSearch => {
        setDataGallery(prevState => [...prevState, ...dataSearch.hits]);
      })
      .finally(setStatus('resolved'));

    return () => {
      setDataGallery([]);
      setPage(1);
      setTotalElSearch(null);
    };
  }, [page, searchData]);

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
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

      {dataGallery.length < totalElSearch && (
        <LoadMore onLoadMore={onLoadMore} />
      )}
    </Wrapper>
  );
};
