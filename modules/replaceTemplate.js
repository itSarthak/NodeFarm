// Replacing all the placeholders in the template-card.html

module.exports = (temp, product) => {
  //temp = placeholder, product =  the new data
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // It is not a good practise to directly modify parameter that's why new variable
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
