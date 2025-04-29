import ProjectService from '../services/ProjectServices.js';

class ProjectController {
    /**
     * @swagger
     * /projects/getProjects/{UserId}:
     *   get:
     *     summary: Get all user projects
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: UserId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID user
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
    async GetAllProjects(req, res) {
        try {
            const projects = await ProjectService.GetAllUserProjects(req.params.UserId);
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(400).json({ error: error.code });
        }
    }

    /**
     * @swagger
     * /projects/addProject/{UserId}:
     *   post:
     *     summary: Add new project
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: UserId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID user
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
    async AddProject(req, res) {
        try {
            const { ProjectName, ProjectType } = req.body;
            await ProjectService.AddNewProject(req.params.UserId, ProjectName, ProjectType);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(400).json({ error: error.code });
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
    async GetInfo(req, res) {
        try {
            const project = await ProjectService.GetProjectInfo(req.params.Id);
            return res.status(200).json(project);
        } catch (error) {
            return res.status(400).json({ error: error.code });
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
    async ChangeName(req, res) {
        try {
            await ProjectService.ChangeProjectName(req.params.Id, req.body);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(400).json({ error: error.code });
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
    async RegenerateKey(req, res) {
        try {
            await ProjectService.RegenerateApiKey(req.params.Id);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(400).json({ error: error.code });
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
    async DeleteProject(req, res) {
        try {
            await ProjectService.DeleteProject(req.body, req.params.Id);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(400).json({ error: error.code });
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