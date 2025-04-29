import Project from '../models/ProjectModel.js';
import User from '../models/UserModel.js';
import crypto from 'crypto';
class ProjectService
{
    async GetAllUserProjects(UserId)
    {
        try
        {
            return await Project.findAll({
                where: { UserId },
                attributes: ['ProjectName', 'ProjectDevicesCount', 'ProjectType', 'ApiKey']
            })
        }
        catch (error)
        {
            return error;
        }
    }
    async GetProjectInfo(Id)
    {
        try
        {
            return await Project.findOne({
                where: { Id },
                attributes: ['ProjectName', 'ProjectDevicesCount', 'ProjectType', 'ApiKey']
            });
        }
        catch (error)
        {
            return error;
        }

    }

    async AddNewProject(UserId, ProjectName, ProjectType)
    {
        try
        {
            const ApiKey = crypto.randomBytes(32).toString('hex');
            await Project.create(
                {
                    ProjectName,
                    ProjectType,
                    ApiKey,
                    UserId
                });
        }
        catch (error)
        {
            return error;
        }
    }

    async RegenerateApiKey(Id)
    {
        try
        {
            const newKey = crypto.randomBytes(32).toString('hex');
            await Project.update({ ApiKey: newKey }, { where: { Id } });
        }
        catch (error)
        {
            return error;
        }
    }

    async ChangeProjectName(Id, NewName)
    {
        try
        {
            await Project.update({ ProjectName: NewName }, { where: Id });
        }
        catch (error)
        {
            return error;
        }
    }

    async DeleteProject(UserId, Id)
    {
        try
        {
            const project = await Project.findOne({ where: { Id, UserId } });
            if (!project)
            {
                throw new Error("Project doesn't exist");
            }
            await User.decrement('CurrentDevicesCount', {
                by: project.ProjectDevicesCount,
                where: { Id: UserId }
            });
            await Project.destroy({ where: Id, UserId });
        }
        catch (error)
        {
            return error;
        }
    }
}
export default new ProjectService();