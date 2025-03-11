document.addEventListener("DOMContentLoaded", () => {
    loadTable();

    // // Register Service Worker
    // if ("serviceWorker" in navigator) {
    //     navigator.serviceWorker.register("sw.js")
    //     .then(() => console.log("Service Worker Registered"))
    //     .catch((error) => console.log("Service Worker Registration Failed", error));
    // }
});

function loadTable() {
    let storedData = localStorage.getItem("universityData");
    if (storedData) {
        let table = document.getElementById("universityTable").getElementsByTagName('tbody')[0];
        JSON.parse(storedData).forEach(entry => {
            let row = table.insertRow();
            row.insertCell(0).textContent = entry.name;
            row.insertCell(1).innerHTML = `<a href='${entry.website}' target='_blank'>${entry.website}</a>`;
            row.insertCell(2).textContent = entry.country;
            row.insertCell(3).textContent = entry.date || "-";

            let applyCell = row.insertCell(4);
            applyCell.classList.add("apply-status");
            applyCell.innerHTML = entry.applied ? `<span class='tick' onclick='toggleApply(this)'>&#9989;</span>` : `<span class='cross' onclick='toggleApply(this)'>&#10060;</span>`;

            let deleteCell = row.insertCell(5);
            deleteCell.innerHTML = `<button onclick="deleteRow(this)">Delete</button>`;
        });
    }
}

function addRow() {
    let name = document.getElementById("name").value;
    let website = document.getElementById("website").value;
    let country = document.getElementById("country").value;
    let date = document.getElementById("date").value;

    if (name && website && country) {
        let table = document.getElementById("universityTable").getElementsByTagName('tbody')[0];
        let row = table.insertRow();
        row.insertCell(0).textContent = name;
        row.insertCell(1).innerHTML = `<a href='${website}' target='_blank'>${website}</a>`;
        row.insertCell(2).textContent = country;
        row.insertCell(3).textContent = date || "-";

        let applyCell = row.insertCell(4);
        applyCell.classList.add("apply-status");
        applyCell.innerHTML = `<span class='cross' onclick='toggleApply(this)'>&#10060;</span>`;

        let deleteCell = row.insertCell(5);
        deleteCell.innerHTML = `<button onclick="deleteRow(this)">Delete</button>`;

        saveData();
    }
}

function toggleApply(element) {
    if (element.classList.contains("cross")) {
        element.classList.remove("cross");
        element.classList.add("tick");
        element.innerHTML = "&#9989;";
    } else {
        element.classList.remove("tick");
        element.classList.add("cross");
        element.innerHTML = "&#10060;";
    }
    saveData();
}

function deleteRow(button) {
    let row = button.parentElement.parentElement;
    row.remove();
    saveData();
}

function saveData() {
    let table = document.getElementById("universityTable").getElementsByTagName('tbody')[0];
    let data = [];
    for (let row of table.rows) {
        data.push({
            name: row.cells[0].textContent,
            website: row.cells[1].querySelector("a").href,
            country: row.cells[2].textContent,
            date: row.cells[3].textContent,
            applied: row.cells[4].querySelector("span").classList.contains("tick")
        });
    }
    localStorage.setItem("universityData", JSON.stringify(data));
}

function downloadPDF() {
    const element = document.createElement('div');

    // Create and style heading
    const heading = document.createElement('h2');
    heading.textContent = "Universities List";
    heading.style.textAlign = "center";
    heading.style.padding = "15px";
    heading.style.backgroundColor = "black";
    heading.style.color = "white";
    heading.style.fontSize = "22px";
    heading.style.marginBottom = "20px";
    heading.style.borderRadius = "8px";

    // Clone table and remove "Actions" column
    const tableClone = document.getElementById("universityTable").cloneNode(true);
    let actionColumnIndex = 5;
    for (let row of tableClone.rows) {
        if (row.cells.length > actionColumnIndex) {
            row.deleteCell(actionColumnIndex);
        }
    }

    // Append heading and modified table to a new element
    element.appendChild(heading);
    element.appendChild(tableClone);

    // Generate high-quality PDF
    html2pdf(element, {
        margin: 10,
        filename: 'Universities_List.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });
}
