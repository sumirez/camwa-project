import express from 'express';
import iamController from '../controllers/accountManagement.controller.js';

const accountRouter = express.Router();

accountRouter.get('/', iamController.getAllUsers);
accountRouter.get('/:accId', iamController.getUserById);
accountRouter.post('/', iamController.createUser);
accountRouter.put('/:accId', iamController.updateUser);
accountRouter.delete('/:accId', iamController.deleteUser);

export default accountRouter;
