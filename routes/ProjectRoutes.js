import { Router } from 'express';
import ProjectController from '../controllers/ProjectController.js';
const ProjectRouter = Router();

ProjectRouter.post('/addProject/:UserId', ProjectController.AddProject);
ProjectRouter.put('/changeName/:Id', ProjectController.ChangeName);
ProjectRouter.get('/getProjectInfo/:Id', ProjectController.GetInfo);
ProjectRouter.get('/regenerateApi/:Id', ProjectController.RegenerateKey);
ProjectRouter.get('/getProjects/:UserId', ProjectController.GetAllProjects);
ProjectRouter.delete('/deleteProject/:Id', ProjectController.DeleteProject);

export default ProjectRouter;
