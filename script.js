const createUserForm = document.querySelector("[data-create-user-form]");
const editUserFormDialog = document.querySelector("[data-edit-user-form-dialog]");
const usersContainer = document.querySelector("[data-users-container]");

const MOCK_API_URL = "https://69a070823188b0b1d538bc07.mockapi.io/users";
let users = [];
// -----Клик по всему контейнеру (делегирование событий)----
usersContainer.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-user-remove-btn")) {
        // console.log("userRemoveBtn" in e.target.dataset)
        const isRemoveUser = confirm("Вы точно хотите удалить этого красавчика?");
        isRemoveUser && removeExistingUserAsync(e.target.dataset.userId);
        return;
    }

    if(e.target.hasAttribute("data-user-edit-btn")) {
        populateDialog(e.target.dataset.userId);
        
        editUserFormDialog.showModal();
    }
})


// Событие отправки формы создания пользователя
createUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(createUserForm);
    const formUserData = Object.fromEntries(formData);

    const newUserData = {
        name: formUserData.userName,
        city: formUserData.userCity,
        email: formUserData.userEmail, 
        avatar: formUserData.userImageUrl, 

    }
    createNewUserAsync(newUserData);
    // todo create user
})
// Редактирование существующего пользователя---

const editExistingUserAsync = async (newUserData) => {
     try {
        const response = await fetch(`${MOCK_API_URL}/${newUserData.id}`, {
            method: "PUT",
            body: JSON.stringify(newUserData),
            headers: {
                "Content-type": "application/json"
            }
        });
        if (response.status === 400) {
            throw new Error(`клиентская ошибка`)
        }
        const editedUser = await response.json();

        users = users.map((user) => {
            if (user.id === editedUser.id) {
                return editedUser;
            }
            return user;
        })
        editUserFormDialog.close();
        renderUsers();
        
        alert("ПОЛЬЗОВАТЕЛЬ УСПЕШНО ОТРЕДАКТИРОВАН")
    } catch (error) {
        console.error("ОШИБКА при редактировании нового пользователя: ", error.message)
    }
}
// Удаление существующего пользователя -----
const removeExistingUserAsync = async (userId) => {
    try {
        const response = await fetch(`${MOCK_API_URL}/${userId}`, {
            method: "DELETE"
        });
        if (response.status === 404) {
            throw new Error(`${userId} не найден`)
        }
        const removedUser = await response.json();

        users = users.filter(user => user.id !== removedUser.id);
        renderUsers();

        alert("ПОЛЬЗОВАТЕЛЬ УСПЕШНО УДАЛЁН");

    } catch (error) {
        console.error("ОШИБКА при удалении нового пользователя: ", error.message)
    }
}
// Создание нового пользователя 
const createNewUserAsync = async (newUserData) => {
    try {
        const response = await fetch(MOCK_API_URL, {
            method: "POST",
            body: JSON.stringify(newUserData),
            headers: {
                "Content-type": "application/json"
            }
        });
        const newCreatedUser = await response.json();

        users.unshift(newCreatedUser);
        renderUsers();
        alert("НОВЫЙ ПОЛЬЗОВАТЕЛЬ УСПЕШНО СОЗДАН")

        createUserForm.reset();

    } catch (error) {
        console.error("ОШИБКА создания нового пользователя: ", error.message)
    }
}
// Получение всех пользователей
const getUserAsync = async () => {
    try {
        const response = await fetch(MOCK_API_URL);
        users = await response.json();

        renderUsers();
    } catch (error) {
        console.error("ПОЙМАННАЯ ОШИБКА", error.message)
    }
}

// Отрисовка всех пользователей 
const renderUsers = () => {
    usersContainer.innerHTML = "";

    users.forEach((user) => {
        usersContainer.insertAdjacentHTML("beforeend", `
            <div class="user-card">
                <h3>${user.name}</h3>
                <p>City: ${user.city}</p>
                <span>Email: ${user.email}</span>
                <img src="${user.avatar}"/>
                <button class="user-edit-btn" data-user-id="${user.id}" data-user-edit-btn>🛠️</button>
                <button class="user-remove-btn" data-user-id="${user.id}" data-user-remove-btn>❌</button>
            </div>
        `)
    })


}
    // Заполнение модального окна разметкой формы -----
const populateDialog = (userId) => {
    editUserFormDialog.innerHTML = "";

    const editForm = document.createElement("form");
    const closeFormBtn = document.createElement("button"); 

    closeFormBtn.classList.add("close-edit-form-btn");
    closeFormBtn.textContent = "❌";
    closeFormBtn.addEventListener("click", () => editUserFormDialog.close());

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const formUserData = Object.fromEntries(formData);

        const newUserData = {
            id: formUserData.userId,
            name: formUserData.userName,
            city: formUserData.userCity,
            email: formUserData.userEmail, 
            avatar: formUserData.userImageUrl, 
        }
        editExistingUserAsync(newUserData);
    // todo create user
    })   // Возможно здесь ошибка
    editForm.classList.add("form");
    editForm.innerHTML = `
        <input type="text" name="userId" value="${userId}" hidden/>
        <div class="control-field">
            <label for="nameId" class="form-label">Name</label>
            <input type="text" class="form-control" id="nameId" name="userName" required minlength="2" maxlength="23">
        </div>

        <div class="control-field">
            <label for="cityId" class="form-label">City</label>
            <input type="text" class="form-control" id="cityId" name="userCity" required minlength="2" maxlength="20">
        </div>

        <div class="control-field">
            <label for="emailId" class="form-label">Email</label>
            <input type="email" class="form-control form-control--email" id="cityemailIdId." name="userEmail" required>
        </div>
        <div class="control-field">
            <label for="imagesUrlId" class="form-label">Email</label>

                <select name="userImageUrl" id="imagesUrlId" class="form-control form-control--images" required>
                    <option value="">Image URL</option>
                    <hr>
                    <option 
                        value="https://images.squarespace-cdn.com/content/v1/607f89e638219e13eee71b1e/1684821560422-SD5V37BAG28BURTLIXUQ/michael-sum-LEpfefQf4rU-unsplash.jpg">Cat 1</option>
                    <option 
                        value="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2194895813.jpg?c=original&q=w_860,c_fill">Cat 2</option>
                    <option
                        value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCvPxBT093cJiGBFPMhfYAvWnyfSHZX-m67A&s">Cat 3</option>
                    <option
                        value="https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=67773a9d419786091c958b2ad08eae5e">Dog 1</option>
                    <option
                        value="https://media.cnn.com/api/v1/images/stellar/prod/201030094143-stock-rhodesian-ridgeback.jpg?q=w_2187,h_1458,x_0,y_0,c_fill">Dog 2</option>
                    <option
                        value="https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg">Dog 3</option>
                    <option
                        value="https://www.bund-hessen.de/fileadmin/hessen/Presse/2020/schaeferproteste-wolf-in-hessen-wiesbaden.jpg">Wolf 1</option>
                    <option
                        value="https://njaes.rutgers.edu/fs1325/FS1325-1-big.jpg">Fox 1</option>
                </select>
            </div>

            <button type="submit" class="btn submit-btn">Edit User</button>
    `
    editUserFormDialog.append(editForm, closeFormBtn);

}
getUserAsync();