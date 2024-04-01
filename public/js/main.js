document.addEventListener("DOMContentLoaded", () => {
  fetch("/cloudinary-images")
    .then((response) => response.json())
    .then((images) => {
      const imageContainer = document.getElementById("imageContainer");
      images.forEach((image) => {
        const img = document.createElement("img");
        img.src = image.secure_url;
        img.alt = "Duvar Kağıdı";
        img.addEventListener("click", () => showModal(image.secure_url));
        imageContainer.appendChild(img);
      });
      document.getElementById(
        "imageCount"
      ).textContent = `Toplam resim sayısı: ${images.length}`;
    });
});

function showModal(imageUrl) {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("modalImage");
  const dwImage = document.getElementById("dwImage");
  const downloadButton = document.getElementById("downloadButton");

  modalImg.src = imageUrl;
  downloadButton.href = imageUrl;

  modal.style.display = "block";
  document.body.style.overflow = "hidden"; 

  const closeModal = document.getElementsByClassName("close")[0];
  closeModal.onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  const heartBtn = document.querySelector(".heart");
  heartBtn.addEventListener("click", function () {
    const imageUrl = modalImg.src; 
    const storedImages =
      JSON.parse(localStorage.getItem("favoriteImages")) || []; 
    if (!storedImages.includes(imageUrl)) {
      storedImages.push(imageUrl); 
      localStorage.setItem("favoriteImages", JSON.stringify(storedImages)); 
      alert("Resim favorilere eklendi!");
    } else {
      alert("Bu resim zaten favorilere eklenmiş!");
    }
  });
}
