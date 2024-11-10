
function showSection(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function signOut() {
    window.location.href = 'index.html'; // Redirect to login page
}


function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contactNumber = document.getElementById('contact-number').value;
    const userType = document.getElementById('user-type').value; // Add a dropdown or field to capture user type

    // Determine the storage key based on the user type
    const storageKey = getStorageKey(userType);

    // Retrieve the approved list from localStorage
    const approvedUsers = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Check if the user already exists in the approved list
    const existingUserIndex = approvedUsers.findIndex(user => user.email === email);

    // Prepare updated user data
    const updatedUserData = {
        name: name,
        email: email,
        mobile_no: contactNumber,
        // Add any other fields as needed, such as gender, course, batch, etc.
    };

    // If the user exists, update their record; otherwise, show the custom alert
    if (existingUserIndex > -1) {
        approvedUsers[existingUserIndex] = { ...approvedUsers[existingUserIndex], ...updatedUserData };
    } else {
        showCustomAlert("Please Enter The Correct Email ID and User Type");
        return; // Exit if the email is incorrect
    }

    // Save the updated approved list back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(approvedUsers));

    // Display success message
    const successMessage = document.getElementById('edit-profile-success');
    successMessage.style.display = 'block';

    // Hide the success message after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);

    // Reset the form
    document.getElementById('edit-profile-form').reset();
}

// Function to show the custom alert box in the center
function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    
    // Set the alert message
    alertMessage.textContent = message;

    // Display the alert box
    alertBox.style.display = 'block';

    // Hide the alert box after 2 seconds
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}

// Helper function to determine the storage key based on user type
function getStorageKey(userType) {
    switch (userType) {
        case 'student':
            return 'approvedStudents';
        case 'teacher':
            return 'approvedTeachers';
        case 'staff':
            return 'approvedStaff';
        default:
            return null;
    }
} 





// const nam =document.getElementById('Name');
document.getElementById('post-grievance-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const grievantType = document.getElementById('grievant-type').value;
    const grievantName = document.getElementById('grievant-name').value;
    const grievanceTitle = document.getElementById('grievance-title').value;
    const grievanceDescription = document.getElementById('grievance-description').value;

    // Create a unique grievance number and current date (dd-mm-yyyy format)
    const grievanceNumber = 'CPN-' + Math.floor(10000 + Math.random() * 9000000) + 1; // Unique grievance number
    const grievantID = 'GR-' + Math.floor(100000 + Math.random() * 9000000); // Unique grievant ID
    const grievanceDate = new Date().toLocaleDateString('en-GB'); // Get current date in dd-mm-yyyy format

    // Create a grievance object with all data
    const grievanceData = { grievantType, grievantName, grievanceTitle, grievanceDescription, grievanceNumber, grievanceDate, grievantID, status: 'Open' };

    // Retrieve existing grievances from localStorage
    const existingGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');

    // Add the new grievance to the array
    existingGrievances.push(grievanceData);

    // Save the updated grievances array back to localStorage
    localStorage.setItem('grievances', JSON.stringify(existingGrievances));

    // Display the success message
    document.getElementById('post-grievance-success').style.display = 'block';

    // Optionally, reset the form fields
    this.reset();

    // Optionally, hide the success message after a few seconds
    setTimeout(function() {
        document.getElementById('post-grievance-success').style.display = 'none';
    }, 3000); // Hide after 3 seconds

    // Refresh the grievances table to show the new grievance
    displayGrievances();
});

// Function to display grievances
function displayGrievances() {
    const tbody = document.querySelector('#my-grievance-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // Retrieve grievances from local storage
    const storedGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');

    // Check if there are no grievances
    if (storedGrievances.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No grievances posted yet.</td></tr>';
        return;
    }

    // Iterate over each grievance and insert it into the table
    storedGrievances.forEach((grievance, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${grievance.grievantID}</td>
            <td>${grievance.grievanceTitle}</td>
            <td>${grievance.grievanceDescription}</td>
            <td>${grievance.status}</td>
            <td><button class="view-button" style="color: white; background-color: #1abc9c; padding: 5px; border: none; border-radius: 4px; cursor: pointer;" data-index="${index}">View</button></td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to the View buttons
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', function() {
            const grievanceIndex = this.getAttribute('data-index');
            showGrievanceModal(storedGrievances[grievanceIndex]);
        });
    });
}

