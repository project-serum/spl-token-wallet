import React from 'react';

const FakeInputs = () => {
  return (
    <>
      <input
        style={{ position: 'fixed', top:'-100px', left: '-100px',  width: '5px' }}
        type="text"
        name="fakeusernameremembered"
      />
      <input
        style={{ position: 'fixed', top:'-100px', left: '-100px',  width: '5px' }}
        type="password"
        name="fakepasswordremembered"
      />
    </>
  );
};

export default FakeInputs;
