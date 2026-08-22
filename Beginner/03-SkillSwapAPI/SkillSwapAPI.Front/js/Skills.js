document.addEventListener("DOMContentLoaded", loadSkills);

async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);


        if (!response.ok) {
            throw new Error("فشل تحميل المهارات");
        }

        const skills = await response.json();
        renderSkills(skills);
    } catch (error) {
        console.error(error);
        showModal("حصل خطأ في تحميل المهارات، تأكد إن الـ API شغال", "error");
    }
}

function renderSkills(skills) {
    const list = document.getElementById("skillsList");
    list.innerHTML = "";

    if (skills.length === 0) {
        list.innerHTML = `<li class="text-gray-400">لسه مفيش مهارات مضافة</li>`;
        return;
    }

    skills.forEach(skill => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between border-b border-gray-100 py-2";
        li.innerHTML = `
            <span class="text-gray-700">${skill.name}</span>
            <span class="text-xs text-gray-400">#${skill.id}</span>
        `;
        list.appendChild(li);
    });
}

async function addSkill() {
    const input = document.getElementById("skillNameInput");
    const name = input.value.trim();

    if (!name) {
        showModal("لازم تكتب اسم المهارة الأول", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/skills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });

        if (!response.ok) {
            throw new Error("فشل إضافة المهارة");
        }

        input.value = "";
        showModal("تمت إضافة المهارة بنجاح", "success");
        await loadSkills();
    } catch (error) {
        console.error(error);
        showModal("حصل خطأ أثناء الإضافة", "error");
    }
}

async function uploadImage() {
    const userId = document.getElementById("userIdInput").value;
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!userId || !file) {
        showModal("لازم تختار رقم يوزر وصورة", "error");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE_URL}/appusers/${userId}/upload-image`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();
        showModal(`تم رفع الصورة بنجاح: ${result.imageUrl}`, "success");
    } catch (error) {
        console.error(error);
        showModal("فشل رفع الصورة", "error");
    }
}