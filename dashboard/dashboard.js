
document.addEventListener("DOMContentLoaded", function () {
    const moduleButtons = document.querySelectorAll(".module-btn");
    const modules = document.querySelectorAll(".module-section");

    moduleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.target;

            modules.forEach((mod) => {
                mod.style.display = "none";
            });

            const selectedModule = document.getElementById(target);
            if (selectedModule) {
                selectedModule.style.display = "block";
            }
        });
    });
});
