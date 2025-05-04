import UserService from "../services/UserServices.js";

class UserController
{
    /**
     * @swagger
     * /users/registration:
     *   post:
     *     summary: Register new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               FirstName:
     *                 type: string
     *                 example: "John"
     *               LastName:
     *                 type: string
     *                 example: "Johnes"
     *               CompanyName:
     *                 type: string
     *                 example: "OOO Company"
     *               Email:
     *                 type: string
     *                 format: email
     *                 example: "user@example.com"
     *               Password:
     *                 type: string
     *                 format: password
     *                 example: "qwerty123"
     *     responses:
     *       200:
     *         description: Successful registry
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error registry
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
     *                   example: "USER_ALREADY_EXISTS"
     */
    async Registration(req, res)
    {
        try
        {
            const { FirstName, LastName, CompanyName, Email, Password } = req.body;
            if (!Password || Password.length < 8) // 
            {
                return res.status(400).json({ success: false, error: "Password must contain at least 8 symbols"});
            }
            await UserService.Registration(FirstName, LastName, CompanyName, Email, Password);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Login user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               Email:
     *                 type: string
     *                 format: email
     *                 example: "user@example.com"
     *               Password:
     *                 type: string
     *                 format: password
     *                 example: "qwerty123"
     *     responses:
     *       200:
     *         description: Successful login
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error login
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
     *                   example: "INVALID_CREDENTIALS"
     */
    async Login(req, res)
    {
        try
        {
            const { Email, Password } = req.body;
            await UserService.Login(Email, Password);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /users/getInfo/{Id}:
     *   get:
     *     summary: Get user info
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID user
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: User not found
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
    async GetUser(req, res)
    {
        try
        {
            const User = await UserService.GetUserInfo(req.params.Id);
            return res.status(200).json(User);
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /users/updateInfo/{Id}:
     *   put:
     *     summary: Update user info
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserUpdate'
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
     *                   example: "VALIDATION_ERROR"
     */
    async UpdateUser(req, res)
    {
        try
        {
            const rowsAffected = await UserService.UpdateUserInfo(req.params.Id, req.body);
            return res.status(200).json({ success: true, rowsAffected });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /users/deleteUser/{Id}:
     *   delete:
     *     summary: Delete user
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: Id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID user
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
    async DeleteUser(req, res)
    {
        try
        {
            await UserService.DeleteUser(req.params.Id);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           example: 1
 *         FirstName:
 *           type: string
 *           example: "John"
 *         LastName:
 *           type: string
 *           example: "Jones"
 *         CompanyName:
 *           type: string
 *           example: "OOO Company"
 *         Email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         INN:
 *           type: string
 *           example: "0123456789"
 *         CurrentDevicesCount:
 *           type: integer
 *           example: 5
 * 
 *     UserUpdate:
 *       type: object
 *       properties:
 *         FirstName:
 *           type: string
 *           example: "New name"
 *         LastName:
 *           type: string
 *           example: "New surname"
 *         CompanyName:
 *           type: string
 *           example: "New company"
 *         Email:
 *           type: string
 *           format: email
 *           example: "new-email@example.com"
 *         INN:
 *           type: string
 *           example: "9876543210"
 */
export default new UserController();