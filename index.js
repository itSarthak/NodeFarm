const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate.js");
const { parse: parseQuery } = require("querystring");
const slugify = require("slugify");
///////Files
//Blocking, Synchronous way
// const txtIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(txtIn);
// const textOut = `this is what we know about the avocado ${txtIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("Files Written");

// //Non-Blocking, Asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written.");
//       });
//     });
//   });
// });
// console.log("Will read this!");

///////Server
// const server = http.createServer((req, res) => {
//   res.end("Hello from the server!");
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to requests on port 8000");
// });

///////ROUTING

//Add Synchronous function to save the content as it is on top of the code and the output will be saved as soon as the server starts. No need to call the read function again and again
// Reads the template-overview.html file
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

// Reads the template-card.html
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// Reads the template-product.html
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// Reads the data from data.json file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// Parse it into readable data
const dataObj = JSON.parse(data);

// Creating slugs
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// Create a server
const server = http.createServer((req, res) => {
  // console.log(req.url); //print the url request
  // console.log(url.parse(req.url, true)); // true argument is passed to also print the query argument in the url
  const { query, pathname } = url.parse(req.url, true); // Selecting two elements from the req.url

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" }); // Respond the browser that the data sent is html
    // we create an array of objects (by .map() method) that contains all the product cards with replaced placeholders
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el)) //replaceTemplate is a function that replaces all the placeholders in the code
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(400, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not Found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
