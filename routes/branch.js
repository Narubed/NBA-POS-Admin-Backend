const router = require("express").Router();
const branch = require("../controllers/branch.controller");
const branchUpdate = require("../controllers/branch.controller/update.branch.controller");

router.post("/", branch.create);
router.get("/", branch.findAll);
router.get("/:id", branch.findOne);
router.get("/owner/:id", branch.findByOwner);
router.delete("/:id", branch.delete);
router.put("/:id", branchUpdate.update);

module.exports = router;
