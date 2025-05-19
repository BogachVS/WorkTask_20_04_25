import ProjectService from '../services/ProjectServices.js';

class ProjectController
{
    /**
     * @swagger
     * /projects/getProjects:
     *   get:
     *     summary: Get all user projects
     *     tags: [Projects]
     *     responses:
     *       200:
     *         description: Get all projects
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Project'
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async GetAllProjects(req, res)
    {
        try
        {
            const projects = await ProjectService.GetAllUserProjects(req.user.id);

            if (!projects || projects.length === 0)
            {
                return res.status(200).json({
                    success: true,
                    message: "No projects found",
                    data: []
                });
            }
            return res.status(200).json({
                success: true,
                data: projects
            });
        }
        catch (error)
        {
            if (error.name?.includes("Sequelize"))
            {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }

            return res.status(500).json({
                success: false,
                error: "Failed to fetch projects",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /projects/addProject:
     *   post:
     *     summary: Add new project
     *     tags: [Projects]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/NewProject'
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async AddProject(req, res)
    {
        try
        {
            const { ProjectName, ProjectType } = req.body;
            if (!ProjectName || !ProjectType)
            {
                return res.status(400).json({
                    success: false,
                    error: "ProjectName and ProjectType are required"
                });
            }
            const result = await ProjectService.AddNewProject(req.user.id, ProjectName, ProjectType);
            return res.status(201).json({ success: true, message: "Project created successfully", project: result});
        }
        catch (error)
        {
            if(error.name?.includes("Sequelize"))
            {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }

            return res.status(500).json({
                success: false,
                error: "Failed to create project",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /projects/getProjectInfo/{Id}:
     *   get:
     *     summary: Get project info
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID project
     *     responses:
     *       200:
     *         description: Project info
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Project'
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "PROJECT_NOT_FOUND"
     */
    async GetInfo(req, res)
    {
        try
        {
            const project = await ProjectService.GetProjectInfo(req.params.Id);
            if (!project)
            {
                return res.status(404).json({
                    success: false,
                    error: "Project not found"
                });
            }
            return res.status(200).json({
                success: true,
                data: project
            });
        }
        catch (error)
        {
            if (error.name?.includes("Sequelize"))
            {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }

            return res.status(500).json({
                success: false,
                error: "Failed to fetch project",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /projects/changeName/{Id}:
     *   put:
     *     summary: Change project name
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID project
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ProjectName:
     *                 type: string
     *                 example: NewProject
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "PROJECT_NOT_FOUND"
     */
    async ChangeName(req, res)
    {
        try
        {
            const { ProjectName } = req.body;
            if (!ProjectName)
            {
                return res.status(400).json({
                    success: false,
                    error: "ProjectName is required"
                });
            }
            const result = await ProjectService.ChangeProjectName(req.params.Id, ProjectName);
            return res.status(200).json({
                success: true,
                message: "Project name updated successfully",
                rowsAffected: result
            });
        }
        catch (error)
        {
            if (error.message.includes("doesn't exist") || error.message.includes("new name is the same"))
            {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.name?.includes("Sequelize"))
            {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }
            return res.status(500).json({
                success: false,
                error: "Failed to update project name",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /projects/regenerateApi/{Id}:
     *   get:
     *     summary: Regenerate API-Key
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID project
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "PROJECT_NOT_FOUND"
     */
    async RegenerateKey(req, res)
    {
        try
        {
            const result = await ProjectService.RegenerateApiKey(req.params.Id);
            return res.status(200).json({
                success: true,
                message: "API key regenerated successfully",
                newApi: result
            });
        }
        catch (error)
        {
            if (error.message.includes("doesn't exist") || error.message.includes("new api is the same"))
            {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.name?.includes("Sequelize"))
            {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }
            return res.status(500).json({
                success: false,
                error: "Failed to regenerate API key",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /projects/deleteProject/{Id}:
     *   delete:
     *     summary: Delete project
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID project
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "PROJECT_NOT_FOUND"
     */
    async DeleteProject(req, res)
    {
        try
        {
            await ProjectService.DeleteProject(req.params.Id);
            return res.status(200).json({
                success: true,
                message: "Project deleted successfully"
            });
        }
        catch (error)
        {
            if (error.message.includes("doesn't exist"))
            {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            if (error.name?.includes("Sequelize"))
            {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }
            return res.status(500).json({
                success: false,
                error: "Failed to delete project",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         UserId:
 *           type: integer
 *           example: 1
 *         ProjectName:
 *           type: string
 *           example: "Project"
 *         ProjectType:
 *           type: string
 *           example: "SDK"
 *         ProjectDevicesCount:
 *           type: integer
 *           example: 5
 *         ApiKey:
 *           type: string
 *           example: "A3F7D9E21C4B08A55E6D2F1B9C0E7D3F"
 * 
 *     NewProject:
 *       type: object
 *       properties:
 *         ProjectName:
 *           type: string
 *           example: "New project name"
 *         ProjectType:
 *           type: string
 *           example: "mobile"
 */
export default new ProjectController();