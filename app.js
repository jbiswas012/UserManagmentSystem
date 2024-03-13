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
  
//   // Form submission
//   const form = document.getElementById('userForm');
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
  
//     // Get form values
//     const username = form.username.value;
//     const email = form.email.value;
//     const role = form.role.value;
//     const createdDate = new Date().toString();

//     // Generate unique id
//     // const id = db.collection("users").doc().id;
//     const id = Math.floor(1000 + Math.random()* 9000);
  
//     // Save data to Firestore
//     db.collection("users").doc(String(id)).set({
//         id: id,
//         username: username,
//         email: email,
//         role: role,
//         createdDate: createdDate
//       })
//     // db.collection("users").add({
//     //   username: username,
//     //   email: email,
//     //   role: role,
//     //   createdDate: createdDate
//     // })
//     .then(() => {
//       console.log("Document written with ID: ");
//       // Reset form after submission
//       form.reset();
//       alert("Data saved successfully!");
//     })
//     .catch((error) => {
//       console.error("Error adding document: ", error);
//       alert("An error occurred. Please try again.");
//     });
//   });


// // Retrieve data from firestore and display in table
// const userTableBody = document.getElementById('userTableBody');
// console.log(userTableBody);

// db.collection('users').orderBy('createdDate', 'desc').get().then((querySnapshot) => {
//     querySnapshot.forEach(doc => {
//         const userData = doc.data();
//         const createdDate = new Date(userData.createdDate.toDate());
//         const row = '<tr><td>${doc.id}</td><td>${userData.username}</td><td>${userData.email}</td><td>${userData.role}</td><td>${createdDate.toLocaleString()}</td></tr>';
//         userTableBody.innerHTML += row;
//     });
// });




// document.getElementById('userForm').addEventListener('submit', async function(event) {
//     event.preventDefault();
  
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const role = document.getElementById('role').value;
  
//     try {
//       const response = await fetch('http://localhost:3000/api/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username, email, role })
//       });
//       const data = await response.json();
//       alert(data.message);
//       getUsers();
//     } catch (error) {
//       console.error('Error adding user:', error);
//       alert('Error submitting data!');
//     }
//   });
  
//   async function getUsers() {
//     try {
//       const response = await fetch('http://localhost:3000/api/users');
//       const users = await response.json();
//       const userTableBody = document.getElementById('userTableBody');
//       userTableBody.innerHTML = '';
  
//       users.forEach(user => {
//         const createdDate = new Date(user.createdDate.seconds * 1000);
//         const row = `
//           <tr>
//             <td>${user.id}</td>
//             <td>${user.username}</td>
//             <td>${user.email}</td>
//             <td>${user.role}</td>
//             <td>${createdDate.toLocaleString()}</td>
//             <td>${createdDate.toLocaleString()}</td>
//             <td>
//               <button onclick="editUser('${user.id}')">Edit</button>
//               <button onclick="deleteUser('${user.id}')">Delete</button>
//             </td>
//           </tr>
//         `;
//         userTableBody.innerHTML += row;
//       });
//     } catch (error) {
//       console.error('Error getting user list:', error);
//     }
//   }

//   // Delete User
// function deleteUser(userId){
//   console.log("delete me.");
// }
  
//   // Initial call to populate user list
//   getUsers();










// Fetch user data from server and display in table
function fetchUsers() {
  fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(users => {
      const userTableBody = document.getElementById('userTableBody');
      userTableBody.innerHTML = '';
      users.forEach(user => {
        const createdDate = new Date(user.createdDate.seconds * 1000).toLocaleString();
        const updatedDate = user.updatedDate ? new Date(user.updatedDate.seconds * 1000).toLocaleString() : '';
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

    //  // Add user to Firestore
    //  db.collection('users').add({
    //    username,
    //    email,
    //    role,
    //    createdDate: new Date(),
    //    updatedDate: null
    //  })
    //  .then(() => {
    //    console.log("User added successfully");
    //    getUserList();
    //    document.getElementById('userForm').reset(); // Reset form fields
    //  })
    //  .catch(error => {
    //    console.error('Error adding user:', error);
    //  });
   })
   .catch(error => {
     console.error('Error:', error);
     alert('Username or email is not unique. Please try again with different credentials.');
   });
});

//   const role = document.getElementById('role').value;
//   fetch('http://localhost:3000/api/users', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, email, role })
//   })
//   .then(response => {
//     if (response.ok) {
//       document.getElementById('userForm').reset();
//       fetchUsers();
//     } else {
//       throw new Error('Failed to add user');
//     }
//   })
//   .catch(error => console.error('Error adding user:', error));
// });

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