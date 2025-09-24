const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const {
	createJobValidator,
	updateJobValidator,
	idParamValidator,
	listQueryValidator,
} = require('../validators/jobValidators');

const {
	createJob,
	getJobs,
	getJobById,
	updateJob,
	deleteJob,
	triggerScrape,
} = require('../controllers/jobController');

router.post('/', validate(createJobValidator), createJob);
router.get('/', validate(listQueryValidator), getJobs);
router.get('/:id', validate(idParamValidator), getJobById);
router.put('/:id', validate(updateJobValidator), updateJob);
router.patch('/:id', validate(updateJobValidator), updateJob);
router.delete('/:id', validate(idParamValidator), deleteJob);

router.post('/scrape', triggerScrape);

module.exports = router;
