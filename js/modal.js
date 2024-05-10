// const refs = {
//   openModalBtn: document.querySelector("[data-modal-open]"),
//   closeModalBtn: document.querySelector("[data-modal-close]"),
//   modal: document.querySelector("[data-modal]"),
// };

// refs.openModalBtn.addEventListener("click", toggleModal);
// refs.closeModalBtn.addEventListener("click", toggleModal);

// function toggleModal() {
//   refs.modal.classList.toggle("is-hidden");
// }

// forms

// script.js

document.addEventListener("DOMContentLoaded", () => {
  fetchCats();

  const addCatForm = document.getElementById("add-cat-form");
  const addButton = document.getElementById("add-cat-button");
  addButton.addEventListener("click", () => {
    addCat(addCatForm);
  });

  const updateCatForm = document.getElementById("edit-cat-form");
  const updateButton = document.getElementById("update-cat-button");
  updateButton.addEventListener("click", () => {
    updateCat(updateCatForm);
  });

  const cancelUpdateButton = document.getElementById("cancel-update-button");
  cancelUpdateButton.addEventListener("click", () => {
    cancelUpdateCat(updateCatForm);
  });
});

async function fetchCats() {
  try {
    const response = await fetch("http://localhost:3000/");
    if (!response.ok) {
      throw new Error("Failed to fetch cats");
    }
    const cats = await response.json();
    console.log(cats);
    displayCats(cats);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayCats(cats) {
  const catList = document.getElementById("cat-list");
  catList.innerHTML = "";
  cats.forEach((cat) => {
    const listItem = document.createElement("li");
    listItem.classList.add("cat-item");

    const catInfo = document.createElement("div");
    catInfo.classList.add("cat-info");

    const catImage = document.createElement("img");

    catImage.src = `data:${cat.image.contentType};base64,${cat.image.data}`;

    catInfo.appendChild(catImage);

    // Create text content for cat
    const catText = document.createElement("span");
    catText.textContent = `${cat.name} - ${cat.breed} - ${cat.age} років`;

    // Append text content to catInfo div
    catInfo.appendChild(catText);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("cat-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Редагувати";
    editButton.classList.add("cat-button", "cat-button-edit");
    editButton.addEventListener("click", () => showEditCatForm(cat));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.classList.add("cat-button", "cat-button-delete");
    deleteButton.addEventListener("click", () => deleteCat(cat._id));

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    listItem.appendChild(catInfo);
    listItem.appendChild(buttonsContainer);

    catList.appendChild(listItem);
  });
}

async function addCat(form) {
  const name = form.querySelector("#name").value;
  const breed = form.querySelector("#breed").value;
  const age = form.querySelector("#age").value;
  const image = form.querySelector("#photo").files[0];

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("breed", breed);
    formData.append("age", age);
    formData.append("photo", image);

    const response = await fetch("http://localhost:3000/cats", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add cat");
    }

    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function showEditCatForm(cat) {
  const form = document.getElementById("edit-cat-form");
  form.style.display = "block";
  form.querySelector("#edit-cat-id").value = cat._id;
  form.querySelector("#edit-name").value = cat.name;
  form.querySelector("#edit-breed").value = cat.breed;
  form.querySelector("#edit-age").value = cat.age;
}

async function updateCat(form) {
  const catId = form.querySelector("#edit-cat-id").value;
  const name = form.querySelector("#edit-name").value;
  const breed = form.querySelector("#edit-breed").value;
  const age = form.querySelector("#edit-age").value;

  try {
    const response = await fetch(`http://localhost:3000/update/${catId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, breed, age }),
    });
    if (!response.ok) {
      throw new Error("Failed to update cat");
    }
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function cancelUpdateCat(form) {
  form.style.display = "none";
}

async function deleteCat(catId) {
  try {
    const response = await fetch(`http://localhost:3000/delete/${catId}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to delete cat");
    }
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}
