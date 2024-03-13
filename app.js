// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7DddBIq5btV6ScijcsJaYzIPQWK8vH6U",
    authDomain: "usermngmnt-3738d.firebaseapp.com",
    projectId: "usermngmnt-3738d",
    storageBucket: "usermngmnt-3738d.appspot.com",
    messagingSenderId: "618739865953",
    appId: "1:618739865953:web:65734fa7d2fb8c4a574d20",
    measurementId: "G-PMHK63PP3H"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the Firestore service
  const db = firebase.firestore();
  
// Fetch user data from server and display in table
function fetchUsers() {
  fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(users => {
      const userTableBody = document.getElementById('userTableBody');
      userTableBody.innerHTML = '';
      users.forEach(user => {
        console.log(new Date(user.createdDate._seconds * 1000).toLocaleDateString());
        const createdDate = new Date(user.createdDate._seconds * 1000).toLocaleDateString();
        // const createdDate = user.createdDate;
        const updatedDate = user.updatedDate ? new Date(user.updatedDate._seconds * 1000).toLocaleDateString() : '';
        const row = `
          <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${createdDate}</td>
            <td>${updatedDate}</td>
            <td>
              <button onclick="editUser('${user.id}', '${user.username}', '${user.email}', '${user.role}')">Edit</button>
              <button onclick="deleteUser('${user.id}')">Delete</button>
            </td>
          </tr>
        `;
        userTableBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error fetching users:', error));
}

// Add user
document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  // Validate fields
  if(username === '' || email === ''){
    alert('Username and email are required fields');
    return;
  }
  if(!validateEmail(email)){
    alert('Please enter a valid email id');
    return;
  }

  // Check for uniqueness of username and email
  checkUniqueness(username, email)
   .then(() => {
     // If both username and email are unique, proceed to add user
     const role = document.getElementById('role').value;

     fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, role })
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('userForm').reset();
        fetchUsers();
      } else {
        throw new Error('Failed to add user');
      }
    })
    .catch(error => console.error('Error adding user:', error));

   })
   .catch(error => {
     console.error('Error:', error);
     alert('Username or email is not unique. Please try again with different credentials.');
   });
});

// Edit user
function editUser(id, username, email, role) {
  const newUsername = prompt("Enter new username:", username);
  const newEmail = prompt("Enter new email:", email);
  const newRole = prompt("Enter new role:", role);
  if (newUsername !== null && newEmail !== null && newRole !== null) {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: newUsername, email: newEmail, role: newRole })
    })
    .then(response => {
      if (response.ok) {
        fetchUsers();
      } else {
        throw new Error('Failed to update user');
      }
    })
    .catch(error => console.error('Error updating user:', error));
  }
}

// Delete user
function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        fetchUsers();
      } else {
        throw new Error('Failed to delete user');
      }
    })
    .catch(error => console.error('Error deleting user:', error));
  }
}

// Search user by ID or username
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const searchInput = document.getElementById('searchInput').value;
  const searchType = document.querySelector('input[name="searchType"]:checked').value;

  let searchEndpoint;
  if (searchType === 'id') {
    searchEndpoint = `/api/users/${searchInput}`;
  } else {
    searchEndpoint = `/api/users/search?username=${searchInput}`;
  }

  // Call backend API to search for user by ID or username
  fetch(searchEndpoint)
    .then(response => response.json())
    .then(data => {
      displayUserList(Array.isArray(data) ? data : [data]);
    })
    .catch(error => {
      console.error('Error searching user:', error);
    });
});


// Fetch users on page load
fetchUsers();



// Function to check uniqueness of username and email
function checkUniqueness(username, email) {
  return new Promise((resolve, reject) => { 
    db.collection('users').where('username', '==', username).get()
      .then(snapshot => {
        if (!snapshot.empty) {
          reject('Username is not unique');
        } else {
          // Check for uniqueness of email
          db.collection('users').where('email', '==', email).get()
            .then(snapshot => {
              if (!snapshot.empty) {
                reject('Email is not unique');
              } else {
                resolve();
              }
            })
            .catch(error => {
              reject(error);
            });
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}


// Function to validate Email id
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase());
}
