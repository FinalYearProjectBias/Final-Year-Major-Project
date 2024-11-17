const url='https://backend-server-ohpm.onrender.com'

document.addEventListener('DOMContentLoaded', () => {
    // Handle dropdown functionality
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            dropdown.classList.toggle('active');
            const content = dropdown.querySelector('.dropdown-content');
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Handle sidebar link clicks to show the relevant section
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Handle sign-out button click
    document.getElementById('sign-out-btn')?.addEventListener('click', signOut);

    // Handle form submissions
    function handleFormSubmit(formId, successMessageId) {
        document.getElementById(formId)?.addEventListener('submit', (event) => {
            event.preventDefault();
            // Perform form submission logic here

            // Show success message
            const messageElement = document.getElementById(successMessageId);
            messageElement.style.display = 'block';

            // Clear the form fields
            document.getElementById(formId).reset();
        });
    }

    // // Handle add member form submission
    // document.getElementById('add-member-form')?.addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     document.getElementById('form-success-message').style.display = 'block';
    //     document.getElementById('add-member-form').reset();
    // });

  // Handle change password form submission (for both admin and grievance member)
document.getElementById('change-password-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (!checkPasswordMatch()) return; // Ensure new passwords match and are valid

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    const loggedInUserType = localStorage.getItem('loggedInUserType'); // Get logged-in user type

    // Admin password change logic
    if (loggedInUserType === 'admin') {
        const storedPassword = localStorage.getItem('adminPassword'); // Get admin's current password

        if (currentPassword !== storedPassword) {
            alert('Current password is incorrect!');
            return; // Prevent changing the password if the current password is wrong
        }

        // Update the admin password in localStorage
        localStorage.setItem('adminPassword', newPassword);

        // Show success message
        showSuccessMessage();

    } 
    // Grievance member password change logic
    else if (loggedInUserType === 'grievance-member') {
        const loggedInEmail = localStorage.getItem('loggedInMemberEmail'); // Get logged-in member's email

        // Fetch the list of members from localStorage
        const members = JSON.parse(localStorage.getItem('members')) || [];

        // Find the member by their email
        const member = members.find(m => m.email === loggedInEmail);

        if (!member) {
            alert('Member not found!');
            return; // Stop if the member is not found
        }

        // Check if the current password matches the stored password
        if (member.password !== currentPassword) {
            alert('Current password is incorrect!');
            return; // Stop if the current password is incorrect
        }

        // Update the member's password
        member.password = newPassword;

        // Save the updated members list back to localStorage
        localStorage.setItem('members', JSON.stringify(members));

        // Optionally, update the password in localStorage with the email as the key
        localStorage.setItem(`password-${loggedInEmail}`, newPassword);

        // Show success message
        showSuccessMessage();
    }
    
    // Clear the form fields
    document.getElementById('change-password-form').reset();
});

// Show success message and hide after 2 seconds
function showSuccessMessage() {
    const messageElement = document.getElementById('change-password-success-message');
    if (messageElement) {
        messageElement.style.display = 'block';
        
        // Hide the success message after 2 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 2000);
    }
}

  // Get the email input and the "Verify" button elements
const newEmailInput = document.getElementById('edit-profile-email');
const verifyButton = document.getElementById('verify-email-btn');
const otpContainer = document.getElementById('otp-container');
const otpInputs = document.querySelectorAll('.otp-input');
const otpError = document.getElementById('otp-error');
const updateProfileButton = document.getElementById('update-profile-btn');
const submitOtpButton = document.getElementById('submit-otp-btn');
const correctOTP = "1234"; // OTP to match

// Assume this is the admin email or grievance member email (email used to login)
let loggedInEmail = localStorage.getItem('loggedInMemberEmail') || localStorage.getItem('adminEmail') // Fetch email from localStorage // Fetch email from localStorage
let loggedInUserType = localStorage.getItem('loggedInUserType'); // admin or grievance-member

// Assume that the old email is shown in a text input or field on the page
const oldEmailInput = document.getElementById('old-email-input'); // The old email input field on the page

// Show the "Verify" button if email is valid (contains @ and .com)
newEmailInput.addEventListener('input', () => {
    const emailValue = newEmailInput.value;
    if (emailValue.includes('@') && emailValue.includes('.com')) {
        verifyButton.style.display = 'inline-block';
    } else {
        verifyButton.style.display = 'none';
    }
});

// Verify email and show OTP container
window.verifyEmail = function() {
    otpContainer.style.display = 'block';
    verifyButton.disabled = true; // Disable verify button once clicked
    otpInputs[0].focus();
}

// Automatically move to the next input when a digit is entered
otpInputs.forEach((otpInput, index) => {
    otpInput.addEventListener('input', () => {
        if (otpInput.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus(); // Move to the next input
        }
    });

    // Automatically move to the previous input when backspace is pressed
    otpInput.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && otpInput.value === '') {
            if (index > 0) {
                otpInputs[index - 1].focus(); // Move to the previous input
            }
        }
    });
});

