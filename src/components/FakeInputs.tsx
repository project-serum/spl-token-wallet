import React from 'react';

const FakeInputs = () => {
  return (
    <>
      <input
        style={{ display: 'none' }}
        type="text"
        name="fakeusernameremembered"
      />
      <input
        style={{ display: 'none' }}
        type="password"
        name="fakepasswordremembered"
      />
    </>
  );
};

export default FakeInputs;
