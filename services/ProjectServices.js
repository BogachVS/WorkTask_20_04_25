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
                attributes: ['Id', 'ProjectName', 'ProjectDevicesCount', 'ProjectType', 'ApiKey', 'UserId']
            })
        }
        catch (error)
        {
            throw error;
        }
    }
    async GetProjectInfo(Id)
    {
        try
        {
            return await Project.findOne({
                where: { Id },
                attributes: ['Id', 'ProjectName', 'ProjectDevicesCount', 'ProjectType', 'ApiKey', 'UserId']
            });
        }
        catch (error)
        {
            throw error;
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
            throw error;
        }
    }

    async RegenerateApiKey(Id)
    {
        try
        {
            const project = await Project.findOne({ where: { Id } });
            if (!project)
            {
                throw new Error("Project doesn't exist");
            }
            const newKey = crypto.randomBytes(32).toString('hex');
            const [update] = await Project.update({ ApiKey: newKey }, { where: { Id } });
            if (update === 0)
            {
                throw new Error("Project not found or new api is the same as the current one");
            }
            return update;
        }
        catch (error)
        {
            throw error;
        }
    }

    async ChangeProjectName(Id, ProjectName)
    {
        try
        {
            const project = await Project.findOne({ where: { Id } });
            if (!project)
            {
                throw new Error("Project doesn't exist");
            }
            const [update] = await Project.update({ ProjectName }, { where: { Id } });
            if (update === 0)
            {
                throw new Error("Project not found or new name is the same as the current one");
            }
            return update;
        }
        catch (error)
        {
            throw error;
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
            throw error;
        }
    }
}
export default new ProjectService();