function showGrievanceModal(grievance) {
    document.getElementById('modal-grievant-id').innerText = grievance.grievantID;
    document.getElementById('modal-grievant-name').innerText = grievance.grievantName || 'N/A';
    document.getElementById('modal-title').innerText = grievance.grievanceTitle;
    document.getElementById('modal-description').innerText = grievance.grievanceDescription;
    document.getElementById('modal-date').innerText = grievance.grievanceDate || 'N/A';
    document.getElementById('modal-status').innerText = grievance.status;

    // Display all replies in chronological order
    const allReplies = grievance.replies || [];
    let contentHtml = '';

    allReplies.forEach(reply => {
        const { user, date, message } = reply;
        contentHtml += `<strong>${user}:</strong> ${date}<br>${message}<br><br>`;
    });

    // If there are no replies yet
    if (allReplies.length === 0) {
        contentHtml = 'No replies yet';
    }

    document.getElementById('modal-reply').innerHTML = contentHtml;

    // Show modal and overlay
    document.getElementById('grievance-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';

    // Add event listeners to action buttons
    document.getElementById('reopen-button').onclick = function() {
        document.getElementById('feedback-row').style.display = 'table-row';
    };

    document.getElementById('satisfied-button').onclick = function() {
        updateGrievanceStatus(grievance.grievantID, 'Satisfied');
    };

    // Handle feedback submission
    document.getElementById('submit-feedback-button').onclick = function() {
        const feedback = document.getElementById('feedback-text').value;
        if (feedback.trim() !== '') {
            addFeedbackToGrievance(grievance.grievantID, feedback, "User Reply");
        } else {
            alert("Please enter feedback before submitting.");
        }
    };
}

function addFeedbackToGrievance(grievantID, feedback, userType) {
    const storedGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
    const grievanceIndex = storedGrievances.findIndex(grievance => grievance.grievantID === grievantID);

    if (grievanceIndex !== -1) {
        const date = new Date().toLocaleDateString();
        const formattedReply = {
            user: userType,
            date: date,
            message: feedback
        };

        // Append reply to the list of replies
        if (!storedGrievances[grievanceIndex].replies) {
            storedGrievances[grievanceIndex].replies = [];
        }
        storedGrievances[grievanceIndex].replies.push(formattedReply);

        // Update grievance status to 'Re-Open'
        storedGrievances[grievanceIndex].status = 'Re-Open';
        localStorage.setItem('grievances', JSON.stringify(storedGrievances));

        // Update status in modal and refresh replies
        document.getElementById('modal-status').innerText = 'Re-Open';
        showGrievanceModal(storedGrievances[grievanceIndex]);

        // Hide feedback row and clear feedback input
        document.getElementById('feedback-row').style.display = 'none';
        document.getElementById('feedback-text').value = '';

        // Refresh grievances display
        displayGrievances();
    }
}

// Function to update grievance status in localStorage
function updateGrievanceStatus(grievantID, newStatus) {
    const storedGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
    const grievanceIndex = storedGrievances.findIndex(grievance => grievance.grievantID === grievantID);

    if (grievanceIndex !== -1) {
        // Update grievance status to 'Satisfied'
        storedGrievances[grievanceIndex].status = newStatus;
        localStorage.setItem('grievances', JSON.stringify(storedGrievances));

        // Update modal status text and close modal
        document.getElementById('modal-status').innerText = newStatus;
        document.getElementById('grievance-modal').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';

        // Refresh grievances display
        displayGrievances();
    }
}

// Close modal when clicking the close button
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('grievance-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
});

// Call the function to display the data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayGrievances();
});















