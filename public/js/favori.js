document.addEventListener("DOMContentLoaded", () => {
  const favoriteImages =
    JSON.parse(localStorage.getItem("favoriteImages")) || [];

  const gallery = document.querySelector(".container");
  favoriteImages.forEach((imageUrl) => {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Favori Duvar Kağıdı";
    img.addEventListener("click", () => showModal(imageUrl));
    gallery.appendChild(img);
  });
});

function showModal(imageUrl) {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("modalImage");
  const downloadButton = document.getElementById("downloadButton");
  modalImg.src = imageUrl;
  downloadButton.href = imageUrl;
  modal.style.display = "block";

  const closeModal = document.querySelector(".close");
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  const deleteButton = document.getElementById("deleteButton");
  deleteButton.onclick = function () {
    const favoriteImages =
      JSON.parse(localStorage.getItem("favoriteImages")) || [];
    const index = favoriteImages.indexOf(imageUrl);
    if (index !== -1) {
      favoriteImages.splice(index, 1);
      localStorage.setItem("favoriteImages", JSON.stringify(favoriteImages));
      modal.style.display = "none";
      window.location.reload();
    }
  };
}
