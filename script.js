// ===============================
// GOOGLE SHEETS LINKS
// ===============================

const MENU_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1jJEVNs3uhxNx82CJ4N7oMOI3njrrTAflUdxlz7QtCTBHFAlm2XQu6-UEJwGJ69wrnIlYikDsvRk3/pub?gid=1562662256&single=true&output=csv";

const PROMOTION_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1jJEVNs3uhxNx82CJ4N7oMOI3njrrTAflUdxlz7QtCTBHFAlm2XQu6-UEJwGJ69wrnIlYikDsvRk3/pub?gid=226753387&single=true&output=csv";

const SERVICES_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1jJEVNs3uhxNx82CJ4N7oMOI3njrrTAflUdxlz7QtCTBHFAlm2XQu6-UEJwGJ69wrnIlYikDsvRk3/pub?gid=21556612&single=true&output=csv";


// ===============================
// PAGE NAVIGATION
// ===============================

async function showPage(pageId, clickedButton = null) {

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

    // Refresh data automatically according to page

    if (pageId === "homePage") {
        await loadHomePromotion();
    }

    if (pageId === "menuPage") {
        await loadMenu();
    }

    if (pageId === "promoPage") {
        await loadPromotions();
    }

    if (pageId === "servicesPage") {
        await loadServices();
    }

    window.scrollTo(0, 0);
}


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

            values.push(
                current.replace(/^"|"$/g, "").trim()
            );

            current = "";

        } else {

            current += char;
        }
    }

    values.push(
        current.replace(/^"|"$/g, "").trim()
    );

    return values;
}


// ===============================
// LOAD MENU
// ===============================

