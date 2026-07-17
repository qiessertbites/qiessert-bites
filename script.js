function showPage(pageId, clickedButton = null) {
    const pages = document.querySelectorAll(".page");
    const navButtons = document.querySelectorAll(".nav-btn");

    pages.forEach((page) => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    navButtons.forEach((button) => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {
        if (pageId === "homePage") {
            navButtons[0].classList.add("active");
        }

        if (pageId === "menuPage") {
            navButtons[1].classList.add("active");
        }

        if (pageId === "promoPage") {
            navButtons[2].classList.add("active");
        }

        if (pageId === "contactPage") {
            navButtons[3].classList.add("active");
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function filterMenu(category, clickedButton) {
    const menuItems = document.querySelectorAll(".menu-item");
    const categoryButtons = document.querySelectorAll(".category-btn");

    categoryButtons.forEach((button) => {
        button.classList.remove("active");
    });

    clickedButton.classList.add("active");

    menuItems.forEach((item) => {
        const itemCategory = item.dataset.category;

        if (category === "all" || itemCategory === category) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });

    const searchInput = document.getElementById("menuSearch");

    if (searchInput) {
        searchInput.value = "";
    }
}


function searchMenu() {
    const searchInput = document.getElementById("menuSearch");
    const menuItems = document.querySelectorAll(".menu-item");

    const searchValue = searchInput.value.toLowerCase().trim();

    menuItems.forEach((item) => {
        const menuName = item.dataset.name.toLowerCase();

        if (menuName.includes(searchValue)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    showPage("homePage");
});
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("Service Worker registered");
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    });
}