// Verify email and show OTP container
window.verifyEmail = function() {
    const newEmail = newEmailInput.value.trim(); // Get the new email entered by the user

    // Check if the new email already exists in the members list (excluding the logged-in member)
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const emailTaken = members.some(m => m.email === newEmail && m.email !== loggedInEmail);

    if (emailTaken) {
        // If the email is already taken by another grievance member
        alert('The email is already in use by another grievance member. Please choose a different email.');
        return; // Prevent OTP container from showing
    }

    // If the email is valid, show OTP container
    otpContainer.style.display = 'block';
    verifyButton.disabled = true; // Disable verify button once clicked
    otpInputs[0].focus();
}

// Automatically move to the next input when a digit is entered
otpInputs.forEach((otpInput, index) => {
    otpInput.addEventListener('input', () => {
        if (otpInput.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus(); // Move to the next input
        }
    });

    // Automatically move to the previous input when backspace is pressed
    otpInput.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && otpInput.value === '') {
            if (index > 0) {
                otpInputs[index - 1].focus(); // Move to the previous input
            }
        }
    });
});

// Submit OTP and verify it
window.submitOTP = function() {
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');

    if (enteredOTP === correctOTP) {
        // OTP is correct, hide OTP error message after 2 seconds
        otpError.style.display = 'none';
        
        // Change the Submit OTP button to "OTP Verified" and disable it
        submitOtpButton.disabled = true;
        submitOtpButton.innerHTML = 'OTP Verified';
        submitOtpButton.style.backgroundColor = 'orange';
        submitOtpButton.style.color = 'black';

        // Now enable the Update Profile button
        updateProfileButton.style.display = 'inline-block';
        updateProfileButton.disabled = false;

        // After OTP is verified, change the "Verify" button to "Verified"
        verifyButton.innerHTML = 'Verified';
        verifyButton.style.backgroundColor = 'orange';
        verifyButton.style.cursor = 'not-allowed';
        verifyButton.style.color = 'black';
    } else {
        // OTP is incorrect, show error message
        otpError.style.display = 'block';
        // Hide the error message after 2 seconds
        setTimeout(() => {
            otpError.style.display = 'none';
        }, 2000);
    }
}

