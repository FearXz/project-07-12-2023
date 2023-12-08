const URL = "https://striveschool-api.herokuapp.com/api/product/";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMWQ5NTBkOGEyMDAwMThhNDhiNWIiLCJpYXQiOjE3MDE5Nzc0OTMsImV4cCI6MTcwMzE4NzA5M30.XcUjPWMghfRZrDIYh52I3pe1thgVFA-9sfhfL_wGyIk";

const parameters = new URLSearchParams(window.location.search);
const productId = parameters.get("productId");

console.log(productId);

window.addEventListener("DOMContentLoaded", () => {
  isLoading(true);
  fetch(URL + productId, { headers: { Authorization: authToken } })
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
    .then((productsObj) => {
      let productContainer = document.getElementById("productContainer");
      let product = productDetail(productsObj);
      productContainer.appendChild(product);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading(false);
    });
});

function productDetail(product) {
  let editPageLink = "./backoffice.html?";
  let parameter = "productId=";
  const rowDiv = document.createElement("div");
  rowDiv.className = "row bg-white rounded-4 py-2";

  const col4Div = document.createElement("div");
  col4Div.className = "col-4 d-flex justify-content-center align-items-center";

  const imgElement = document.createElement("img");
  imgElement.id = "productImage";
  imgElement.className = "object-fit-contain max-h-200 img-fluid";
  imgElement.src = product.imageUrl;
  imgElement.alt = "productImage";

  col4Div.appendChild(imgElement);

  const col8Div = document.createElement("div");
  col8Div.className = "col-8";

  const productName = document.createElement("p");
  productName.className = "h1";
  productName.textContent = product.name;

  const hr1 = document.createElement("hr");

  const productDescription = document.createElement("p");
  productDescription.className = "h5";
  productDescription.textContent = product.description;

  const hr2 = document.createElement("hr");

  const priceContainer = document.createElement("div");
  priceContainer.className = "d-flex justify-content-start align-items-baseline";

  const priceText = document.createElement("p");
  priceText.className = "h5 mb-0 me-auto";
  priceText.textContent = "Prezzo: ";

  const priceValue = document.createElement("span");
  priceValue.className = "h2";
  priceValue.textContent = product.price + "€";

  const editProductLink = document.createElement("p");
  const editProductAnchor = document.createElement("a");
  editProductAnchor.className = "link-offset-2 me-2";
  editProductAnchor.href = editPageLink + parameter + productId;
  editProductAnchor.textContent = "Edit product";
  editProductLink.appendChild(editProductAnchor);

  priceText.appendChild(priceValue);
  priceContainer.appendChild(priceText);
  priceContainer.appendChild(editProductLink);

  col8Div.appendChild(productName);
  col8Div.appendChild(hr1);
  col8Div.appendChild(productDescription);
  col8Div.appendChild(hr2);
  col8Div.appendChild(priceContainer);

  rowDiv.appendChild(col4Div);
  rowDiv.appendChild(col8Div);
  return rowDiv;
}
function isLoading(boolean) {
  const spinner = document.querySelector(".spinner-border");
  if (boolean) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
}
