window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add the event listener for the login form submission
document.getElementById('index-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;

    console.log(userType)

    // Ensure the user type is selected
    if (!userType) {
        showNotification('Please select a user type.');
        return;
    }


    // Check if it's a grievance member trying to log in as admin
    if (userType === 'grievance-member') {
        // Fetch grievance members from localStorage
        const members = JSON.parse(localStorage.getItem('members')) || [];

        // Check if the email exists in the grievance members list
        const member = members.find(m => m.email === email);

        if (!member) {
            // If member is not in the grievance list
            showNotification('You are not authorized as a grievance member.');
            return;
        } else if (member.password !== password) {
            // If password doesn't match
            showNotification('Invalid grievance member password.');
            return;
        } else {
            // If member exists and password is correct, log in as grievance admin
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loggedInUserType', 'grievance-member');
            localStorage.setItem('loggedInMemberEmail', member.email); // Store email

            window.location.href = 'Admin.html'; // Redirect to grievance admin page
            return;
        }
    }

    

    // Check if it's a regular admin login attempt
    if (userType === 'admin') {
        // Get the stored admin email and password from localStorage
        // localStorage.setItem('adminEmail', 'bias@gmail.com'); 
        // localStorage.setItem('adminPassword', '12345');  
        const storedAdminEmail = localStorage.getItem('adminEmail');
        const storedAdminPassword = localStorage.getItem('adminPassword');

        if (email === storedAdminEmail && password === storedAdminPassword) {
            // Admin login is successful
            localStorage.setItem('isAdminLoggedIn', 'true');
            localStorage.setItem('loggedInUserType', 'admin');
            window.location.href = 'Admin.html'; // Redirect to the Admin page
            return;
        } else if (email !== storedAdminEmail) {
            showNotification('Admin does not exist.');
            return;
        } else {
            showNotification('Invalid admin password. Please try again.');
            return;
        }
    }

    // Other user types can be handled here (students, teachers, etc.)
    // Fetch approved users from localStorage for each user type
    const approvedUsers = {
        student: JSON.parse(localStorage.getItem('approvedStudents')) || [],
        teacher: JSON.parse(localStorage.getItem('approvedTeachers')) || [],
        staff: JSON.parse(localStorage.getItem('approvedStaff')) || []
    };
    // Get the user list for the selected user type
    const userList = approvedUsers[userType] || [];

    // Debug: Print the user list in the console for checking
    console.log('User list for userType:', userType, userList);

    // Find if the user exists in the approved list (matching email and password)
    const user = userList.find(u => u.email === email && u.password === password);
    console.log('Attempting to log in user:', user);

    if (user) {
        // Store logged-in status in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUserType', userType);
        localStorage.setItem('email', user.email);


        // Redirect to the login page for regular users
        window.location.href = 'Login.html';
    } else {
        showNotification('Invalid email, password, or the user is not approved.');
    }
});
// Function to display notifications
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}


function login(email, password) {
    const user = allApprovedUsers.find(user => user.email === email);
    if (user && user.password === password) {
        return "Login successful.";
    } else {
        return "Invalid email or password.";
    }
}




