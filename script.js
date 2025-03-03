document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("images.json");
    const images = await response.json();
    const gallery = document.getElementById("gallery");

    gallery.innerHTML = images.map(img => `<img src="${img}" loading="lazy">`).join("");
});
