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

// Add a new user
app.post('/api/users', (req, res) => {
  const { username, email, role } = req.body;

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
          const id = Math.floor(1000 + Math.random()* 9000);
          console.log(id);
          const user_id = id.toString();
          console.log(user_id);

          db.collection('users').doc(user_id).set({
            id: id,
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

// API endpoint to search a user by username
app.get('/api/users/search', (req, res) => {
  const { username } = req.query;

  db.collection('users').where('username', '==', username).get()
    .then(snapshot => {
      console.log("snapshot");
      let user;
      snapshot.forEach(doc => {
        user = doc.data();
      });
      res.json(user);
    })
    .catch(error => {
      console.error('Error searching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// API endpoint to search a user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  db.collection('users').doc(userId).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Userssssssss not found' });
      } else {
        res.json({ id: doc.id, ...doc.data() });
      }
    })
    .catch(error => {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
