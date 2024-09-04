import jwt from 'jsonwebtoken'

const generateToken = (res,userId) => {
        const token = jwt.sign({userId}, process.env.JWT_SECRETKEY,{
            expiresIn: '15d',
        })

        res.cookie('jwt',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30*24*60*60*1000,
        })
}
export default generateToken;