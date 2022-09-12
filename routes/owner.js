const router = require("express").Router();
const owners = require("../controllers/owner.controller");

router.post("/", owners.create);
router.get("/", owners.findAll);
router.get("/:id", owners.findOne);
router.get("/email/:id", owners.findByEmail);

router.delete("/:id", owners.delete);
router.put("/:id", owners.update);

module.exports = router;