// Form submit: Compare old email with the admin/grievance member email before submitting
document.getElementById('edit-profile-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the old email entered by the user
    const oldEmail = oldEmailInput.value.trim();

    // Compare the old email with the logged-in user email (admin or grievance-member)
    if (oldEmail !== loggedInEmail) {
        // If the old email doesn't match the logged-in email, show an error
        alert('The old email does not match the logged-in email.');

        oldEmailInput.value = ''; // Clear the new email field
        return; // Prevent form submission
    }

    // If everything is correct, proceed with the profile update
    const messageElement = document.getElementById('edit-profile-success-message');
    if (messageElement) {
        messageElement.style.display = 'block';
        
        // Hide the success message after 2 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 2000);
    }

    // Update email in localStorage (admin or grievance member)
    const newEmail = newEmailInput.value.trim();

    if (loggedInUserType === 'admin') {
        updateAdminEmail(newEmail);
    } else if (loggedInUserType === 'grievance-member') {
        updateGrievanceMemberEmail(newEmail);
    }

    // Reset the form and UI elements after successful update
    document.getElementById('edit-profile-form').reset();
    otpContainer.style.display = 'none'; // Hide OTP container
    verifyButton.style.display = 'none'; // Hide verify button
    updateProfileButton.disabled = true; // Disable the profile update button
    otpError.style.display = 'none'; // Hide OTP error
});

// Function to update admin email and store it in localStorage
function updateAdminEmail(newEmail) {
    // Save the new admin email in localStorage
    localStorage.setItem('adminEmail', newEmail);
    loggedInEmail = newEmail; // Update the loggedInEmail variable

    // Optionally, update the password as well
    const newPassword = localStorage.getItem('adminPassword'); // If you want to update the password, you can do it here
    localStorage.setItem('adminPassword', newPassword);
}

// Function to update grievance member email and store it in localStorage
function updateGrievanceMemberEmail(newEmail) {
    const members = JSON.parse(localStorage.getItem('members')) || [];
    
    // Check if the new email already exists in the members list (excluding the logged-in member)
    const emailTaken = members.some(m => m.email === newEmail && m.email !== loggedInEmail);
    
    if (emailTaken) {
        // If the email is already taken by another grievance member
        alert('The email is already in use by another grievance member. Please choose a different email.');
        return; // Prevent email update
    }

    const memberIndex = members.findIndex(m => m.email === loggedInEmail);
    
    if (memberIndex !== -1) {
        members[memberIndex].email = newEmail; // Update grievance member's email
        localStorage.setItem('members', JSON.stringify(members)); // Save updated members list
        loggedInEmail = newEmail; // Update the logged-in email
    }
}
});
 
// Function to check if new passwords match and validate the password strength
function checkPasswordMatch() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    const errorElement = document.getElementById('password-error');

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()+}{":;'?/>.<,])[A-Za-z\d!@#$%^&*()+}{":;'?/>.<,]{8,}$/;

    let valid = true;
    
    // Reset all condition styles to red before checking
    resetPasswordConditions();

    // Check if the new password is not the same as the current password, but only on form submission
    if (currentPassword === newPassword) {
        errorElement.textContent = 'New password should not be the same as the current password.';
        valid = false;

        // Hide the error message after 2 seconds
        setTimeout(() => {
            errorElement.textContent = '';  // Clear the error message after 2 seconds
        }, 2000);
    }

    // Check password strength requirements
    if (newPassword.length >= 8) {
        document.getElementById('min-length').style.color = 'green';
    }

    if (/[A-Z]/.test(newPassword)) {
        document.getElementById('uppercase').style.color = 'green';
    }

    if (/\d/.test(newPassword)) {
        document.getElementById('number').style.color = 'green';
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        document.getElementById('special-char').style.color = 'green';
    }

    // Only show "Passwords do not match!" error if both fields are filled
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match!';
        valid = false;

        // Hide the error message after 2 seconds
        setTimeout(() => {
            errorElement.textContent = '';  // Clear the error message after 2 seconds
        }, 2000);
    }

    if (valid) {
        document.getElementById('password-error').textContent = ''; // Clear any previous error message
    }

    return valid;
}
// Reset password condition styles (turn everything to red initially)
function resetPasswordConditions() {
    document.getElementById('min-length').style.color = 'red';
    document.getElementById('uppercase').style.color = 'red';
    document.getElementById('number').style.color = 'red';
    document.getElementById('special-char').style.color = 'red';
}

