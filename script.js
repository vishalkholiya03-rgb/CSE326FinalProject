var students = [];
var classes = [
    "Hip Hop",
    "Kathak",
    "Bollywood",
    "Contemporary"
];

var bookings = [];

var currentUser = "";
var currentEmail = "";
var currentRole = "";


// Open Login Form
function openLogin() {
    document.getElementById("loginPage").style.display = "flex";
}


// Close Login Form
function closeLogin() {
    document.getElementById("loginPage").style.display = "none";
}


// Register / Login
function login(event) {
    event.preventDefault();

    var name = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    if (name == "" || email == "" || phone == "") {
        alert("Please fill all details");
        return;
    }

    currentUser = name;
    currentEmail = email;

    // Demo role selection through email
    if (email == "admin@dancestudio.com") {
        currentRole = "admin";
    }
    else if (email == "teacher@dancestudio.com") {
        currentRole = "instructor";
    }
    else {
        currentRole = "student";
    }

    if (currentRole == "student") {
        students.push({
            name: name,
            email: email,
            phone: phone
        });
    }

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";

    document.getElementById("welcome").innerHTML =
        "Welcome, " + name;

    document.getElementById("adminMenu").style.display = "none";
    document.getElementById("studentMenu").style.display = "none";
    document.getElementById("teacherMenu").style.display = "none";

    if (currentRole == "admin") {
        document.getElementById("adminMenu").style.display = "block";
    }
    else if (currentRole == "instructor") {
        document.getElementById("teacherMenu").style.display = "block";
    }
    else {
        document.getElementById("studentMenu").style.display = "block";

        // Fill booking form with registered student details
        document.getElementById("bookingName").value = name;
        document.getElementById("bookingPhone").value = phone;
    }

    showSection("availableClasses");
    updateData();
}


// Logout
function logout() {
    document.getElementById("mainPage").style.display = "none";

    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

    currentUser = "";
    currentEmail = "";
    currentRole = "";

    document.getElementById("loginMessage").innerHTML = "";
}


// Show Sections
function showSection(sectionName) {
    if (currentRole != "admin" &&
        (sectionName == "students" ||
         sectionName == "classesAdmin" ||
         sectionName == "bookings" ||
         sectionName == "reports")) {

        alert("You cannot access this section");
        return;
    }

    var sections = document.getElementsByClassName("section");

    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }

    document.getElementById(sectionName).style.display = "block";

    updateData();
}


// Add Student
function addStudent() {
    var name = document.getElementById("newStudent").value;
    var email = document.getElementById("newStudentEmail").value;

    if (name == "" || email == "") {
        alert("Please enter student details");
    }
    else if (!email.includes("@")) {
        alert("Enter a valid email");
    }
    else {
        students.push({
            name: name,
            email: email,
            phone: "Not provided"
        });

        document.getElementById("newStudent").value = "";
        document.getElementById("newStudentEmail").value = "";

        alert("Student added successfully!");
        updateData();
    }
}


// Display Students
function displayStudents() {
    var list = "";

    for (var i = 0; i < students.length; i++) {
        list += "<li>";
        list += students[i].name + " - " + students[i].email;
        list += " <button onclick='deleteStudent(" + i + ")'>Delete</button>";
        list += "</li>";
    }

    document.getElementById("studentList").innerHTML = list;
}


// Delete Student
function deleteStudent(index) {
    if (confirm("Delete this student?")) {
        students.splice(index, 1);
        updateData();
    }
}


// Add Dance Class
function addClass() {
    var name = document.getElementById("newClass").value;
    var time = document.getElementById("newTime").value;

    if (name == "" || time == "") {
        alert("Please enter all details");
    }
    else {
        classes.push(name + " - " + time);

        document.getElementById("newClass").value = "";
        document.getElementById("newTime").value = "";

        alert("Class added successfully!");
        updateData();
    }
}


// Display Classes
function displayClasses() {
    var list = "";

    for (var i = 0; i < classes.length; i++) {
        list += "<li>";
        list += classes[i];

        if (currentRole == "admin") {
            list += " <button onclick='deleteClass(" + i + ")'>Delete</button>";
        }
        else if (currentRole == "student") {
            list += " <button onclick='bookClass(" + i + ")'>Choose Class</button>";
        }

        list += "</li>";
    }

    document.getElementById("classList").innerHTML = list;
    document.getElementById("availableList").innerHTML = list;
}


