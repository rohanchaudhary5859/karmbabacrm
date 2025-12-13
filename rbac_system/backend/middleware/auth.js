
const jwt = require("jsonwebtoken");

module.exports.auth = (roles=[])=>{
    return (req,res,next)=>{
        try{
            const token = req.headers.authorization?.split(" ")[1];
            if(!token) return res.status(401).json({error:"No token"});
            const decoded = jwt.verify(token,"SECRET");
            if(roles.length && !roles.includes(decoded.role)){
                return res.status(403).json({error:"Forbidden"});
            }
            req.user = decoded;
            next();
        } catch (e){
            res.status(401).json({error:"Invalid token"});
        }
    };
}
