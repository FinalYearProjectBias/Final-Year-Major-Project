const url='https://backend-server-ohpm.onrender.com'
function toggleForm() {
    var role = document.getElementById("role").value;
    document.getElementById("student-form").style.display = "none";
    document.getElementById("teacher-form").style.display = "none";
    document.getElementById("staff-form").style.display = "none";

    if (role === "student") {
        document.getElementById("student-form").style.display = "block";
    } else if (role === "teacher") {
        document.getElementById("teacher-form").style.display = "block";
    } else if (role === "staff") {
        document.getElementById("staff-form").style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initially hide all error messages
    document.querySelectorAll('.error-message').forEach(errorElement => {
        errorElement.style.display = 'none';
    });
    document.querySelectorAll('.signup-form').forEach(form => {
        form.addEventListener('submit',async function (e) {
            e.preventDefault(); // Prevent default form submission
            
            const role = document.getElementById("role").value; // Get the selected role dynamically

            // Roll number uniqueness check for students
            const rollNo = document.getElementById('roll-no')?.value.trim();
            
            if (role === 'student') {                
                // Roll number uniqueness check
                

                
                const contact_number=document.getElementById('contact-number').value;
                console.log(contact_number);
                // Validate contact number (exactly 10 digits)
                if (contact_number.length !== 10 || isNaN(contact_number)) {
                    const contactNumberError = document.getElementById('contact-number-error');
                    contactNumberError.style.display = 'block';
                    contactNumberError.textContent = "Please enter a valid 10-digit contact number.";
                    hideErrorAfterTimeout(contactNumberError); // Hide after 2 seconds
                    return; // Prevent form submission
                }
                
                // If validation passes, handle student data
                const name = document.getElementById('student-name').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const course = document.getElementById('course').value;
                const batch = document.getElementById('batch').value;
                const password = document.getElementById('password').value;
                const email=document.getElementById('email').value;

                const studentData = { name, gender, course, batch, roll_no: rollNo, email, contact_number, password,user_type:'student'};
                console.log(studentData);
                // Safely parse and update localStorage with new student data
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/v1/student/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData),
                });
                console.log(studentData);
                console.log(await response.json());
             }
             
             
             else if (role === 'teacher') {
                // Email uniqueness check
                const email = document.getElementById('teacher-email').value.trim()
                // Contact Number uniqueness check
                const mobile_no = document.getElementById('teacher-contact').value.trim();
                

                // Validate contact number (exactly 10 digits)
                if (mobile_no.length !== 10 || isNaN(mobile_no)) {
                    const teacherContactError = document.getElementById('teacher-contact-error');
                    teacherContactError.style.display = 'block';
                    teacherContactError.textContent = "Please enter a valid 10-digit contact number.";
                    hideErrorAfterTimeout(teacherContactError); // Hide after 2 seconds
                    return; // Prevent form submission
                }
                const name = document.getElementById('teacher-name').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const department = document.getElementById('department').value;
                const designation = document.getElementById('designation').value;
            
              
                const password = document.getElementById('teacher-password').value;

                const teacherData = { name, gender, department, designation, email, contact_number:mobile_no, user_type:'teacher',password };
                // Safely parse localStorage data
            
                console.log(teacherData);
                // Safely parse and update localStorage with new student data
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/v1/faculty/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(teacherData),
                });
                console.log(teacherData);
                console.log(await response.json());

            } 
            
            else if (role === 'staff') {
                
                // Email uniqueness check
                
                const email = document.getElementById('staff-email').value;

                

                // Contact Number uniqueness check
                const mobile_no = document.getElementById('staff-contact').value;
                
                // Validate contact number (exactly 10 digits)
                if (mobile_no.length !== 10 || isNaN(mobile_no)) {
                    const  staffContactError = document.getElementById('staff-contact-error');
                    staffContactError.style.display = 'block';
                    staffContactError.textContent = "Please enter a valid 10-digit contact number.";
                    hideErrorAfterTimeout( staffContactError); // Hide after 2 seconds
                    return; // Prevent form submission
                }

                const name = document.getElementById('staff-name').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const department = document.getElementById('staff-department').value;
                const designation = document.getElementById('staff-designation').value;
                const password = document.getElementById('staff-password').value;

                const staffData = { name, gender, department, designation, email,contact_number: mobile_no, user_type: 'staff',password };

                
                // Safely parse localStorage data
                const response = await fetch('https://backend-server-ohpm.onrender.com/api/v1/faculty/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(staffData),
                });
                console.log(staffData);
                console.log(await response.json());
              
            }

            // Display success message and handle redirection
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block'; // Show success message

            form.reset(); // Reset the form

            // Redirect to the index page after 3 seconds
            setTimeout(function () {
                window.location.href = 'index.html'; // Redirect to index or another page
            }, 3000);
        });
    });
});


// Function to hide the error message after 2 seconds
function hideErrorAfterTimeout(errorElement) {
    setTimeout(() => {
        errorElement.style.display = 'none'; // Hide the error message after 2 seconds
    }, 2000);
}


const emailInputs = {
    student: document.getElementById("email"),
    teacher: document.getElementById("teacher-email"),
    staff: document.getElementById("staff-email")
};

const verifyButtons = {
    student: document.getElementById("student-verifyButton"),
    teacher: document.getElementById("teacher-verifyButton"),
    staff: document.getElementById("staff-verifyButton")
};

const otpSections = {
    student: document.getElementById("student-otpSection"),
    teacher: document.getElementById("teacher-otpSection"),
    staff: document.getElementById("staff-otpSection")
};

