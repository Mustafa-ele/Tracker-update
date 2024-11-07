
let users = {
    "30362040": { password: "yahusain", tasks: [], completedTasks: [] },
    "30362041": { password: "yahusain", tasks: [], completedTasks: [] },
    "30362042": { password: "yahusain", tasks: [], completedTasks: [] },
    "30362043": { password: "yahusain", tasks: [], completedTasks: [] },
    "20323313": { password: "yahusain", tasks: [], completedTasks: [] },
};
let currentUser = null;

// Initialize or load user task history from localStorage
if (!localStorage.getItem("userTaskHistory")) {
    localStorage.setItem("userTaskHistory", JSON.stringify({}));
}
let userTaskHistory = JSON.parse(localStorage.getItem("userTaskHistory"));

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        loadAdminData();
    } else if (username in users && users[username].password === password) {
        currentUser = username;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("user-dashboard").style.display = "block";
        loadUserTasks();
    } else {
        alert("Invalid credentials");
    }
}

function loadUserTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    const userTasks = [
        { task: "Dua kamil", completed: false },
        { task: "Dua Joshan", completed: false },
        { task: "Innafathana", completed: false },
        { task: "Quran Majeed Tilawat", completed: false },
        { task: "Tasbeeh Yali", completed: false },
        { task: "Tasbeeh Yahussain", completed: false },
        { task: "Tasbeeh Iyyakanabodo", completed: false }
    ];
    users[currentUser].tasks = userTasks;

    userTasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.task}</td>
            <td><input type="checkbox" id="task-${index}" ${isTaskCompletedToday() ? "disabled" : ""}></td>
        `;
        taskList.appendChild(row);
    });
}

function isTaskCompletedToday() {
    const today = new Date().toLocaleDateString();
    return userTaskHistory[currentUser] && userTaskHistory[currentUser].some(entry => entry.date === today);
}

function submitTasks() {
    if (isTaskCompletedToday()) {
        alert("You have already submitted today's tasks.");
        return;
    }

    const completedTasks = [];
    users[currentUser].tasks.forEach((task, index) => {
        const checkbox = document.getElementById(`task-${index}`);
        if (checkbox.checked) {
            completedTasks.push(task.task);
        }
    });

    // Save task completion in history with today's date
    const today = new Date().toLocaleDateString();
    if (!userTaskHistory[currentUser]) {
        userTaskHistory[currentUser] = [];
    }
    userTaskHistory[currentUser].push({
        date: today,
        completedTasks: completedTasks
    });
    localStorage.setItem("userTaskHistory", JSON.stringify(userTaskHistory));

    alert("Tasks submitted successfully!");
    document.getElementById("home-button").style.display = "block";
    loadUserTasks(); // Reload to disable checkboxes for the day
}

function goHome() {
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("home-button").style.display = "none";
}

function loadAdminData() {
    Object.keys(users).forEach(userId => {
        const userTable = document.getElementById(`table-${userId}`);
        if (userTable) {
            userTable.innerHTML = "<tr><th>Date</th><th>Completed Tasks</th></tr>";
            const userHistory = userTaskHistory[userId] || [];
            userHistory.forEach(entry => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.completedTasks.join(", ")}</td>
                `;
                userTable.appendChild(row);
            });
        }
    });
}

function exportToExcel(userId) {
    const userHistory = userTaskHistory[userId] || [];
    const tableData = [["Date", "Completed Tasks"]];

    userHistory.forEach(entry => {
        tableData.push([entry.date, entry.completedTasks.join(", ")]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + tableData.map(row => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${userId}_task_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Logout function for admin
function logout() {
    document.getElementById("admin-dashboard").style.display = "none";
    document.getElementById("login-section").style.display = "block";
}
