// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId, clickedButton = null) {
    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach((button) => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {
        const pageMap = {
            homePage: 0,
            menuPage: 1,
            promoPage: 2,
            contactPage: 3
        };

        const index = pageMap[pageId];

        if (navButtons[index]) {
            navButtons[index].classList.add("active");
        }
    }

    window.scrollTo(0, 0);
}


// ===============================
// GOOGLE SHEETS LINKS
// ===============================

const MENU_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1jJEVNs3uhxNx82CJ4N7oMOI3njrrTAflUdxlz7QtCTBHFAlm2XQu6-UEJwGJ69wrnIlYikDsvRk3/pub?gid=1562662256&single=true&output=csv";

const PROMOTION_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1jJEVNs3uhxNx82CJ4N7oMOI3njrrTAflUdxlz7QtCTBHFAlm2XQu6-UEJwGJ69wrnIlYikDsvRk3/pub?gid=226753387&single=true&output=csv";


// ===============================
// CSV PARSER
// ===============================

function parseCSVLine(line) {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            values.push(current.replace(/^"|"$/g, "").trim());
            current = "";
        } else {
            current += char;
        }
    }

    values.push(current.replace(/^"|"$/g, "").trim());

    return values;
}


// ===============================
// LOAD MENU FROM GOOGLE SHEETS
// ===============================

async function loadMenu() {
    const menuList = document.getElementById("menuList");

    if (!menuList) {
        return;
    }

    menuList.innerHTML = `
        <div class="food-card">
            <div class="food-details">
                <h3>Loading menu...</h3>
            </div>
        </div>
    `;

    try {
        const response = await fetch(MENU_CSV_URL, {
            cache: "no-store"
        });

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let menuHTML = "";

        rows.forEach((line) => {
            const columns = parseCSVLine(line);

            const productName = columns[1] || "";
            const category = columns[2] || "";
            const price = columns[3] || "";
            const image = columns[4] || "";
            const status = (columns[5] || "").toLowerCase();

            if (status !== "active") {
                return;
            }

            menuHTML += `
                <div
                    class="food-card menu-item"
                    data-category="${category.toLowerCase()}"
                    data-name="${productName.toLowerCase()}"
                >
                    <img
                        src="images/${image}"
                        alt="${productName}"
                    >

                    <div class="food-details">

                        <span class="food-category">
                            ${category}
                        </span>

                        <h3>
                            ${productName}
                        </h3>

                        <p>
                            Available at Qiessert Bites.
                        </p>

                        <div class="food-bottom">

                            <strong>
                                RM${price}
                            </strong>

                            <a
    href="https://api.whatsapp.com/send?phone=60148584207&text=Hi%20Qiessert%20Bites%2C%20saya%20nak%20order%20${encodeURIComponent(productName)}"
    class="small-order-btn"
    target="_blank"
>
    Order
</a>

                        </div>

                    </div>

                </div>
            `;
        });

        if (menuHTML === "") {
            menuList.innerHTML = `
                <div class="food-card">
                    <div class="food-details">
                        <h3>No Menu Available</h3>
                        <p>Please check again later.</p>
                    </div>
                </div>
            `;
        } else {
            menuList.innerHTML = menuHTML;
        }

    } catch (error) {
        console.error("MENU ERROR:", error);

        menuList.innerHTML = `
            <div class="food-card">
                <div class="food-details">
                    <h3>Menu unavailable</h3>
                    <p>Please try again later.</p>
                </div>
            </div>
        `;
    }
}


// ===============================
// LOAD POPULAR MENU ON HOME
// ===============================

async function loadPopularMenu() {
    const popularMenu = document.getElementById("popularMenu");

    if (!popularMenu) {
        return;
    }

    try {
        const response = await fetch(MENU_CSV_URL, {
            cache: "no-store"
        });

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let popularHTML = "";
        let count = 0;

        rows.forEach((line) => {
            if (count >= 3) {
                return;
            }

            const columns = parseCSVLine(line);

            const productName = columns[1] || "";
            const category = columns[2] || "";
            const price = columns[3] || "";
            const image = columns[4] || "";
            const status = (columns[5] || "").toLowerCase();

            if (status !== "active") {
                return;
            }

            popularHTML += `
                <div class="popular-card">

                    <img
                        src="images/${image}"
                        alt="${productName}"
                    >

                    <div class="popular-info">

                        <h3>
                            ${productName}
                        </h3>

                        <p>
                            ${category}
                        </p>

                        <strong>
                            RM${price}
                        </strong>

                    </div>

                </div>
            `;

            count++;
        });

        popularMenu.innerHTML = popularHTML;

    } catch (error) {
        console.error("POPULAR MENU ERROR:", error);
    }
}


