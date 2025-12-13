
const router = require("express").Router();
const {auth} = require("../middleware/auth");

router.get("/admin-only", auth(["ADMIN"]), (req,res)=> res.json({ok:"admin access"}));
router.get("/manager-only", auth(["MANAGER","ADMIN"]), (req,res)=> res.json({ok:"manager access"}));
router.get("/seller-only", auth(["SELLER","ADMIN"]), (req,res)=> res.json({ok:"seller access"}));
router.get("/buyer-only", auth(["BUYER","ADMIN"]), (req,res)=> res.json({ok:"buyer access"}));

module.exports = router;
