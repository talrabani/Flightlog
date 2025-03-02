console.log(logbookEntries);


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".flight-date").forEach(function (td) {
        let rawDate = td.getAttribute("data-date");
        if (rawDate) {
            let dateObj = new Date(rawDate);
            if (!isNaN(dateObj)) {
                let formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });
                td.textContent = formattedDate; // Insert formatted date into <td>
            } else {
                td.textContent = "Invalid Date"; // Debugging
            }
        }
    });
});


    // Add functionality to Edit button
    document.querySelector(".btn-warning").addEventListener("click", function () {
        alert("Edit button clicked! Implement editing logic here.");
    });

    // Add functionality to Add button
    document.querySelector(".btn-success").addEventListener("click", function () {
        alert("Add button clicked! Implement adding logic here.");
    });
