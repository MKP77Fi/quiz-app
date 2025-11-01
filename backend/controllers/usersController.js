const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET - Hae kaikki käyttäjät (vain admin)
const getAllUsers = async (req, res) => {
  try {
    // Hae käyttäjät ilman salasanoja
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe käyttäjien haussa', 
      details: error.message 
    });
  }
};

// GET - Hae yksittäinen käyttäjä ID:n perusteella
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Käyttäjää ei löytynyt' 
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe käyttäjän haussa', 
      details: error.message 
    });
  }
};

// POST - Luo uusi käyttäjä (vain admin)
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validoi pakolliset kentät
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Käyttäjätunnus ja salasana ovat pakollisia' 
      });
    }

    // Tarkista onko käyttäjätunnus jo käytössä
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Käyttäjätunnus on jo käytössä' 
      });
    }

    // Hashaa salasana
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Luo uusi käyttäjä
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'trainee'
    });

    const savedUser = await newUser.save();
    
    // Palauta ilman salasanaa
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      message: 'Käyttäjä luotu onnistuneesti', 
      user: userResponse 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe käyttäjän luomisessa', 
      details: error.message 
    });
  }
};

// PUT - Päivitä käyttäjä (vain admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, active } = req.body;

    // Tarkista että käyttäjä löytyy
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'Käyttäjää ei löytynyt' 
      });
    }

    // Tarkista käyttäjätunnuksen uniiккius jos sitä muutetaan
    if (username && username !== existingUser.username) {
      const duplicateUser = await User.findOne({ username });
      if (duplicateUser) {
        return res.status(400).json({ 
          error: 'Käyttäjätunnus on jo käytössä' 
        });
      }
    }

    // Rakenna päivitysobjekti
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (typeof active !== 'undefined') updateData.active = active;

    // Jos salasana annetaan, hashaa se
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Päivitä käyttäjä
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Käyttäjä päivitetty onnistuneesti', 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe käyttäjän päivityksessä', 
      details: error.message 
    });
  }
};

// DELETE - Poista käyttäjä (vain admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select('-password');

    if (!deletedUser) {
      return res.status(404).json({ 
        error: 'Käyttäjää ei löytynyt' 
      });
    }

    res.status(200).json({ 
      message: 'Käyttäjä poistettu onnistuneesti', 
      user: deletedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe käyttäjän poistamisessa', 
      details: error.message 
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};