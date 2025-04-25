import UserService from "../services/UserServices.js";

class UserController
{
    async Registration(req, res)
    {
        try
        {
            const { FirstName, LastName, CompanyName, Email, Password } = req.body;
            await UserService.Registration(FirstName, LastName, CompanyName, Email, Password);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.code });
        }
    }
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
            return res.status(400).json({ success: false, error: error.code });
        }
    }
    async GetUser(req, res)
    {
        try
        {
            const User = await UserService.GetUserInfo(req.params.Id);
            return res.status(200).json(User);
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.code });
        }
    }

    async UpdateUser(req, res)
    {
        try
        {
            await UserService.UpdateUserInfo(req.params.Id, req.body);
            return res.status(200).json({ success:true });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.code });
        }
    }

    async DeleteUser(req, res)
    {
        try
        {
            await UserService.DeleteUser(req.params.Id);
            return res.status(200).json({ success:true });
        }
        catch (error)
        {
            return res.status(400).json({ success: false, error: error.code });
        }
    }
}
export default new UserController();