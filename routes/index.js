const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');
var {reports} = require('../lib/constants');


// GET home page
router.get('/', function (req, res, next) {
  res.render('index', {
    reports
  });
});

router.get('/privacy', function (req, res) {
  res.render('privacy', {});
});

router.get('/confirm/:id',function (req, res) {
  res.render("confirm",{id:req.params.id});
})

router.post('/',
    [   // Q1
        body('report_reason')
           .exists()
           .not().isEmpty().withMessage('Enter the reason for your report'),
        // Q2
        body('company-location')
            .exists()
            .not().isEmpty().withMessage('Please indicate the location of the company the complaint is about.'),
        // Q4
        body('company-sector')
            .exists()
            .not().isEmpty().withMessage('Please indicate the sector of the company the complaint is about.'),
        // Q5
        body('product')
            .exists()
            .not().isEmpty().withMessage('Please give the name of the product.'),
        // Q6
        body('description')
            .exists()
            .not().isEmpty().withMessage('Please give a full description of the issue.'),
        // Q9
        body('evidence')
            .exists()
            .not().isEmpty().withMessage('Please indicate if there is evidence of the issue.'),
        // Q9
        body('contact-email')
            .exists()
            .isEmail().withMessage('Enter an email address in the correct format, like name@example.com')
            .not().isEmpty().withMessage('Enter your email address')
    ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                try {
                    const ref = await save_to_cma_db(request.body,request);
                    response.redirect('/confirm/'+ref);
                }
                catch (err){
                    console.log('Failed to save to database',err.toString());
                    response.render('error', { content : {error: {message: "Internal server error"}}});
                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {
                    response.render('index', {
                        reports,
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

router.get('/redirect', function (req, res, next) {
    res.render('redirect', {});
});

module.exports = router;
