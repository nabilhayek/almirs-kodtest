const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/Employee');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://admin:adminpassword@testdb.falcnxk.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.post('/clockin', async (req, res) => {
  const { userName } = req.body;
  const user = await User.findOne({ name: userName });

  if (user) {
    user.clockInTime = new Date();
    await user.save();
    console.log('Clock-in time recorded.');
    res.status(200).send('Clock-in successful.');
  } else {
    const newUser = new User({
      name: userName,
      clockInTime: new Date(),
    });
    await newUser.save();
    console.log('User created.');
    res.status(200).send('Clock-in successful.');
  }
});

app.post('/clockout', async (req, res) => {
  const { userName } = req.body;
  const user = await User.findOne({ name: userName });

  if (user) {
    user.clockOutTime = new Date();

    const timeDiff = user.clockOutTime.getTime() - user.clockInTime.getTime();

    user.workHistory = [
      ...user.workHistory,
      {
        start: user.clockInTime,
        end: user.clockOutTime,
      },
    ];
    await user.save();
    console.log('Clock-out time recorded.');
    res.status(200).send({ timeDiff: timeDiff });
  } else {
    console.log('User not found.');
    res.status(400).send('User not found.');
  }
});

app.get('/workhistory/:userName', async (req, res) => {
  const userName = req.params.userName;
  console.log(userName);
  try {
    const user = await User.findOne({ name: userName });
    if (user) {
      res.json(user.workHistory);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching work history:', error);
    res.status(500).json({ message: 'Error fetching work history' });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
