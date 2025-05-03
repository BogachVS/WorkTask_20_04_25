import User from "../models/UserModel.js";
import bcrypt from 'bcrypt';
class UserService
{
    async Registration(FirstName, LastName, CompanyName, Email, Password)
    {
        try
        {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email))
            {
                throw new Error("Invalid email format");
            }
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
            throw error;
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
            throw error;
        }
    }

    async GetUserInfo(Id)
    {
        try
        {
            const user =  await User.findByPk(Id,
                {
                    attributes: ['FirstName', 'LastName', 'CompanyName', 'Email', 'INN', 'CurrentDevicesCount']
                });
            if (!user)
            {
                throw new Error("User doesn't exist");
            }
            return user;
        }
        catch (error)
        {
            throw error
        }
    }

    async UpdateUserInfo(Id, Data)
    {
        try
        {
            return await User.update(Data, { where: { Id }, });
        }
        catch (error)
        {
            throw error;
        }
    }

    async DeleteUser(Id)
    {
        try
        {
            const user = User.findByPk(Id);
            if (!user)
            {
                throw new Error("User doesn't exist");
            }
            await User.destroy({ where: { Id } });
        }
        catch (error)
        {
            throw error;
        }
    }
}
export default new UserService();