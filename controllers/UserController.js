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
            if (!FirstName || !LastName || !Email || !Password)
            {
                return res.status(400).json({
                    success: false,
                    error: "All fields are required: FirstName, LastName, Email, Password"
                });
            }
            if (!Password || Password.length < 8) 
            {
                return res.status(400).json({
                    success: false,
                    error: "Password must contain at least 8 symbols"
                });
            }
            await UserService.Registration(FirstName, LastName, CompanyName, Email, Password);
            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        }
        catch (error)
        {
            if (error.message === "Invalid email format")
            {
                return res.status(400).json({
                    success: false,
                    error: "Invalid email format"
                });
            }

            if (error.message === "The user is already exist")
            {
                return res.status(400).json({
                    success: false,
                    error: "User with this email already exists"
                });
            }

            if (error.name?.includes("Sequelize")) {
                return res.status(500).json({
                    success: false,
                    error: "Database error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }

            return res.status(500).json({
                success: false,
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
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
     *                 accessToken:
     *                   type: string
     *                   example: "token"
     *                 refreshToken:
     *                   type: string
     *                   example: "token"
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
            if (!Email || !Password)
            {
                return res.status(400).json({
                    success: false,
                    error: "Email and password are required"
                });
            }
            var tokens = await UserService.Login(Email, Password);
            return res.status(200).json({
                success: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });
        }
        catch (error)
        {
            if (error.message === "Not found")
            {
                return res.status(404).json({
                    success: false,
                    error: "Not found" 
                });
            }
            if (error.message === "Wrong password")
            {
                return res.status(401).json({
                    success: false,
                    error: "Wrong password"
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
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /users/getInfo:
     *   get:
     *     summary: Get user info
     *     tags: [Users]
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
            const User = await UserService.GetUserInfo(req.user.id);
            return res.status(200).json({
                success: true,
                data: User
            });
        }
        catch (error)
        {
            if (error.message === "User doesn't exist")
            {
                return res.status(404).json({
                    success: false,
                    error: "User not found"
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
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /users/updateInfo:
     *   put:
     *     summary: Update user info
     *     tags: [Users]
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
            if (!req.body || Object.keys(req.body).length === 0)
            {
                return res.status(400).json({
                    success: false,
                    error: "No data provided for update"
                });
            }
            const result = await UserService.UpdateUserInfo(req.user.id, req.body);
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                rowsAffected: result
            });
        }
        catch (error)
        {
            if (error.message === "User not found or no changes applied")
            {
                return res.status(404).json({
                    success: false,
                    error: "Not found or no changes applied"
                });
            }
            if (error.name?.includes("SequelizeValidationError") || error.name?.includes("SequelizeUniqueConstraintError"))
            {
                return res.status(400).json({
                    success: false,
                    error: "Validation error",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
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
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }

    /**
     * @swagger
     * /users/deleteUser:
     *   delete:
     *     summary: Delete user
     *     tags: [Users]
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
            const result = await UserService.DeleteUser(req.user.id);
            if (result === 0)
            { 
                return res.status(404).json({
                    success: false,
                    error: "User not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        }
        catch (error)
        {
            if (error.message === "User doesn't exist")
            {
                return res.status(404).json({
                    success: false,
                    error: "User not found"
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
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
}
export default new UserController();