function checkPasswordStrength() {
    const password = document.getElementById('new-password').value;
    const strengthBars = document.querySelectorAll('.strength-bar');
    const requirements = {
        length: /(?=.{8,})/,
        uppercase: /(?=.*[A-Z])/,
        number: /(?=.*\d)/,
        specialChar: /(?=.[!@#$%^&])/,
    };

    let strength = 0;
    if (requirements.length.test(password)) strength++;
    if (requirements.uppercase.test(password)) strength++;
    if (requirements.number.test(password)) strength++;
    if (requirements.specialChar.test(password)) strength++;

    strengthBars.forEach((bar, index) => {
        if (index < strength) {
            bar.classList.add('strong');
            bar.classList.remove('medium');
        } else if (index === strength) {
            bar.classList.add('medium');
            bar.classList.remove('strong');
        } else {
            bar.classList.remove('medium', 'strong');
        }
    });

    document.getElementById('length-requirement').classList.toggle('valid', requirements.length.test(password));
    document.getElementById('uppercase-requirement').classList.toggle('valid', requirements.uppercase.test(password));
    document.getElementById('number-requirement').classList.toggle('valid', requirements.number.test(password));
    document.getElementById('special-char-requirement').classList.toggle('valid', requirements.specialChar.test(password));
}
function handlePasswordChange(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const userType = localStorage.getItem('loggedInUserType');
    const loggedInEmail = localStorage.getItem('email'); // assuming email of logged user is saved on login
    
    console.log("User Type:", userType);
    console.log("Logged In Email:", loggedInEmail);

    // Validate passwords
    if (!validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
        return; // Exit if validation fails
    }

    let approvedListKey;
    switch (userType) {
        case "student":
            approvedListKey = 'approvedStudents';
            break;
        case "teacher":
            approvedListKey = 'approvedTeachers';
            break;
        case "staff":
            approvedListKey = 'approvedStaff';
            break;
        default:
            showNotification("Invalid user type!");
            return;
    }

    // Get approved users list from localStorage
    const approvedList = JSON.parse(localStorage.getItem(approvedListKey)) || [];

    // Find the user by email
    const userIndex = approvedList.findIndex(user => user.email === loggedInEmail);

    if (userIndex === -1) {
        alertshowNotification("User not found in approved list.");
        return;
    }

    // Check if the current password is correct
    if (approvedList[userIndex].password !== currentPassword) {
        showNotification("Current password is incorrect!");
        return;
    }

    // Update the password
    approvedList[userIndex].password = newPassword;
    localStorage.setItem(approvedListKey, JSON.stringify(approvedList));
    showNotification("Password changed successfully!");
    document.getElementById("change-password-success").style.display = "block";

    // Clear the form
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    const passwordRequirements = {
        minLength: 8,
        hasUppercase: /[A-Z]/,
        hasNumber: /[0-9]/,
        hasSpecialChar: /[!@#$%^&*]/,
    };

    // Ensure new password is different from current password
    if (currentPassword === newPassword) {
        showNotification('New password cannot be the same as the current password.');
        return false;
    }

    // Check new password strength
    if (!passwordRequirements.hasUppercase.test(newPassword) ||
        !passwordRequirements.hasNumber.test(newPassword) ||
        !passwordRequirements.hasSpecialChar.test(newPassword) ||
        newPassword.length < passwordRequirements.minLength) {
            showNotification('New password does not meet the strength requirements.');
        return false;
    }

    // Ensure new password and confirm password match
    if (newPassword !== confirmPassword) {
        showNotification('New password and confirm password do not match.');
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', () => {

    const loggedInEmail = localStorage.getItem('email');
if (loggedInEmail) {
    // Extract the username from the email
    const userName = loggedInEmail.split('@')[0].match(/^[a-zA-Z]+/)[0]; // Gets the part before '@'
    document.getElementById('Name').textContent =  `Welcome ${userName}!!`;
} else {
    document.getElementById('Name').textContent = "Welcome";
}
    
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

document.addEventListener('DOMContentLoaded', () => {
    // Function to show notification
    window.showNotification = function(message) {
        const notification = document.getElementById("notification");
        const notificationMessage = document.getElementById("notificationMessage");
        notificationMessage.textContent = message; // Set the message
        notification.style.display = "block"; // Show the notification
    };

    // Add event listener to OK button to hide the notification and clear the form
    document.getElementById("notificationOkButton").onclick = function() {
        // Hide the notification
        document.getElementById("notification").style.display = "none";
        
        // Clear the form fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    };
});



