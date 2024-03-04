


// darkmode toggle
const darkModeBtn = document.getElementById("darkmode");
let darkMode = localStorage.getItem("darkmode");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", "disabled")
}

if (darkMode === "enabled") {
    enableDarkMode();
}

darkModeBtn.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkmode");
    if (darkMode !== "enabled") {
        enableDarkMode()
    } else {
        disableDarkMode();
    }
})