async function loadMenu() {

    const menuList =
        document.getElementById("menuList");

    if (!menuList) return;

    try {

        const response = await fetch(
            MENU_CSV_URL + "&t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let menuHTML = "";

        rows.forEach((line) => {

            const columns =
                parseCSVLine(line);

            const productName =
                columns[1] || "";

            const category =
                columns[2] || "";

            const price =
                columns[3] || "";

            const image =
                columns[4] || "";

            const status =
                (columns[5] || "").toLowerCase();

            if (status !== "active") return;

            menuHTML += `
                <div
                    class="food-card menu-item"
                    data-category="${category.toLowerCase()}"
                    data-name="${productName.toLowerCase()}"
                >

               <img
    src="${image || 'images/no-image.png'}"
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
                                href="https://api.whatsapp.com/send?phone=60183251397&text=${encodeURIComponent(
                                    `Hi Qiessert Bites, saya nak order ${productName}`
                                )}"
                                class="small-order-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Order
                            </a>

                        </div>

                    </div>

                </div>
            `;
        });

        menuList.innerHTML =
            menuHTML ||
            `
                <div class="food-card">

                    <div class="food-details">

                        <h3>
                            No Menu Available
                        </h3>

                        <p>
                            Please check again later.
                        </p>

                    </div>

                </div>
            `;

    } catch (error) {

        console.error(
            "MENU ERROR:",
            error
        );

        menuList.innerHTML = `
            <div class="food-card">

                <div class="food-details">

                    <h3>
                        Unable to Load Menu
                    </h3>

                    <p>
                        Please check your internet connection.
                    </p>

                </div>

            </div>
        `;
    }
}

// ===============================
// MENU FILTER
// ===============================

function filterMenu(category, clickedButton) {

    document
        .querySelectorAll(".category-btn")
        .forEach((button) => {

            button.classList.remove("active");
        });

    if (clickedButton) {

        clickedButton.classList.add("active");
    }

    document
        .querySelectorAll(".menu-item")
        .forEach((item) => {

            item.style.display =
                category === "all" ||
                item.dataset.category === category
                    ? "flex"
                    : "none";
        });

    const searchInput =
        document.getElementById("menuSearch");

    if (searchInput) {

        searchInput.value = "";
    }
}


// ===============================
// MENU SEARCH
// ===============================

function searchMenu() {

    const searchInput =
        document.getElementById("menuSearch");

    if (!searchInput) return;

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();

    document
        .querySelectorAll(".menu-item")
        .forEach((item) => {

            const name =
                item.dataset.name || "";

            item.style.display =
                name.includes(keyword)
                    ? "flex"
                    : "none";
        });
}


// ===============================
// LOAD PROMOTION PAGE
// ===============================

async function loadPromotions() {

    const promotionList =
        document.getElementById("promotionList");

    if (!promotionList) return;

    try {

        const response = await fetch(
            PROMOTION_CSV_URL + "&t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let promotionHTML = "";

        rows.forEach((line) => {

            const columns =
                parseCSVLine(line);

            const title =
                columns[1] || "";

            const description =
                columns[2] || "";

            const status =
                (columns[3] || "").toLowerCase();

            if (status !== "active") return;

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

        promotionList.innerHTML =
            promotionHTML ||
            `
                <div class="promotion-card">

                    <div class="promotion-icon">
                        🎁
                    </div>

                    <div>

                        <h3>
                            No Promotion Available
                        </h3>

                        <p>
                            Please check again later.
                        </p>

                    </div>

                </div>
            `;

    } catch (error) {

        console.error(
            "PROMOTION ERROR:",
            error
        );

        promotionList.innerHTML = `
            <div class="promotion-card">

                <div class="promotion-icon">
                    🎁
                </div>

                <div>

                    <h3>
                        Unable to Load Promotion
                    </h3>

                    <p>
                        Please check your internet connection.
                    </p>

                </div>

            </div>
        `;
    }
}


// ===============================
// LOAD SERVICES
// ===============================

async function loadServices() {

    const servicesList =
        document.getElementById("servicesList");

    if (!servicesList) return;

    try {

        const response = await fetch(
            SERVICES_CSV_URL + "&t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let servicesHTML = "";

        rows.forEach((line) => {

            const columns =
                parseCSVLine(line);

            const serviceName =
                columns[1] || "";

            const description =
                columns[2] || "";

            const status =
                (columns[3] || "").toLowerCase();

            if (status !== "active") return;

            servicesHTML += `
                <div class="promotion-card">

                    <div class="promotion-icon">
                        🎉
                    </div>

                    <div>

                        <span>
                            Service
                        </span>

                        <h3>
                            ${serviceName}
                        </h3>

                        <p>
                            ${description}
                        </p>

                        <a
                            href="https://api.whatsapp.com/send?phone=60183251397&text=${encodeURIComponent(
                                `Hi Qiessert Bites, saya nak tanya pasal ${serviceName}`
                            )}"
                            class="small-order-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Enquire
                        </a>

                    </div>

                </div>
            `;
        });

        servicesList.innerHTML =
            servicesHTML ||
            `
                <div class="promotion-card">

                    <div class="promotion-icon">
                        🎉
                    </div>

                    <div>

                        <h3>
                            No Services Available
                        </h3>

                        <p>
                            Please check again later.
                        </p>

                    </div>

                </div>
            `;

    } catch (error) {

        console.error(
            "SERVICES ERROR:",
            error
        );

        servicesList.innerHTML = `
            <div class="promotion-card">

                <div class="promotion-icon">
                    🎉
                </div>

                <div>

                    <h3>
                        Unable to Load Services
                    </h3>

                    <p>
                        Please check your internet connection.
                    </p>

                </div>

            </div>
        `;
    }
}


// ===============================
// LOAD HOME PROMOTION
// ===============================

async function loadHomePromotion() {

    const homePromotion =
        document.getElementById("homePromotion");

    if (!homePromotion) return;

    try {

        const response = await fetch(
            PROMOTION_CSV_URL + "&t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        const text = await response.text();

        const rows = text
            .trim()
            .split(/\r?\n/)
            .slice(1);

        let promotion = null;

        for (const line of rows) {

            const columns =
                parseCSVLine(line);

            const title =
                columns[1] || "";

            const description =
                columns[2] || "";

            const status =
                (columns[3] || "").toLowerCase();

            if (status === "active") {

                promotion = {
                    title,
                    description
                };

                break;
            }
        }

        if (!promotion) {

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
            `;

            return;
        }

        homePromotion.innerHTML = `
            <div>

                <span>
                    🔥 Latest Offer
                </span>

                <h3>
                    ${promotion.title}
                </h3>

                <p>
                    ${promotion.description}
                </p>

            </div>

            <button
                onclick="showPage('promoPage')"
            >
                View Promo
            </button>
        `;

    } catch (error) {

        console.error(
            "HOME PROMOTION ERROR:",
            error
        );

        homePromotion.innerHTML = `
            <div>

                <span>
                    🎁 Promotion
                </span>

                <h3>
                    Unable to Load Promotion
                </h3>

                <p>
                    Please check your internet connection.
                </p>

            </div>
        `;
    }
}


// ===============================
// START APP
// ===============================
// ===============================
// OPEN CATEGORY FROM HOME
// ===============================

async function openCategory(category) {

    await showPage("menuPage");

    const categoryButton =
        document.querySelector(
            `.category-btn[data-category="${category}"]`
        );

    filterMenu(category, categoryButton);

    window.scrollTo(0, 0);
}
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadMenu();
        await loadPromotions();
        await loadHomePromotion();
        await loadServices();

        await showPage("homePage");
    }
);