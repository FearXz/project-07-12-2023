const URL = "https://striveschool-api.herokuapp.com/api/product/";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMWQ5NTBkOGEyMDAwMThhNDhiNWIiLCJpYXQiOjE3MDE5Nzc0OTMsImV4cCI6MTcwMzE4NzA5M30.XcUjPWMghfRZrDIYh52I3pe1thgVFA-9sfhfL_wGyIk";

window.addEventListener("DOMContentLoaded", () => {
  fetch(URL, { headers: { Authorization: authToken } })
    .then((serverResponse) => {
      if (serverResponse.status === 404) {
        throw new Error("Errore, risorsa non trovata");
      }
      if (serverResponse.status >= 400 && serverResponse.status < 500) {
        throw new Error("Errore lato Client");
      }
      if (serverResponse.status >= 500 && serverResponse.status < 600) {
        throw new Error("Errore lato Server");
      }
      if (!serverResponse.ok) {
        throw new Error("Errore nel reperimento dei dati");
      }

      return serverResponse.json();
    })
    .then((ProductsObj) => {
      let itemContainer = document.querySelector(".list-group");

      ProductsObj.forEach((product) => {
        let newProduct = createHtmlProduct(product);
        itemContainer.appendChild(newProduct);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {});
});
/* {
            "name":"Nokia 3010",
            "description": "indestructible cellphone",
            "brand":"nokia",
            "imageUrl":"https://m.media-amazon.com/images/I/614r6gJOBeL.jpg",
            "price":30
         } */
function createHtmlProduct(product) {
  let productPageLink = "./product.html?productId=";

  let linkNode = document.createElement("a");
  linkNode.href = productPageLink + product._id;
  linkNode.className = "list-group-item list-group-item-action mb-2";

  let imgNode = document.createElement("img");
  imgNode.className = "fix-h-50 fix-w-50 object-fit-cover me-2";
  imgNode.src = "https://m.media-amazon.com/images/I/614r6gJOBeL.jpg";
  imgNode.alt = "productImage";

  let boldNode = document.createElement("b");
  boldNode.textContent = product.name;
  boldNode.className = "me-2";

  let spanNode = document.createElement("span");
  spanNode.textContent = product.description;

  linkNode.appendChild(imgNode);

  linkNode.appendChild(boldNode);

  linkNode.appendChild(spanNode);
  return linkNode;
}
