// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');

// const serviceAccount = require('./serviceAccountKey.json'); // Update path to your service account key
// console.log(serviceAccount);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.firestore();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // API endpoint to add a new user
// app.post('/api/users', async (req, res) => {
//   try {
//     const { username, email, role } = req.body;
//     const createdDate = admin.firestore.FieldValue.serverTimestamp();

//     const docRef = await db.collection('users').add({
//       username,
//       email,
//       role,
//       createdDate
//     });
   
//     res.json({ id: docRef.id, message: 'User added successfully' });
//   } catch (error) {
//     console.error('Error adding user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // API endpoint to get all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const snapshot = await db.collection('users').get();
//     const users = [];
//     snapshot.forEach(doc => {
//       users.push({ id: doc.id, ...doc.data() });
//     });
//     res.json(users);
//   } catch (error) {
//     console.error('Error getting users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Delete User
// function deleteUser(userId){
//     console.log("delete me.");
// }

// app.use(express.static("public"));
// const PORT = process.env.PORT || 3000;
// console.log(PORT);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // Update path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

let userCount = 0;

function generateUserId(num, len) {
  let str = ''+ num;
  while(str.length < len){
    str = '0' + str;
  }
  return str;
}

// Add a new user
app.post('/api/users', (req, res) => {
  const { username, email, role } = req.body;

  const userSnapshot = db.collection('users').get();
  userCount = userSnapshot.size;

  db.collection('users').where(username, '==', username).get()
  .then((querySnapshot) =>{
    if(!querySnapshot.empty){
      console.log("username already exist");
      return res.status(400).json({ error: 'Username is not unique' });
    }
    else{
      // Check for uniqueness of email
      db.collection('users').where('email', '==', email).get()
      .then((querySnapshot) =>{
        if(!querySnapshot.empty){
          console.log("username already exist");
          return res.status(400).json({ error: 'Email is not unique' });
        }
        else{
          console.log("it's unique");
          // generate user id
          const userId = generateUserId(userCount +1, 4);

          db.collection('users').doc(userId).set({
            id: userId,
            username,
            email,
            role,
            createdDate: admin.firestore.Timestamp.now(),
            updatedDate: null
          })
          .then(() => res.sendStatus(200))
          .catch(error => {
            console.error('Error adding user:', error);
            res.sendStatus(500);
          });
        }
      })
    } 
  })
  .catch((error) => {
    console.log("error checking username/email:", error);
  });

  // db.collection('users').add({
  //   username,
  //   email,
  //   role,
  //   createdDate: admin.firestore.Timestamp.now(),
  //   updatedDate: null
  // })
  // .then(() => res.sendStatus(200))
  // .catch(error => {
  //   console.error('Error adding user:', error);
  //   res.sendStatus(500);
  // });
});

// Update an existing user
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { username, email, role } = req.body;
  db.collection('users').doc(id).update({
    username,
    email,
    role,
    updatedDate: admin.firestore.Timestamp.now()
  })
  .then(() => res.sendStatus(200))
  .catch(error => {
    console.error('Error updating user:', error);
    res.sendStatus(500);
  });
});

// Delete an existing user
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.collection('users').doc(id).delete()
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.error('Error deleting user:', error);
      res.sendStatus(500);
    });
});

// Get all users
app.get('/api/users', (req, res) => {
  db.collection('users').get()
    .then(snapshot => {
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      res.json(users);
    })
    .catch(error => {
      console.error('Error getting users:', error);
      res.sendStatus(500);
    });
});

// API endpoint to search a user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  db.collection('users').doc(userId).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ id: doc.id, ...doc.data() });
      }
    })
    .catch(error => {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// API endpoint to search a user by username
app.get('/api/users/search', (req, res) => {
  const { username } = req.query;

  db.collection('users').where('username', '==', username).get()
    .then(snapshot => {
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      res.json(users);
    })
    .catch(error => {
      console.error('Error searching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});