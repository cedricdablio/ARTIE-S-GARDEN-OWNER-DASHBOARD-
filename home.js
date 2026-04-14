function searchPlant(event) {
    event.preventDefault();

    let query = document.getElementById("searchInput").value;

    if (query.trim() !== "") {
        window.location.href = "products.html?search=" + encodeURIComponent(query);
    }
}