const priceFormatter = (price) => {
  return (
    'Rp ' +
    parseFloat(price)
      .toFixed()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  );
};

export default priceFormatter;
