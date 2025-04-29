import User from "../models/UserModel.js";
import bcrypt from 'bcrypt';
class UserService
{
    async Registration(FirstName, LastName, CompanyName, Email, Password)
    {
        try
        {
            const user = await User.findOne({ where: { Email } });
            if (user)
            {
                throw new Error("The user is already exist");
            }
            const HashedPassword = await bcrypt.hash(Password, 10);
            await User.create(
                {
                    FirstName,
                    LastName,
                    CompanyName,
                    Email,
                    Password: HashedPassword
                }
            );
        }
        catch (error)
        {
            return error;
        }
    }
    async Login(Email, Password)
    {
        try
        {
            const user = await User.findOne({ where: { Email } });
            if (!user)
            {
                throw new Error("The user doesn't exist");
            }
            await bcrypt.compare(Password, user.Password);
        }
        catch (error)
        {
            return error;
        }
    }

    async GetUserInfo(Id)
    {
        try
        {
            return await User.findByPk(Id,
                {
                    attributes: ['FirstName', 'LastName', 'CompanyName', 'Email', 'INN', 'CurrentDevicesCount']
                });
        }
        catch (error)
        {
            return error
        }
    }

    async UpdateUserInfo(Id, Data)
    {
        try
        {
            await User.update(Data, {  where: { Id }, });
        }
        catch (error)
        {
            return error;
        }
    }

    async DeleteUser(Id)
    {
        try
        {
            await User.destroy({ where: { Id } });
        }
        catch (error)
        {
            return error;
        }
    }
}
export default new UserService();