const mytable = document.querySelector("#mytable")


const PORT = 3003;


mytable.innerHTML = `
<thead>
    <tr>
        <th scope="col" >Enrollment Number: </th >
        <th scope="col" >First Name</th>
        <th scope="col" >Last Name</th>
        <th scope="col" >Course </th>
        <th scope="col" >Operation</th>
    </tr >
</thead> `




async function getData() {
    const resp = await fetch(`http://localhost:${PORT}/api/students/`)
    const data = await resp.json()


    data.forEach(i => {
        mytable.innerHTML += `
        <tbody>
            <tr>
                <th scope="row">${i.enrol}</th>
                <td>${i.fname}</td>
                <td>${i.lname}</td>
                <td>${i.course}</td>
                <td>
                    <div >
                            <svg  class="delete mr-3" data-id="${i.enrol}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>

                            <svg class="edit" data-id="${i.enrol}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                    </div>
                <td>
            <tr>
        </tbody>`
    });


    // for delete
    mytable.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete")) {
            event.preventDefault(); // Prevent default anchor behavior
            const enrol = event.target.getAttribute("data-id");


            try {
                // Send DELETE request
                const resp = await fetch(`http://localhost:3003/delete/${enrol}`, { method: 'DELETE', });

                if (resp.ok) {
                    // Remove the row from the table
                    const row = event.target.closest('tr');
                    row.remove();
                    alert(`Student with enrollment number ${enrol} deleted successfully.`);
                }
                else {
                    alert(`Failed to delete student with enrollment number ${enrol}.`);
                }

            }
            catch (error) {
                console.error("Error deleting student:", error);
                alert("An error occurred while trying to delete the student.");
            }

        }
    })




//Edit
mytable.addEventListener("click", async (event) => {
    if (event.target.classList.contains("edit")) {
        event.preventDefault(); 
        const enrol = event.target.getAttribute("data-id"); // Get enrollment number

        try {
            // Send GET request to fetch the student's current details
            const resp = await fetch(`http://localhost:${PORT}/api/student/${enrol}`);
            if (!resp.ok) {
                throw new Error(`Failed to fetch student data for enrollment number ${enrol}`);
            }
            const student = await resp.json();
            
          
            const editForm = document.querySelector("#editForm");
            editForm.enrol.value = student[0].enrol; 
            editForm.fname.value = student[0].fname; 
            editForm.lname.value = student[0].lname;
            editForm.course.value = student[0].course; 

            // Show the edit form or modal
            document.querySelector("#editModal").style.display = "block"; // Assuming you use a modal
            document.querySelector("#homeContainer").style.filter = "blur(1px)"
        } 
        catch (error) {
            console.error("Error fetching student details:", error);
            alert("An error occurred while fetching the student's data for editing.");
        }
    }
});



// Form submission for updating student details
    const editForm = document.querySelector("#editForm");
    editForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const enrol = editForm.enrol.value; // Get enrollment number (hidden input)
    const updatedStudent = {
        fname: editForm.fname.value, 
        lname: editForm.lname.value, 
        course: editForm.course.value, 
    };

    try {
        const resp = await fetch(`http://localhost:${PORT}/update/${enrol}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStudent),
        });
        
        console.log(resp);
        if (resp.ok) {
            alert(`Student with enrollment number ${enrol} updated successfully.`);
           
            const row = document.querySelector(`svg.edit[data-id="${enrol}"]`).closest('tr');
            row.children[1].textContent = updatedStudent.fname; 
            row.children[2].textContent = updatedStudent.lname; 
            row.children[3].textContent = updatedStudent.course; 

            document.querySelector("#editModal").style.display = "none";
            document.querySelector("#homeContainer").style.filter = "blur(0px)"
            
        } else {
            alert(`Failed to update student with enrollment number ${enrol}.`);
        }
    } 
    catch (error) {
        console.error("Error updating student:", error);
        alert("An error occurred while updating the student's details.");
    }
});







}

getData()
