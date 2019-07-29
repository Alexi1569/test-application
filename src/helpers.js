export const stringPriceToInt = priceInString => {
  return parseInt(priceInString.replace(',', '').replace(' ', ''), 10);
};

export const intPriceToString = priceInInt => {
  const splitedPrice = priceInInt
    .toString(10)
    .split('')
    .reverse();

  const result = [];

  for (let i = 0; i < splitedPrice.length; i++) {
    if (
      (i + 1) % 3 === 0 &&
      i + 1 !== splitedPrice.length &&
      splitedPrice[i + 2] !== ','
    ) {
      result.push(splitedPrice[i]);
      result.push(',');
    } else {
      result.push(splitedPrice[i]);
    }
  }

  return result.reverse().join('');
};