// Show error message for a brief period (2 seconds)
function showPasswordError(message) {
    const errorElement = document.getElementById('password-error');
    errorElement.textContent = message;
    setTimeout(() => {
        errorElement.textContent = ''; // Hide error after 2 seconds
    }, 2000);
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const inputId = toggle.getAttribute('data-input');
            const inputElement = document.getElementById(inputId);
            
            // Toggle between password and text input types
            if (inputElement.type === 'password') {
                inputElement.type = 'text';
                toggle.classList.remove('fa-eye');
                toggle.classList.add('fa-eye-slash');
            } else {
                inputElement.type = 'password';
                toggle.classList.remove('fa-eye-slash');
                toggle.classList.add('fa-eye');
            }
        });
    });
});

// Listen for changes in the "New Password" field to dynamically check conditions
document.getElementById('new-password').addEventListener('input', function () {
    checkPasswordMatch(); // Re-validate every time the user types in the password field
});

 // Sign out function
 function signOut() {
    window.location.href = 'index.html'; // Adjust the URL to match your login page
 }

    // Initialize members array
    const members = JSON.parse(localStorage.getItem('members')) || []; // Load saved grievances

    // Function to populate the table with data
    function populateTable() {
        const tableBody = document.querySelector('#members-table tbody');
        tableBody.innerHTML = ''; // Clear the table before populating
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.srNo}</td>
                <td>${member.name}</td>
                <td>${member.gender}</td>
                <td>${member.designation}</td>
                <td>${member.email}</td>
                <td>${member.contact}</td>
                <td><button class="action-button" onclick="deleteMember(${member.srNo})"><i class="fas fa-trash-alt"></i></button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to handle member deletion
    function deleteMember(srNo) {
        const confirmation = confirm('Are you sure you want to delete this member?');
        if (confirmation) {
            // Remove the member from the data array
            const index = members.findIndex(member => member.srNo === srNo);
            if (index !== -1) {
                members.splice(index, 1);
                 // Save updated members to localStorage
                 localStorage.setItem('members', JSON.stringify(members));
                // Refresh the table
                populateTable();
            }
        }
    }

// Function to check if email already exists
function isEmailTaken(email) {
    return members.some(member => member.email === email);
}

// Function to check if contact number already exists
function isContactTaken(contact) {
    return members.some(member => member.contact === contact);
}

// Function to validate contact number (must be exactly 10 digits)
function isValidContact(contact) {
    return contact.length === 10 && !isNaN(contact);
}

