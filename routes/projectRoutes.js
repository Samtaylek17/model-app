const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

router
	.route('/popular-projects')
	.get(projectController.aliasTopProject, projectController.getAllProjects);

router
	.route('/')
	.get(projectController.getAllProjects)
	.post(authController.protect, projectController.createProject);

// router.use(authController.isLoggedIn);

router
	.route('/:id')
	.get(projectController.getProject)
	.patch(authController.protect, projectController.updateProject)
	.delete(authController.protect, projectController.deleteProject);

module.exports = router;
