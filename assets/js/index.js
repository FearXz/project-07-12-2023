const URL = "https://striveschool-api.herokuapp.com/api/product/";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMWQ5NTBkOGEyMDAwMThhNDhiNWIiLCJpYXQiOjE3MDE5Nzc0OTMsImV4cCI6MTcwMzE4NzA5M30.XcUjPWMghfRZrDIYh52I3pe1thgVFA-9sfhfL_wGyIk";
let path = "./product.html?productId=";
let isActive = false;
let searchArray = [];
window.addEventListener("DOMContentLoaded", () => {
  checkDeleted();

  isLoading(true);

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

    .then((arrayProductsObj) => {
      localStorage.setItem("lastArrayUsed", JSON.stringify(arrayProductsObj));

      let editBtnMode = document.getElementById("editMode");
      editBtnMode.addEventListener("click", handleEdit);

      let searchForm = document.getElementById("searchForm");
      searchForm.addEventListener("submit", (event) => {
        handleSearchSubmit(event, arrayProductsObj);
      });

      generateProductList(arrayProductsObj);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading(false);
    });
});
function generateProductList(arrayProductsObj, editCode) {
  let itemContainer = document.querySelector(".list-group");
  itemContainer.innerHTML = "";

  arrayProductsObj.forEach((product) => {
    let newProduct = createProduct(product, editCode);
    itemContainer.appendChild(newProduct);
  });
}
function createProduct(product, editCode) {
  let pageLink = path;

  let mainDiv = document.createElement("div");
  mainDiv.className = "d-flex align-item-center mb-2 " + editCode;

  let linkNode = document.createElement("a");
  linkNode.href = pageLink + product._id;
  linkNode.className = "list-group-item list-group-item-action d-flex align-items-center";

  let div1 = document.createElement("div");

  let imgNode = document.createElement("img");
  imgNode.className = "fix-h-50 fix-w-50 object-fit-cover me-2";
  imgNode.src = product.imageUrl;
  imgNode.alt = "productImage";

  div1.appendChild(imgNode);
  linkNode.appendChild(div1);

  let div2 = document.createElement("div");

  let boldNode = document.createElement("b");
  boldNode.textContent = product.name;
  boldNode.className = "me-2";

  div2.appendChild(boldNode);
  linkNode.appendChild(div2);

  let div3 = document.createElement("div");

  let spanNode = document.createElement("span");
  spanNode.className = "overflow-hidden";
  spanNode.textContent = product.description;

  div3.appendChild(spanNode);
  linkNode.appendChild(div3);

  mainDiv.appendChild(linkNode);

  return mainDiv;
}
function isLoading(boolean) {
  const spinner = document.querySelector(".spinner-border");
  if (boolean) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
}
function checkDeleted() {
  const deletedJson = localStorage.getItem("deletedProduct");
  if (deletedJson != "") {
    const deletedObj = JSON.parse(localStorage.getItem("deletedProduct"));
    showAlert("Product: " + deletedObj.name + " id: " + deletedObj._id + "has been eliminated", "danger");
    localStorage.setItem("deletedProduct", "");
  }
}
function showAlert(message, colorCode = "primary") {
  const resultDiv = document.getElementById("resultAlert");

  resultDiv.innerHTML = `
  <div class="alert alert-${colorCode}" role="alert">
    ${message}
  </div>`;

  setTimeout(() => {
    resultDiv.innerHTML = "";
  }, 3000);
}
function handleSearchSubmit(event, arrayProductsObj) {
  event.preventDefault();
  searchArray = [];
  if (isActive) {
    showAlert("Cannot use search function while in Edit Mode ", "danger");
  } else {
    let inputSearch = document.getElementById("inputSearch").value;
    arrayProductsObj.forEach((product) => {
      if (product.name.toLowerCase().includes(inputSearch.toLowerCase())) {
        searchArray.push(product);
        console.log(searchArray);
      }
    });
    localStorage.setItem("lastArrayUsed", JSON.stringify(searchArray));
    generateProductList(searchArray);
  }
}
function handleEdit() {
  let arrayToCheck = JSON.parse(localStorage.getItem("lastArrayUsed"));
  isActive = !isActive;

  if (isActive) {
    path = "./backoffice.html?productId=";
    generateProductList(arrayToCheck, "border border-5 border-success");
  } else {
    path = "./product.html?productId=";
    generateProductList(arrayToCheck);
  }
}
