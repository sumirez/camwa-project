import accountService from '../services/account.service.js';
import { responseSuccess, responseError } from '../common/helpers/response.helper.js';

const iamController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await accountService.getAllUsers();
      res.status(200).json(responseSuccess(users, 'Users retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  getUserById: async (req, res) => {
    try {
      const { accId } = req.params;
      const user = await accountService.getUserById(accId);
      res.status(200).json(responseSuccess(user, 'User retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  createUser: async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await accountService.createUser(userData);
      res.status(201).json(responseSuccess(newUser, 'User created successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  updateUser: async (req, res) => {
    try {
      const { accId } = req.params;
      const userData = req.body;
      const updatedUser = await accountService.updateUser(accId, userData);
      res.status(200).json(responseSuccess(updatedUser, 'User updated successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { accId } = req.params;
      await accountService.deleteUser(accId);
      res.status(200).json(responseSuccess(null, 'User deleted successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  }
};

export default iamController;
