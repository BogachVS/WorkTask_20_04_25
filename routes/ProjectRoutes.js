import { Router } from 'express';
import ProjectController from '../controllers/ProjectController.js';
import verifyToken from '../middleware/VerifyTokenMiddleware.js'

const ProjectRouter = Router();

ProjectRouter.post('/addProject', verifyToken, ProjectController.AddProject);
ProjectRouter.put('/changeName/:Id', verifyToken, ProjectController.ChangeName);
ProjectRouter.get('/getProjectInfo/:Id',verifyToken, ProjectController.GetInfo);
ProjectRouter.get('/regenerateApi/:Id', verifyToken, ProjectController.RegenerateKey);
ProjectRouter.get('/getProjects', verifyToken, ProjectController.GetAllProjects);
ProjectRouter.delete('/deleteProject/:Id', verifyToken, ProjectController.DeleteProject);

export default ProjectRouter;
