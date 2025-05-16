import User from "../models/UserModel.js";
import Project from "../models/ProjectModel.js";
import Subscription from "../models/SubscriptionModel.js";
import Token from "../models/TokenModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const jwtSecret = process.env.JWT_SECRET;

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
            if (!user || !user.Password) throw new Error("Not found");

            const match = await bcrypt.compare(Password, user.Password);
            if (!match) throw new Error("Wrong password");
            
            return this.GenerateTokens(user);
        }
        catch (error)
        {
            throw error;
        }
    }

    async OAuthLogin(email, name) {
        let user = await User.findOne({ where: { Email: email } });
        if (!user) {
          const [firstName, ...lastParts] = name.split(" ");
          user = await User.create({
            FirstName: firstName,
            LastName: lastParts.join(" ") || " ",
            CompanyName: "OAuth Company",
            Email: email,
            Password: null
          });
        }
        
        return this.GenerateTokens(user);
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
            const [update] = await User.update(Data, { where: { Id }, });
            if (update === 0)
            {
                throw new Error("User not found or no changes applied");
            }
            return update;
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
            const user = await User.findByPk(Id);
            if (!user)
            {
                throw new Error("User doesn't exist");
            }
            return await User.destroy({
                where: { Id },
                individualHooks: true
            });
        }
        catch (error)
        {
            throw error;
        }
    }

    async RefreshTokens(oldRefreshToken)
    {
        const tokenRecord = await Token.findOne({ where: { RefreshToken: oldRefreshToken } });
        if (!tokenRecord || new Date() > new Date(tokenRecord.ExpiresAt))
        {
          throw new Error("Refresh token is invalid or expired");
        }

        await tokenRecord.destroy()
        const user = await User.findByPk(tokenRecord.UserId);
        return this.GenerateTokens(user);
    }

    async GenerateTokens(user)
    {
        const payload = { id: user.Id, email: user.Email };
        const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
    
        await Token.create({
          RefreshToken: refreshToken,
          UserId: user.Id,
          ExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
    
        return { accessToken, refreshToken };
      }
}
export default new UserService();