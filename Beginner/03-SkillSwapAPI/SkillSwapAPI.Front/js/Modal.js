const modalEl = document.getElementById("customModal");
const modalIconEl = document.getElementById("modalIcon");
const modalMessageEl = document.getElementById("modalMessage");

function showModal(message, type = "success") {
    modalMessageEl.textContent = message;
    if (type === "success") { 
        ModalIconEl.textContent = "✅";
    } else {
        ModalIconEl.textContent = "❌";
    }

    modalEl.classList.remove("hidden");
    modalEl.classList.add   ("flex");
}

function closeModal() {
    modalEl.classList.remove("flex");
    modalEl.classList.add   ("hidden");
}

modalEl.addEventListener("click", e => {
    if (e.target === modalEl) closeModal();
})