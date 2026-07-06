// =========================================
// Hospital Management System
// Version 1.1 - Part A
// =========================================

// Load Patients from Local Storage
let patients = JSON.parse(localStorage.getItem("patients")) || [];

// Track editing record
let editIndex = -1;

// =========================================
// Save Data to Local Storage
// =========================================

function saveToStorage() {
    localStorage.setItem("patients", JSON.stringify(patients));
}

// =========================================
// Update Total Patient Count
// =========================================

function updatePatientCount() {
    document.getElementById("patientCount").textContent = patients.length;
}

// =========================================
// Server Response
// =========================================

function showResponse(message, success = true) {

    const response = document.getElementById("response");

    response.innerHTML = message;

    if (success) {

        response.style.background = "#dcfce7";
        response.style.color = "#166534";
        response.style.borderLeft = "6px solid green";

    } else {

        response.style.background = "#fee2e2";
        response.style.color = "#991b1b";
        response.style.borderLeft = "6px solid red";

    }

}

// =========================================
// Clear Form
// =========================================

function clearFields() {

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("disease").value = "";
    document.getElementById("doctor").value = "";
    document.getElementById("hospital").value = "";

    editIndex = -1;

}

// =========================================
// Save Patient
// =========================================

function savePatient() {

    let id = document.getElementById("id").value.trim();

    let name = document.getElementById("name").value.trim();

    let disease = document.getElementById("disease").value.trim();

    let doctor = document.getElementById("doctor").value.trim();

    let hospital = document.getElementById("hospital").value.trim();

    if (
        id === "" ||
        name === "" ||
        disease === "" ||
        doctor === "" ||
        hospital === ""
    ) {

        showResponse("❌ Please fill all fields", false);

        return;

    }

    // Duplicate ID Check

    let exists = patients.some(patient => patient.id === id);

    if (exists) {

        showResponse("❌ Patient ID already exists.", false);

        return;

    }

    let patient = {

        id,
        name,
        disease,
        doctor,
        hospital,
        createdAt: new Date().toLocaleString()

    };

    patients.push(patient);

    saveToStorage();

    displayPatients();

    clearFields();

    showResponse("✅ Patient Added Successfully");

}

// =========================================
// Display Patients
// =========================================

function displayPatients(list = patients) {

    const table = document.getElementById("patientTable");

    table.innerHTML = "";

    list.forEach((patient, index) => {

        table.innerHTML += `

        <tr>

            <td>${patient.id}</td>

            <td>${patient.name}</td>

            <td>${patient.disease}</td>

            <td>${patient.doctor}</td>

            <td>${patient.hospital}</td>

            <td>${patient.createdAt}</td>

            <td>

                <button
                    class="edit"
                    onclick="editPatient(${index})">

                    Edit

                </button>

                <button
                    class="delete"
                    onclick="deletePatient(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    updatePatientCount();

}

// =========================================
// Edit Patient
// =========================================

function editPatient(index) {

    editIndex = index;

    document.getElementById("id").value =
        patients[index].id;

    document.getElementById("name").value =
        patients[index].name;

    document.getElementById("disease").value =
        patients[index].disease;

    document.getElementById("doctor").value =
        patients[index].doctor;

    document.getElementById("hospital").value =
        patients[index].hospital;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// =========================================
// Update Patient
// =========================================

function updatePatient() {

    if (editIndex === -1) {

        showResponse("⚠ Select a patient using Edit first.", false);

        return;

    }

    patients[editIndex] = {

        id: document.getElementById("id").value.trim(),

        name: document.getElementById("name").value.trim(),

        disease: document.getElementById("disease").value.trim(),

        doctor: document.getElementById("doctor").value.trim(),

        hospital: document.getElementById("hospital").value.trim(),

        createdAt: patients[editIndex].createdAt

    };

    saveToStorage();

    displayPatients();

    clearFields();

    showResponse("✅ Patient Updated Successfully");

}

// =========================================
// Delete Patient
// =========================================

function deletePatient(index) {

    if (confirm("Delete this patient?")) {

        patients.splice(index, 1);

        saveToStorage();

        displayPatients();

        showResponse("🗑 Patient Deleted");

    }

}
// =========================================
// Version 1.1 - Part B
// Search | Verification | Initialization
// =========================================

// =========================================
// Live Search
// =========================================

const searchBox = document.getElementById("search");

searchBox.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase().trim();

    const filteredPatients = patients.filter(patient =>

        patient.id.toLowerCase().includes(keyword) ||

        patient.name.toLowerCase().includes(keyword) ||

        patient.disease.toLowerCase().includes(keyword) ||

        patient.doctor.toLowerCase().includes(keyword) ||

        patient.hospital.toLowerCase().includes(keyword)

    );

    displayPatients(filteredPatients);

});

// =========================================
// Verify Patient
// =========================================

function verifyPatient() {

    const verifyId = document
        .getElementById("verifyId")
        .value
        .trim();

    const result = document.getElementById("verificationResult");

    if (verifyId === "") {

        result.innerHTML = "⚠ Please enter a Patient ID";

        result.style.background = "#fef3c7";
        result.style.color = "#92400e";

        return;
    }

    const patient = patients.find(p => p.id === verifyId);

    if (patient) {

        result.innerHTML = `

        <strong>✅ Patient Verified</strong><br><br>

        <b>ID :</b> ${patient.id}<br>

        <b>Name :</b> ${patient.name}<br>

        <b>Disease :</b> ${patient.disease}<br>

        <b>Doctor :</b> ${patient.doctor}<br>

        <b>Hospital :</b> ${patient.hospital}

        `;

        result.style.background = "#dcfce7";
        result.style.color = "#166534";

    }

    else {

        result.innerHTML = "❌ Patient Not Found";

        result.style.background = "#fee2e2";
        result.style.color = "#991b1b";

    }

}

// =========================================
// Auto Load
// =========================================

window.onload = function () {

    displayPatients();

    updatePatientCount();

    showResponse("✅ System Ready");

};

// =========================================
// Enter Key Support
// =========================================

document.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        const active = document.activeElement.id;

        if (active === "verifyId") {

            verifyPatient();

        }

        else {

            if (editIndex === -1) {

                savePatient();

            }

            else {

                updatePatient();

            }

        }

    }

});

// =========================================
// Auto-hide Response after 4 seconds
// =========================================

const originalShowResponse = showResponse;

showResponse = function(message, success = true){

    originalShowResponse(message, success);

    setTimeout(() => {

        document.getElementById("response").innerHTML =
            "✔ Ready";

    },4000);

};