const otpInputs = {
    student: document.querySelectorAll("#student-otpSection .otp-input"),
    teacher: document.querySelectorAll("#teacher-otpSection .otp-input"),
    staff: document.querySelectorAll("#staff-otpSection .otp-input")
};

const confirmOtpButtons = {
    student: document.getElementById("student-confirmOtpButton"),
    teacher: document.getElementById("teacher-confirmOtpButton"),
    staff: document.getElementById("staff-confirmOtpButton")
};

const submitButtons = {
    student: document.querySelector("#student-form button[type='submit']"),
    teacher: document.querySelector("#teacher-form button[type='submit']"),
    staff: document.querySelector("#staff-form button[type='submit']")
};

const OTP = Math.floor(Math.random()*10000);
const url_otp="https://backend-server-ohpm.onrender.com/api/v1/user/otp/"


console.log(OTP); // Hardcoded OTP for testing purposes
const otpVerified = {
    student: false,
    teacher: false,
    staff: false
};

// Regular expression for basic email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;

// Show the "Verify" button when a valid email is entered
Object.keys(emailInputs).forEach(role => {
    emailInputs[role].addEventListener("input", () => {
        if (emailPattern.test(emailInputs[role].value.trim())) {
            verifyButtons[role].style.display = "inline"; // Show verify button if email is valid
        } else {
            verifyButtons[role].style.display = "none"; // Hide verify button if email is invalid
        }
    });
});

// Function to display OTP input fields when "Verify" button is clicked
async function startOTPVerification(role) {
    otpSections[role].style.display = "block"; // Show OTP section for the selected role
    clearOTPInputs(role);
    const email=document.getElementById("email").value;
    console.log(email);
    userData={
        email:email,
        content:`Your OTP is ${OTP}`,
        subject:'Otp vertification'
    } // Variable to check if any input is empty
    console.log(userData);
    const response = await fetch(url_otp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log(await response.json())
    // Clear previous OTP inputs when verifying again
}

// Clear OTP input fields
function clearOTPInputs(role) {
    otpInputs[role].forEach(input => {
        input.value = ""; // Clear each input field
    });
}

// OTP verification function
function verifyOTP(role) {
    let enteredOTP = "";
    let isEmpty = false;
    otpInputs[role].forEach(input => {
        if (input.value === "") {
            isEmpty = true; // Mark as empty if any field is blank
        }
        enteredOTP += input.value; 
        // Concatenate values to form the OTP
    });

    const notification = document.getElementById(`${role}-notification`);
    const notificationMessage = document.getElementById(`${role}-notificationMessage`);
    const verifyButton = verifyButtons[role]; // Get the verify button for the role

    if (isEmpty) {
        showNotification(notification, notificationMessage, "Please enter all OTP digits.", "red"); // Show error if any input is empty
    } else if (enteredOTP === String(OTP)) {
        showNotification(notification, notificationMessage, "OTP Verified Successfully!", "green");
        otpSections[role].style.display = "none"; // Hide OTP section after successful verification
        otpVerified[role] = true; // Set OTP verified flag to true for the corresponding role

         // Update the verify button text to "Verified" and change its color to orange
         verifyButton.textContent = "Verified";
         verifyButton.style.backgroundColor = "orange";
         verifyButton.style.color = "black"; 
         verifyButton.style.fontSize = "16px";// Optional: change text color to white for better visibility
         verifyButton.disabled = true; // Disable the button after verification

        // Enable the Sign Up button after OTP verification
        submitButtons[role].disabled = false; // Enable Sign Up button only after OTP verification
    } else {
        showNotification(notification, notificationMessage, "Invalid OTP. Please try again.", "red");
    }
}

// Show notification function
function showNotification(notification, notificationMessage, message, color) {
    notificationMessage.textContent = message;
    notificationMessage.style.color = color;
    notification.style.display = "block"; // Show notification

    setTimeout(() => {
        notification.style.display = "none"; // Hide notification after 3 seconds
    }, 3000);
}

// Handle form submission
Object.keys(submitButtons).forEach(role => {
    submitButtons[role].addEventListener("click", (event) => {
        if (!otpVerified[role]) {
            event.preventDefault(); // Prevent form submission
            showNotification(
                document.getElementById(`${role}-notification`),
                document.getElementById(`${role}-notificationMessage`),
                "You must verify your email before submitting the form.",
                "red"
            ); // Show error message
        }
    });
});

// OTP input focus functionality
Object.keys(otpInputs).forEach(role => {
    otpInputs[role].forEach((input, index) => {
        input.addEventListener("keyup", function (e) {
            if (this.value.length === 1 && index < otpInputs[role].length - 1) {
                otpInputs[role][index + 1].focus(); // Move to the next input
            }

            if (Array.from(otpInputs[role]).every(input => input.value !== "")) {
                confirmOtpButtons[role].removeAttribute("disabled"); // Enable submit OTP button
            } else {
                confirmOtpButtons[role].setAttribute("disabled", "true"); // Disable submit OTP button
            }
        });

        input.addEventListener("keydown", function (e) {
            if (e.key === "Backspace" && this.value === "" && index > 0) {
                otpInputs[role][index - 1].focus(); // Move to the previous input
            }
        });
    });
});

// // Check OTP verification button for student
// confirmOtpButtons.student.addEventListener("click", function () {
//     console.log("Confirm OTP clicked for student");
//     verifyOTP('student');
// });


