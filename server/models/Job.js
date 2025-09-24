const mongoose = require('mongoose');

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const JobSchema = new mongoose.Schema(
	{
		title: { type: String, required: [true, 'Title is required'], trim: true },
		company: { type: String, required: [true, 'Company is required'], trim: true },
		location: { type: String, required: [true, 'Location is required'], trim: true },
		posting_date: { type: Date, required: [true, 'Posting date is required'] },
		job_type: { type: String, enum: JOB_TYPES, required: [true, 'Job type is required'] },
		tags: { type: [String], default: [] },
	},
	{ timestamps: true }
);

JobSchema.index({ posting_date: -1 });
JobSchema.index({ job_type: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ tags: 1 });

module.exports = mongoose.model('Job', JobSchema);
module.exports.JOB_TYPES = JOB_TYPES;
