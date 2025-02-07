document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("currentUser")) {
        showProfile();
    } else {
        showRegister();
    }
});

function showRegister() {
    document.getElementById("register-container").classList.remove("hidden");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("profile-container").classList.add("hidden");
}

function showLogin() {
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("profile-container").classList.add("hidden");
}

function showProfile() {
    let currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem("users")) || {};
    let fullName = users[currentUser].fullName || "Sin nombre";

    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("profile-container").classList.remove("hidden");

    document.getElementById("userInfo").innerText = `Usuario: ${currentUser} (${fullName})`;

    updateStudentList();
    updateFriendRequests();
    updateFriendsList();
}

function register() {
    let fullName = document.getElementById("regFullName").value.trim();
    let userId = document.getElementById("regUserId").value.trim();
    let password = document.getElementById("regPassword").value.trim();

    if (!userId || !password) {
        alert("El nombre de usuario y la contraseña son obligatorios.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[userId]) {
        alert("Este usuario ya existe.");
        return;
    }

    users[userId] = { fullName, password, friends: [], requests: [], sentRequests: [] };
    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuario registrado con éxito. Ahora inicia sesión.");
    showLogin();
}

function login() {
    let userId = document.getElementById("userId").value.trim();
    let password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[userId] && users[userId].password === password) {
        localStorage.setItem("currentUser", userId);
        showProfile();
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    showLogin();
}

function showStudentList() {
    document.getElementById("students-list-container").classList.remove("hidden");
    updateStudentList();
}

function showFriendRequests() {
    document.getElementById("friend-requests-container").classList.remove("hidden");
    updateFriendRequests();
}

function showFriendsList() {
    document.getElementById("friends-list-container").classList.remove("hidden");
    updateFriendsList();
}

function updateStudentList() {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    let studentsList = document.getElementById("students-list");
    studentsList.innerHTML = "";

    for (let user in users) {
        if (user !== currentUser && !users[currentUser].friends.includes(user)) {
            let alreadySent = users[currentUser].sentRequests.includes(user);
            let buttonText = alreadySent ? "Solicitud enviada" : "Agregar Amigo";
            let cancelButton = alreadySent ? `<button onclick="cancelRequest('${user}')">Cancelar</button>` : "";

            let li = document.createElement("li");
            li.innerHTML = `${users[user].fullName || user} 
                <button onclick="sendRequest('${user}')" ${alreadySent ? "disabled" : ""}>${buttonText}</button>
                ${cancelButton}`;
            studentsList.appendChild(li);
        }
    }
}

function updateFriendRequests() {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    let requestsList = document.getElementById("friend-requests");
    requestsList.innerHTML = "";

    users[currentUser].requests.forEach(requestUser => {
        let li = document.createElement("li");
        li.innerHTML = `${users[requestUser].fullName || requestUser}
            <button onclick="acceptRequest('${requestUser}')">Aceptar</button>
            <button onclick="rejectRequest('${requestUser}')">Eliminar</button>`;
        requestsList.appendChild(li);
    });
}

function updateFriendsList() {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    let friendsList = document.getElementById("friends-list");
    friendsList.innerHTML = "";

    users[currentUser].friends.forEach(friendUser => {
        let li = document.createElement("li");
        li.innerHTML = `${users[friendUser].fullName || friendUser}`;
        friendsList.appendChild(li);
    });
}

function sendRequest(toUser) {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[toUser].requests.includes(currentUser)) {
        users[toUser].requests.push(currentUser);
        users[currentUser].sentRequests.push(toUser);
        localStorage.setItem("users", JSON.stringify(users));
        updateStudentList();
    }
}

function cancelRequest(toUser) {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    users[toUser].requests = users[toUser].requests.filter(user => user !== currentUser);
    users[currentUser].sentRequests = users[currentUser].sentRequests.filter(user => user !== toUser);

    localStorage.setItem("users", JSON.stringify(users));
    updateStudentList();
}

function acceptRequest(fromUser) {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    users[currentUser].friends.push(fromUser);
    users[fromUser].friends.push(currentUser);

    users[currentUser].requests = users[currentUser].requests.filter(user => user !== fromUser);
    users[fromUser].sentRequests = users[fromUser].sentRequests.filter(user => user !== currentUser);

    localStorage.setItem("users", JSON.stringify(users));
    updateFriendRequests();
    updateFriendsList();
}

function rejectRequest(fromUser) {
    let currentUser = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || {};

    users[currentUser].requests = users[currentUser].requests.filter(user => user !== fromUser);
    users[fromUser].sentRequests = users[fromUser].sentRequests.filter(user => user !== currentUser);

    localStorage.setItem("users", JSON.stringify(users));
    updateFriendRequests();
}