// Function to hide error messages after 2 seconds
function hideErrorAfterTimeout(element) {
    setTimeout(() => {
        element.style.display = 'none';
    }, 2000);
}

    // Handle form submission
    document.getElementById('add-member-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form values
        const name = document.getElementById('member-name').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const designation = document.getElementById('member-degination').value;
        const email = document.getElementById('member-email').value;
        const contact = document.getElementById('member-contact').value;
        const password = document.getElementById('member-password').value;
 // Hide all error messages initially
 document.getElementById('email-error').style.display = 'none';
 document.getElementById('contact-error').style.display = 'none';
 document.getElementById('contact-length-error').style.display = 'none';

 let isValid = true;

 // Check if email already exists
 if (isEmailTaken(email)) {
     const emailError = document.getElementById('email-error');
     emailError.style.display = 'block';  // Show the error message
     hideErrorAfterTimeout(emailError);  // Hide after 2 seconds
     isValid = false;
 }

 // Check if contact number already exists
 if (isContactTaken(contact)) {
     const contactError = document.getElementById('contact-error');
     contactError.style.display = 'block';  // Show the error message
     hideErrorAfterTimeout(contactError);  // Hide after 2 seconds
     isValid = false;
 }

 // Validate contact number length (must be exactly 10 digits)
 if (!isValidContact(contact)) {
     const contactLengthError = document.getElementById('contact-length-error');
     contactLengthError.style.display = 'block';  // Show the error message
     hideErrorAfterTimeout(contactLengthError);  // Hide after 2 seconds
     isValid = false;
 }

 // If there are validation errors, return without submitting the form
 if (!isValid) {
     return;
 }

        // Generate new member object
        const newMember = {
            srNo: members.length + 1,
            name,
            gender,
            designation,
            email,
            contact,
            password
        };

        // Add new member to the array and refresh the table
        members.push(newMember);
        // Save updated members to localStorage
        localStorage.setItem('members', JSON.stringify(members));
        populateTable();

        // Show success message and reset the form
        document.getElementById('form-success-message').style.display = 'block';
        setTimeout(() => {
            document.getElementById('form-success-message').style.display = 'none';
        }, 3000);
        document.getElementById('add-member-form').reset();
    });

    // Populate the table on page load (if you want to add some initial data, you can do it here)
    document.addEventListener('DOMContentLoaded', populateTable);

    async function getApprovedMember(collection){
        try{
            const response = await fetch(url+'/api/v1/get_approved_users');
            const responseJson = await response.json();
            if(collection=="student"){
                return responseJson[0];
            }
            else if(collection=="teacher"){
                return responseJson[1];
            }
            else{
                return responseJson[2];
            }
        }
        catch(error){
            console.log("error");
            alert(`${error} caused failure`);
        }

    }




    async function getNotApprovedMember(collection){
        try{
            const response = await fetch(url+"/api/v1/admin/get_pending_approval_users");
            const responseJson = await response.json();
            if(collection=="student"){
                return responseJson[0];
            }
            else if(collection=="teacher"){
                return responseJson[1];
            }
            else{
                return responseJson[2];
            }
        }
        catch(error){
            console.log("error");
            alert(`${error} caused failure`);
        }

    }

    

     // Function to display pending students
     async function displayStudents() {
        const students = await getNotApprovedMember("student");
        console.table(students);
        const tbody = document.querySelector('#studentTable tbody');
        
        tbody.innerHTML = ''; // Clear existing entries
        
        students.forEach((student, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
               <td>${index + 1}</td>
               <td>${student.name}</td>
               <td>${student.gender}</td>
               <td>${student.course}</td>
               <td>${student.batch}</td>
               <td>${student.roll_no}</td>
               <td>${student.email}</td>
               <td>${student.contact_number}</td>
               <td>
                   <button class="approveStudentBtn" data-index="${index}">Approve</button>
                   <button class="deleteStudentBtn" data-index="${index}">Delete</button>
               </td>
           `;
           tbody.appendChild(row);
       });
   
       // Attach event listeners for the buttons
       document.querySelectorAll('.approveStudentBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               approveStudent(index);
           });
       });
   
       document.querySelectorAll('.deleteStudentBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteStudent(index);
           });
       });
   }
   
   // Function to display approved students
   async function displayApprovedStudents() {
       const approvedStudents = await getApprovedMember("student");
       console.table(approvedStudents);
       const tbody = document.querySelector('#approvedStudents tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       approvedStudents.forEach((student, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
               <td>${index + 1}</td>
               <td>${student.name}</td>
               <td>${student.gender}</td>
               <td>${student.course}</td>
               <td>${student.batch}</td>
               <td>${student.roll_no}</td>
               <td>${student.email}</td>
               <td>${student.contact_number}</td>
               <td><button class="deleteStudentBtn" data-index="${index}">Delete</button></td>
           `;
           tbody.appendChild(row);
       });
   
       document.querySelectorAll('.deleteStudentBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteApprovedStudent(index);
           });
       });
   }
   
   // Function to delete a student
   function deleteStudent(index) {
       const students = JSON.parse(localStorage.getItem('students')) || [];
       students.splice(index, 1);
       localStorage.setItem('students', JSON.stringify(students));
       displayStudents(); // Refresh the displayed list
   }
   
   // Function to delete approved student
   function deleteApprovedStudent(index) {
       const approvedStudents = JSON.parse(localStorage.getItem('approvedStudents')) || [];
       approvedStudents.splice(index, 1);
       localStorage.setItem('approvedStudents', JSON.stringify(approvedStudents));
       displayApprovedStudents();
   }
   
   // Function to approve a student
   function approveStudent(index) {
       const students = JSON.parse(localStorage.getItem('students')) || [];
       const approvedStudents = JSON.parse(localStorage.getItem('approvedStudents')) || [];
       const approvedStudent = students.splice(index, 1)[0]; // Move student to approved list
       approvedStudents.push(approvedStudent);
   
       // Save updated data to localStorage
       localStorage.setItem('students', JSON.stringify(students));
       localStorage.setItem('approvedStudents', JSON.stringify(approvedStudents));
   
       // Refresh both tables
       displayStudents();
       displayApprovedStudents();
   }
   
   
   // Function to display pending teachers
   async function displayTeachers() {
       const teachers = await getNotApprovedMember('teacher');
       console.table(teachers);
       const tbody = document.querySelector('#teacherTable tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       teachers.forEach((teacher, index) => {
           // Check if the teacher is valid and has the necessary properties
           if (teacher && teacher.name) { 
               const row = document.createElement('tr');
               row.innerHTML = `
                   <td>${index + 1}</td>
                   <td>${teacher.name}</td>
                   <td>${teacher.gender || 'N/A'}</td>
                   <td>${teacher.department || 'N/A'}</td>
                   <td>${teacher.designation || 'N/A'}</td>
                   <td>${teacher.email || 'N/A'}</td>
                   <td>${teacher.mobile_no || 'N/A'}</td>
                   <td>
                       <button class="approveTeacherBtn" data-index="${index}">Approve</button>
                       <button class="deleteTeacherBtn" data-index="${index}">Delete</button>
                   </td>
               `;
               tbody.appendChild(row);
           } else {
               console.warn('Teacher at index ${index} is null or missing name', teacher); // Log the problematic teacher entry
           }
       });
   
       // Attach event listeners for the buttons
       document.querySelectorAll('.approveTeacherBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               approveTeacher(index);
           });
       });
   
       document.querySelectorAll('.deleteTeacherBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteTeacher(index);
           });
       });
   }
   
   // Function to display approved teachers
   async function displayApprovedTeachers() {
       const approvedTeachers = await getNotApprovedMember('teacher');
       const tbody = document.querySelector('#approvedTeachers tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       approvedTeachers.forEach((teacher, index) => {
           // Check if the teacher is valid and has the necessary properties
           if (teacher && teacher.name) {
               const row = document.createElement('tr');
               row.innerHTML = `
                   <td>${index + 1}</td>
                   <td>${teacher.name}</td>
                   <td>${teacher.gender || 'N/A'}</td>
                   <td>${teacher.department || 'N/A'}</td>
                   <td>${teacher.designation || 'N/A'}</td>
                   <td>${teacher.email || 'N/A'}</td>
                   <td>${teacher.mobile_no || 'N/A'}</td>
                   <td><button class="deleteTeacherBtn" data-index="${index}">Delete</button></td>
               `;
               tbody.appendChild(row);
           } else {
               console.warn('Approved teacher at index ${index} is null or missing name', teacher); // Log the problematic teacher entry
           }
       });
   
       document.querySelectorAll('.deleteTeacherBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteApprovedTeacher(index);
           });
       });
   }
   
   // Function to approve a teacher
   function approveTeacher(index) {
       const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
       const approvedTeachers = JSON.parse(localStorage.getItem('approvedTeachers')) || [];
   
       if (teachers[index]) { // Ensure the teacher exists before trying to approve
           const approvedTeacher = teachers.splice(index, 1)[0]; // Move teacher to approved list
           approvedTeachers.push(approvedTeacher);
   
           // Save updated data to localStorage
           localStorage.setItem('teachers', JSON.stringify(teachers));
           localStorage.setItem('approvedTeachers', JSON.stringify(approvedTeachers));
   
           // Refresh both tables
           displayTeachers();
           displayApprovedTeachers();
       } else {
           console.error('No teacher found at index ${index}'); // Log an error if no teacher is found
       }
   }
   
   // Function to delete a teacher
   function deleteTeacher(index) {
       const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
       teachers.splice(index, 1);
       localStorage.setItem('teachers', JSON.stringify(teachers));
       displayTeachers(); // Refresh the displayed list
   }
   
   // Function to delete approved teacher
   function deleteApprovedTeacher(index) {
       const approvedTeachers = JSON.parse(localStorage.getItem('approvedTeachers')) || [];
       approvedTeachers.splice(index, 1);
       localStorage.setItem('approvedTeachers', JSON.stringify(approvedTeachers));
       displayApprovedTeachers();
   }
   
   
   
   // Function to display pending staff
   async function displayStaff() {
    const staff = await getNotApprovedMember('staff');
       const tbody = document.querySelector('#staffTable tbody');
       tbody.innerHTML = ''; // Clear existing entries
   
       staff.forEach((staffMember, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
               <td>${index + 1}</td>
               <td>${staffMember.name}</td>
               <td>${staffMember.gender || 'N/A'}</td>
               <td>${staffMember.department || 'N/A'}</td>
               <td>${staffMember.designation || 'N/A'}</td>
               <td>${staffMember.email || 'N/A'}</td>
               <td>${staffMember.mobile_no || 'N/A'}</td>
               <td>
                   <button class="approveStaffBtn" data-index="${index}">Approve</button>
                   <button class="deleteStaffBtn" data-index="${index}">Delete</button>
               </td>
           `;
           tbody.appendChild(row);
       });
   
       // Attach event listeners for the buttons
       document.querySelectorAll('.approveStaffBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               approveStaff(index);
           });
       });
   
       document.querySelectorAll('.deleteStaffBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteStaff(index);
           });
       });
   }
   // Function to display approved staff

   async function displayApprovedStaff() {
        const approvedStaff = await getApprovedMember('teacher');
       const tbody = document.querySelector('#approvedStaff tbody');
       console.table(approvedStaff);
       tbody.innerHTML = ''; // Clear existing entries
   
       approvedStaff.forEach((staffMember, index) => {
           // Check if staffMember is defined
           if (staffMember && staffMember.name) {
               const row = document.createElement('tr');
               row.innerHTML = `
                   <td>${index + 1}</td>
                   <td>${staffMember.name}</td>
                   <td>${staffMember.gender || 'N/A'}</td>
                   <td>${staffMember.department || 'N/A'}</td>
                   <td>${staffMember.designation || 'N/A'}</td>
                   <td>${staffMember.email || 'N/A'}</td>
                   <td>${staffMember.mobile_no || 'N/A'}</td>
                   <td><button class="deleteStaffBtn" data-index="${index}">Delete</button></td>
               `;
               tbody.appendChild(row);
           } else {
               console.warn(`Approved staff member at index ${index} is null or missing name`, staffMember);
           }
       });
   
       document.querySelectorAll('.deleteStaffBtn').forEach(button => {
           button.addEventListener('click', function () {
               const index = this.dataset.index;
               deleteApprovedStaff(index);
           });
       });
   }
   
   // Function to delete a staff member
   function deleteStaff(index) {
       const staff = JSON.parse(localStorage.getItem('staff')) || [];
       staff.splice(index, 1);
       localStorage.setItem('staff', JSON.stringify(staff));
       displayStaff(); // Refresh the displayed list
   }
   
   // Function to delete approved staff member
   function deleteApprovedStaff(index) {
       const approvedStaff = JSON.parse(localStorage.getItem('approvedStaff')) || [];
       approvedStaff.splice(index, 1);
       localStorage.setItem('approvedStaff', JSON.stringify(approvedStaff));
       displayApprovedStaff();
   }
   function approveStaff(index) {
       const staff = JSON.parse(localStorage.getItem('staff')) || [];
       const approvedStaff= JSON.parse(localStorage.getItem('approvedStaff')) || [];
       const approvedStaffMember = staff.splice(index, 1)[0]; // Move student to approved list
       approvedStaff.push(approvedStaffMember);
   
       // Save updated data to localStorage
       localStorage.setItem('staff', JSON.stringify(staff));
       localStorage.setItem('approvedStaff', JSON.stringify(approvedStaff));
   
       // Refresh both tables
       displayStaff();
       displayApprovedStaff();
   }
   
   // Define a single function to initialize the display of all entities
   function initialize() {
       displayStudents();          // Call to display students
       displayTeachers();          // Call to display teachers
       displayApprovedStudents();  // Call to display approved students
       displayApprovedTeachers();  // Call to display approved teachers
       displayStaff();             // Call to display staff
       displayApprovedStaff();     // Call to display approved staff
   }
   
   
   // Assign the initialize function to window.onload
   window.onload = initialize;
   
   // Handling student form submission
   document.getElementById('student-form').addEventListener('submit', function (event) {
       event.preventDefault();
   
       // Get values from the form
       const name = document.getElementById('student-name').value;
       const gender = document.querySelector('input[name="gender"]:checked').value;
       const course = document.getElementById('course').value;
       const batch = document.getElementById('batch').value;
       const roll_no = document.getElementById('roll-no').value;
       const email = document.getElementById('email').value;
       const mobile_no = document.getElementById('contact-number').value;
       const password = document.getElementById('password').value;
   
       const studentData = { name, gender, course, batch, roll_no, email, mobile_no,password };
   
       // Save the data to local storage
       const existingStudents = JSON.parse(localStorage.getItem('students')) || [];
       existingStudents.push(studentData);
       localStorage.setItem('students', JSON.stringify(existingStudents));
       
   
       // Show success message
       const successMessage = document.getElementById('success-message');
       successMessage.style.display = 'block';
   
       // Refresh the displayed students
       displayStudents();
   });
   
   // Handling teacher form submission
   document.getElementById('teacher-form').addEventListener('submit', function (event) {
       event.preventDefault();
   
       // Get values from the form
       const name = document.getElementById('teacher-name').value;
       const gender = document.querySelector('input[name="gender"]:checked').value;
       const department = document.getElementById('department').value;
       const designation = document.getElementById('designation').value;
       const email = document.getElementById('teacher-email').value;
       const mobile_no = document.getElementById('teacher-contact').value;
       const password = document.getElementById('password').value;
   
       const teacherData = { name, gender, department, designation, email, mobile_no, password };
   
       // Save the data to local storage
       const existingTeachers = JSON.parse(localStorage.getItem('teachers')) || [];
       existingTeachers.push(teacherData);
       localStorage.setItem('teachers', JSON.stringify(existingTeachers));
   
       // Show success message
       const successMessage = document.getElementById('success-message');
       successMessage.style.display = 'block';
   
       // Refresh the displayed teachers
       displayTeachers();
   });
   
   // Handling staff form submission
   document.getElementById('staff-form').addEventListener('submit', function (event) {
       event.preventDefault();
   
       // Get values from the form
       const name = document.getElementById('staff-name').value;
       const gender = document.querySelector('input[name="gender"]:checked').value;
       const department = document.getElementById('staff-department').value;
       const designation = document.getElementById('staff-designation').value; // Corrected from 'designation' to 'staff-designation'
       const email = document.getElementById('staff-email').value;
       const mobile_no = document.getElementById('staff-contact').value;
       const password = document.getElementById('password').value;
   
       const staffData = { name, gender, department, designation, email, mobile_no, password };
   
       // Save the data to local storage
       const existingStaff = JSON.parse(localStorage.getItem('staff')) || [];
       existingStaff.push(staffData);
       localStorage.setItem('staff', JSON.stringify(existingStaff));
   
       // Show success message
       const successMessage = document.getElementById('success-message');
       successMessage.style.display = 'block';
   
       // Refresh the displayed staff
       displayStaff();
    });
   
   
   
   
   
   

