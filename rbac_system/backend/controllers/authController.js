
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.register = async (req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        const hashed = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data:{name,email,password:hashed,role}
        });
        res.json(user);
    } catch (e){ res.status(500).json({error:"Registration failed"}); }
};

module.exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await prisma.user.findUnique({where:{email}});
        if(!user) return res.status(404).json({error:"No user"});
        const match = await bcrypt.compare(password,user.password);
        if(!match) return res.status(401).json({error:"Wrong password"});
        const token = jwt.sign({id:user.id,role:user.role}, "SECRET", {expiresIn:"7d"});
        res.json({token,role:user.role});
    } catch (e){ res.status(500).json({error:"Login failed"}); }
};
