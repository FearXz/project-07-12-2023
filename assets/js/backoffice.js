//GLOBAL SCOPE
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMWQ5NTBkOGEyMDAwMThhNDhiNWIiLCJpYXQiOjE3MDE5Nzc0OTMsImV4cCI6MTcwMzE4NzA5M30.XcUjPWMghfRZrDIYh52I3pe1thgVFA-9sfhfL_wGyIk";

const parameters = new URLSearchParams(window.location.search);
const productId = parameters.get("productId");
const urlApi = "https://striveschool-api.herokuapp.com/api/product/";
console.log(productId);

const URL = productId ? urlApi + productId : urlApi;
console.log(URL);
const method = productId ? "PUT" : "POST";
console.log(method);

// WINDOWS ONLOAD SCOPE
window.addEventListener("DOMContentLoaded", () => {
  let submit = document.getElementById("myForm");
  submit.addEventListener("submit", handleSubmit);

  /*PUT MODE*/
  if (productId) {
    goEditMode();

    isLoading(true);

    fetchDataEditMode();
  }
});
//GLOBAL SCOPE
function goEditMode() {
  const submitBtn = document.getElementById("submitButton");
  const deleteBtn = document.getElementById("deleteButton");
  const actionTypeText = document.getElementById("actionType");

  actionTypeText.textContent = "Edit Product";

  submitBtn.value = "Edit Product";
  submitBtn.classList.remove("btn-primary");
  submitBtn.classList.add("btn-success");

  deleteBtn.classList.remove("d-none");

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", () => {
    fetchDeleteProduct();
  });
}
function fetchDataEditMode() {
  fetch(URL, { headers: { Authorization: authToken } })
    .then((serverResponse) => {
      if (serverResponse.status === 404) throw new Error("Errore, risorsa non trovata");
      if (serverResponse.status >= 400 && response.status < 500) throw new Error("Errore lato Client");
      if (serverResponse.status >= 500 && response.status < 600) throw new Error("Errore lato Server");
      if (!serverResponse.ok) throw new Error("Errore nel reperimento dei dati");

      return serverResponse.json();
    })
    .then((EditableObj) => {
      let productName = document.querySelector(".modal-title");
      productName.innerHTML = "Deleting " + EditableObj.name;

      let confirmMessage = document.querySelector(".modal-body p");
      confirmMessage.innerHTML = "Do you want to remove " + EditableObj.name + " ?";

      console.log(EditableObj);
      document.getElementById("productName").value = EditableObj.name;
      document.getElementById("productDescription").value = EditableObj.description;
      document.getElementById("brand").value = EditableObj.brand;
      document.getElementById("imgUrl").value = EditableObj.imageUrl;
      document.getElementById("price").value = EditableObj.price;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading(false);
    });
}
function handleSubmit(event) {
  event.preventDefault();

  const newProduct = {
    name: document.getElementById("productName").value,
    description: document.getElementById("productDescription").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("imgUrl").value,
    price: document.getElementById("price").value,
  };
  console.log(newProduct);
  isLoading(true);
  fetch(URL, {
    method: method,
    body: JSON.stringify(newProduct),
    headers: { "Content-Type": "application/json", Authorization: authToken },
  })
    .then((serverResponse) => {
      if (serverResponse.status === 400) throw new Error("Product already exist");
      if (serverResponse.status === 404) throw new Error("Error, resource not found");
      if (serverResponse.status >= 400 && serverResponse.status < 500) throw new Error("Client Error");
      if (serverResponse.status >= 500 && serverResponse.status < 600) throw new Error("Server Error");
      if (!serverResponse.ok) throw new Error("Error retrieving data");

      return serverResponse.json();
    })
    .then((productObj) => {
      if (!productId) {
        showAlert("Product: " + productObj._id + " has been added");
        resetForm();
      }
      if (productId) {
        showAlert("Product: " + productObj._id + " has been modified", "success");
      }
    })
    .catch((error) => {
      showAlert(error.message, "danger");
      console.log(error);
    })
    .finally(() => {
      isLoading(false);
    });
}
function fetchDeleteProduct() {
  isLoading(true);

  fetch(URL, { method: "DELETE", headers: { Authorization: authToken } })
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
    .then((deletedObj) => {
      localStorage.setItem("deletedProduct", JSON.stringify(deletedObj));
      showAlert("Product: " + deletedObj.name + " id: " + deletedObj._id + "has been eliminated", "danger");
      window.location.assign("./index.html");
    })
    .finally(() => {
      isLoading(false);
    });
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
function resetForm() {
  document.getElementById("productName").value = "";
  document.getElementById("productDescription").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("imgUrl").value = "";
  document.getElementById("price").value = "";
}
function isLoading(boolean) {
  const spinner = document.querySelector(".spinner-border");

  if (boolean) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
}
