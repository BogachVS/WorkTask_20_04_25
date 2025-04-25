import ProjectService from '../services/ProjectServices.js';
class ProjectController
{
    async GetAllProjects(req,res)
    {
        try
        {
            const projects = await ProjectService.GetAllUserProjects(req.params.UserId);
            return res.status(200).json(projects);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async AddProject(req, res)
    {
        try
        {
            const {UserId, ProjectName, ProjectType } = req.body;
            await ProjectService.AddNewProject(UserId, ProjectName, ProjectType);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async GetInfo(req, res)
    {
        try
        {
            const project = await ProjectService.GetProjectInfo(req.params.Id);
            return res.status(200).json(project);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async ChangeName(req, res)
    {
        try
        {
            await ProjectService.ChangeProjectName(req.params.Id, req.body);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async RegenerateKey(req, res)
    {
        try
        {
            await ProjectService.RegenerateApiKey(req.params.Id);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async DeleteProject(req, res)
    {
        try
        {
            await ProjectService.DeleteProject(req.body, req.params.Id);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }
}
export default new ProjectController();