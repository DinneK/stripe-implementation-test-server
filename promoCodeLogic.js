const promoCodeDiscounts = {
  CODE123: 10000,
  SAVE50: 20000,
};

function calculateDiscount(promoCode) {
  if (promoCodeDiscounts.hasOwnProperty(promoCode)) {
    return promoCodeDiscounts[promoCode];
  }
  return 0;
}

module.exports = {
  calculateDiscount,
};
