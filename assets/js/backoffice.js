//GLOBAL SCOPE
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyMWQ5NTBkOGEyMDAwMThhNDhiNWIiLCJpYXQiOjE3MDE5Nzc0OTMsImV4cCI6MTcwMzE4NzA5M30.XcUjPWMghfRZrDIYh52I3pe1thgVFA-9sfhfL_wGyIk";

const parameters = new URLSearchParams(window.location.search);
const productId = parameters.get("productId");
console.log(productId);

const URL = productId
  ? "https://striveschool-api.herokuapp.com/api/product/" + productId
  : "https://striveschool-api.herokuapp.com/api/product/";
console.log(URL);

const method = productId ? "PUT" : "POST";
console.log(method);
// WINDOWS ONLOAD SCOPE
window.addEventListener("DOMContentLoaded", () => {
  if (!productId) {
    let submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", handleSubmit);
  }
});

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

  fetch(URL, {
    method: method,
    body: JSON.stringify(newProduct),
    headers: { "Content-Type": "application/json", Authorization: authToken },
  })
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
    .then((productObj) => {
      showAlert("Prodotto: " + productObj._id + " aggiunto con successo!");
      resetForm();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {});
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
