(function modalHandler() {
  const createModal = document.getElementById("createModal");
  const editModal = document.getElementById("editModal");
  const openCreateBtn = document.getElementById("openCreateModal");
  const closeBtns = document.querySelectorAll(".close");
  openCreateBtn.onclick = () => createModal.style.display = "block";
  closeBtns.forEach(btn => btn.onclick = () => {
    createModal.style.display = "none";
    editModal.style.display = "none";
  });
  window.onclick = (e) => {
    if (e.target === createModal) createModal.style.display = "none";
    if (e.target === editModal) editModal.style.display = "none";
  };

  // === Edit user ===
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const mail = btn.dataset.mail;
      const role = btn.dataset.role;
      document.getElementById("editMail").value = mail;
      document.getElementById("editRole").value = role;
      document.getElementById("editUserForm").action = `/admin/users/edit/${id}`;

      editModal.style.display = "block";
    });
  });
})();