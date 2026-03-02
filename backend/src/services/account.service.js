import Iam from '../models/Iam.model.js';
import bcrypt from 'bcryptjs';


const accountService = {
  getAllUsers: async () => {
    try {
      const users = await Iam.findAll({
        attributes: ['acc_id', 'username', 'email', 'role']
      });
      
      return users.map(user => ({
        accId: user.acc_id,
        username: user.username,
        email: user.email,
        role: user.role
      }));
    } catch (error) {
      throw new Error('Error retrieving users: ' + error.message);
    }
  },

  getUserById: async (accId) => {
    try {
      const user = await Iam.findByPk(accId, {
        attributes: ['acc_id', 'username', 'email', 'role']
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        accId: user.acc_id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw new Error('Error retrieving user: ' + error.message);
    }
  },

  createUser: async (userData) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const newUser = await Iam.create({
        acc_id: userData.accId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });
      
      return {
        accId: newUser.acc_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      };
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  },

  updateUser: async (accId, userData) => {
    try {
      const updateData = {
        username: userData.username,
        email: userData.email,
        role: userData.role
      };

      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(userData.password, salt);
      }

      const [updated] = await Iam.update(updateData, {
        where: { acc_id: accId }
      });
      
      if (!updated) {
        throw new Error('User not found');
      }
      
      return await accountService.getUserById(accId);
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  },

  deleteUser: async (accId) => {
    try {
      const deleted = await Iam.destroy({
        where: { acc_id: accId }
      });
      
      if (!deleted) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
};

export default accountService;
