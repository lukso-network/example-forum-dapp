import Modal from 'react-modal';
import { useState } from 'react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Loader = ({ name, loading, setLoading, onIpfs, postOnSC }) => {
  const [error, setError] = useState('');

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const closeModal = (error) => {
    setLoading(false);
    setError('');
  };

  return (
    <Modal
      isOpen={loading}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      {error ? (
        <>
          <div style={{ color: 'red' }}>{error}</div>
          <button onClick={closeModal()}>Close</button>
        </>
      ) : null}
      {onIpfs ? (
        <div>{capitalizeFirstLetter(name)} pushed to ipfs sucessfully</div>
      ) : (
        <div>Pushing {name} to IPFS...</div>
      )}
      {onIpfs && postOnSC ? (
        <div>
          {capitalizeFirstLetter(name)} pushed to smart contract successfully
        </div>
      ) : (
        <div>Pushing {name} to smart contract...</div>
      )}
    </Modal>
  );
};

export default Loader;