// ===============================
// MENU CATEGORY FILTER
// ===============================

function filterMenu(category, clickedButton) {
    document.querySelectorAll(".category-btn").forEach((button) => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    document.querySelectorAll(".menu-item").forEach((item) => {
        if (
            category === "all" ||
            item.dataset.category === category
        ) {
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


// ===============================
// MENU SEARCH
// ===============================

function searchMenu() {
    const searchInput = document.getElementById("menuSearch");

    if (!searchInput) {
        return;
    }

    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    document.querySelectorAll(".menu-item").forEach((item) => {
        const name = item.dataset.name || "";

        if (name.includes(keyword)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}


// ===============================
// LOAD PROMOTION PAGE
// ===============================

async function loadPromotions() {
    const container = document.getElementById("promotionList");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="promotion-card">
            <div class="promotion-icon">
                ⏳
            </div>

            <div>
                <h3>
                    Loading promotion...
                </h3>
            </div>
        </div>
    `;

    try {
        const response = await fetch(PROMOTION_CSV_URL, {
            cache: "no-store"
        });

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let promotionHTML = "";

        rows.forEach((line) => {
            const columns = parseCSVLine(line);

            const title = columns[1] || "";
            const description = columns[2] || "";
            const status = (columns[3] || "").toLowerCase();

            if (status !== "active") {
                return;
            }

            promotionHTML += `
                <div class="promotion-card">

                    <div class="promotion-icon">
                        🎁
                    </div>

                    <div>

                        <span>
                            Latest Promotion
                        </span>

                        <h3>
                            ${title}
                        </h3>

                        <p>
                            ${description}
                        </p>

                    </div>

                </div>
            `;
        });

        if (promotionHTML === "") {
            container.innerHTML = `
                <div class="promotion-card">

                    <div class="promotion-icon">
                        🎁
                    </div>

                    <div>
                        <h3>No Promotion Available</h3>
                        <p>Please check again later.</p>
                    </div>

                </div>
            `;
        } else {
            container.innerHTML = promotionHTML;
        }

    } catch (error) {
        console.error("PROMOTION ERROR:", error);

        container.innerHTML = `
            <div class="promotion-card">

                <div class="promotion-icon">
                    ⚠️
                </div>

                <div>
                    <h3>Promotion unavailable</h3>
                    <p>Please try again later.</p>
                </div>

            </div>
        `;
    }
}


// ===============================
// LOAD TODAY'S PROMOTION ON HOME
// ===============================

async function loadHomePromotion() {
    const homePromotion = document.getElementById("homePromotion");

    if (!homePromotion) {
        return;
    }

    homePromotion.innerHTML = `
        <div>
            <span>
                ⏳ Loading
            </span>

            <h3>
                Loading latest promotion...
            </h3>
        </div>
    `;

    try {
        const response = await fetch(PROMOTION_CSV_URL, {
            cache: "no-store"
        });

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let firstActivePromotion = null;

        for (const line of rows) {
            const columns = parseCSVLine(line);

            const title = columns[1] || "";
            const description = columns[2] || "";
            const status = (columns[3] || "").toLowerCase();

            if (status === "active") {
                firstActivePromotion = {
                    title,
                    description
                };

                break;
            }
        }

        if (!firstActivePromotion) {
            homePromotion.innerHTML = `
                <div>
                    <span>
                        🎁 Promotion
                    </span>

                    <h3>
                        No Promotion Available
                    </h3>

                    <p>
                        Please check again later.
                    </p>
                </div>

                <button onclick="showPage('promoPage')">
                    View Promo
                </button>
            `;

            return;
        }

        homePromotion.innerHTML = `
            <div>

                <span>
                    🔥 Latest Offer
                </span>

                <h3>
                    ${firstActivePromotion.title}
                </h3>

                <p>
                    ${firstActivePromotion.description}
                </p>

            </div>

            <button onclick="showPage('promoPage')">
                View Promo
            </button>
        `;

    } catch (error) {
        console.error("HOME PROMOTION ERROR:", error);

        homePromotion.innerHTML = `
            <div>

                <span>
                    ⚠️ Promotion
                </span>

                <h3>
                    Promotion unavailable
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;
    }
}


// ===============================
// START APP
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    showPage("homePage");

    loadMenu();

    loadPopularMenu();

    loadPromotions();

    loadHomePromotion();
});