// Delete Class
function deleteClass(index) {
    if (confirm("Delete this class?")) {
        classes.splice(index, 1);
        updateData();
    }
}


// Choose a class and fill it into the booking form
function bookClass(index) {
    var selectedClass = classes[index];

    // If the class has a timing added by admin, keep only its dance form in the selection.
    var className = selectedClass.split(" - ")[0];
    var classSelect = document.getElementById("bookingClass");
    var found = false;

    for (var i = 0; i < classSelect.options.length; i++) {
        if (classSelect.options[i].value == className) {
            classSelect.value = className;
            found = true;
        }
    }

    if (found == false) {
        var newOption = document.createElement("option");
        newOption.value = className;
        newOption.text = className;
        classSelect.add(newOption);
        classSelect.value = className;
    }

    document.getElementById("bookingName").focus();
    document.querySelector(".booking-panel").scrollIntoView({ behavior: "smooth" });
}


// Submit Booking Form
function submitBooking(event) {
    event.preventDefault();

    var name = document.getElementById("bookingName").value;
    var phone = document.getElementById("bookingPhone").value;
    var className = document.getElementById("bookingClass").value;
    var time = document.getElementById("bookingTime").value;

    if (name == "" || phone == "" || className == "" || time == "") {
        alert("Please complete all booking details.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    var alreadyBooked = false;

    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].email == currentEmail &&
            bookings[i].className == className &&
            bookings[i].time == time) {
            alreadyBooked = true;
        }
    }

    if (alreadyBooked) {
        alert("You have already requested this class at this time.");
        return;
    }

    bookings.push({
        name: name,
        email: currentEmail,
        phone: phone,
        className: className,
        time: time,
        status: "Pending"
    });

    alert("Booking request sent successfully!");

    document.getElementById("bookingClass").value = "";
    document.getElementById("bookingTime").value = "";

    updateData();
}


// Display Bookings
function displayBookings() {
    var list = "";
    var myList = "";

    for (var i = 0; i < bookings.length; i++) {
        list += "<li>";
        list += "<strong>Name:</strong> " + bookings[i].name + "<br>";
        list += "<strong>Phone:</strong> " + bookings[i].phone + "<br>";
        list += "<strong>Dance Form:</strong> " + bookings[i].className + "<br>";
        list += "<strong>Time:</strong> " + bookings[i].time + "<br>";
        list += "<strong>Status:</strong> " + bookings[i].status;

        if (bookings[i].status == "Pending") {
            list += "<br><button onclick='approveBooking(" + i + ")'>Approve</button>";
            list += "<button onclick='rejectBooking(" + i + ")'>Reject</button>";
        }

        list += "</li>";

        if (bookings[i].email == currentEmail) {
            myList += "<li>";
            myList += "<strong>Dance Form:</strong> " + bookings[i].className + "<br>";
            myList += "<strong>Time:</strong> " + bookings[i].time + "<br>";
            myList += "<strong>Status:</strong> " + bookings[i].status;
            myList += "</li>";
        }
    }

    if (myList == "") {
        myList = "<li>You have not made any bookings yet.</li>";
    }

    if (list == "") {
        list = "<li>There are no booking requests yet.</li>";
    }

    document.getElementById("bookingList").innerHTML = list;
    document.getElementById("myBookingList").innerHTML = myList;
}


// Approve Booking
function approveBooking(index) {
    bookings[index].status = "Approved";
    alert("Booking approved!");
    updateData();
}


// Reject Booking
function rejectBooking(index) {
    bookings[index].status = "Rejected";
    alert("Booking rejected!");
    updateData();
}


// Update Data
function updateData() {
    displayStudents();
    displayClasses();
    displayBookings();

    var approved = 0;
    var pending = 0;

    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].status == "Approved") {
            approved++;
        }

        if (bookings[i].status == "Pending") {
            pending++;
        }
    }

    document.getElementById("reportData").innerHTML =
        "Total Students: " + students.length +
        "<br>Total Classes: " + classes.length +
        "<br>Total Bookings: " + bookings.length +
        "<br>Approved Bookings: " + approved +
        "<br>Pending Bookings: " + pending;
}
