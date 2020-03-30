const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');
const {reports,food_products,hygiene_products,medical_products, business_section, business_reason, contact_section, product_section} = require('../lib/constants');
const products = [...food_products,...hygiene_products,...medical_products];


const validate_pack_sizes =(body)=>{
    const array = [];
    for (index in products){
        const name = products[index].name+'_pack_size';
        array.push(body(name)
            .if(body(name).notEmpty())
            .isInt().withMessage('Enter a valid pack size for '+products[index].text));
    }
    return array;
}

const validate_expected_price =(body)=>{
    const array = [];
    for (index in products){
        const current_name = products[index].name+'_current_price';
        array.push(body(current_name)
            .if(body(current_name).notEmpty())
            .isNumeric().withMessage('Enter a valid curent price for '+products[index].text));
        const expected_name = products[index].name+'_expected_price';
        array.push(body(expected_name)
            .if(body(expected_name).notEmpty())
            .isNumeric().withMessage('Enter a valid expected price for '+products[index].text));
    }
    return array;
}


// GET home page
router.get('/', function (req, res, next) {
  res.render('index', {
    reports
  });
});

router.get('/what_behaviour', function (req, res) {
    res.render('what_behaviour', {
        reports,
        values: req.session.data
    });
});
router.post('/what_behaviour',
    [ body('report_reason')
        .exists()
        .not().isEmpty().withMessage('Enter the reason for your report') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                const reason = request.session.data.report_reason;
               console.log(request.session.data.report_reason);
               if(reason === 'consumer_pricing'|| reason==='business_pricing'){
                   response.redirect('/which_products');
               }
               else {
                   response.redirect('/what_happened');
               }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {
                    response.render('what_behaviour', {
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



router.get('/what_happened', function (req, res) {
    console.log('what happened')
    res.render('what_happened', {
        reports,
        values: req.session.data
    });
});
router.post('/what_happened',
    [ body('description')
        .exists()
        .not().isEmpty().withMessage('Please give a full description of the issue.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/where_was_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('what_happened', {
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

router.get('/summary', function (req, res) {
    var data = req.session.data;
    console.log(data);



   
    var data =  { 
        description: ' describe the behaviour you are reporting, such as in what way the business is making misleading claims. Do not include personal or financial information, like your credit card details. ',
        'expiry-day': '28',
        'expiry-month': '3',
        'expiry-year': '2020',
        'contact-name': 'Mr X',
        'contact-email': 'x@y.com',
        'more-info': true,
        'is-online': true,
        'contact-number': '01743 875656',
        'business-name': 'organisation x',
        'street-name': 'street',
        'town-name': 'emmerdale',
        'postcode': 'm13 9pl',
        'business-email': 'fraud@amazon.com',
        'website': 'byzantiumjelly.co.uk',
        'report_reason':'cancellation',
        'evidence':true,
        product: 'long_life_milk',
        long_life_milk_product_description: 'long life milk',
        long_life_milk_current_price: '20',
        long_life_milk_expected_price: '2',
        long_life_milk_pack_size: '1',
        
        pasta_product_description: '',
        pasta_current_price: '',
        pasta_expected_price: '',
        pasta_pack_size: '',
        meat_product_description: '',
        meat_current_price: '',
        meat_expected_price: '',
        meat_pack_size: '',
        halal_meat_product_description: '',
        halal_meat_current_price: '',
        halal_meat_expected_price: '',
        halal_meat_pack_size: '',
        eggs_product_description: '',
        eggs_current_price: '',
        eggs_expected_price: '',
        eggs_pack_size: '',
        flour_product_description: '',
        flour_current_price: '',
        flour_expected_price: '',
        flour_pack_size: '',
        rice_product_description: '',
        rice_current_price: '',
        rice_expected_price: '',
        rice_pack_size: '',
        fruit_veg_product_description: '',
        fruit_veg_current_price: '',
        fruit_veg_expected_price: '',
        fruit_veg_pack_size: '',
        baby_formula_product_description: '',
        baby_formula_current_price: '',
        baby_formula_expected_price: '',
        baby_formula_pack_size: '',
        hand_sanitizer_product_description: '',
        hand_sanitizer_current_price: '',
        hand_sanitizer_expected_price: '',
        hand_sanitizer_pack_size: '',
        toilet_roll_product_description: '',
        toilet_roll_current_price: '',
        toilet_roll_expected_price: '',
        toilet_roll_pack_size: '',
        paracetamol_product_description: '',
        paracetamol_current_price: '',
        paracetamol_expected_price: '',
        paracetamol_pack_size: '',
        ibuprofen_product_description: '',
        ibuprofen_current_price: '',
        ibuprofen_expected_price: '',
        ibuprofen_pack_size: '',
        antiseptic_product_description: '',
        antiseptic_current_price: '',
        antiseptic_expected_price: '',
        antiseptic_pack_size: '',
        county: '',
        postcode: 'm13 9pl'
    };
    
    // loop through the business
    var business = Object.keys(business_section).map(function (key) { 
        console.log(key);
        //business-email; website
        var val = data[key];
        var url = business_section[key].url;
        if(key=='location'){
            if( data['is-online'] ){
                val = data['website'] +'<br>' + data['business-email'];
                // update url
                url ='/what_is_business_url';
            }else{
                val = data['street-name'];
                val += '<br/>' + data['town-name'];
                val += '<br/>' + data['postcode'];
            } 
        } 
        return {name:business_section[key].text, value:val, url:url} 
    });

    // loop through the reasons
    var date = data['expiry-day'] + " "+ data['expiry-month']+ " "+ data['expiry-year'];
    var reason = Object.keys(business_reason).map(function (key) { 
        console.log(key);
        var val = data[key];
        if (key === 'date'){
            val = date;
        }
        if (key === 'report_reason' ){
            if(data['reason_other']){
                val = data[key];
            }else{   

                for (var i = 0; i < reports.length; i++) {
                    if (reports[i].name == data[key]) {
                        val = reports[i].text;
                    }
                }
            }

        }
        return {name:business_reason[key].text, value:val, url:business_reason[key].url} 
    });

    // loop through the contacts
    var contacts = Object.keys(contact_section).map(function (key) { 
        console.log(key);
        return {name:contact_section[key].text, value:data[key], url:contact_section[key].url} 
    });

    // loop through the products ARRAY
    var product_list =[];
    console.log('list================');
    
    for (index in products){
        var label = products[index].name;
        console.log(label);
        var desc = data[label + '_product_description'];
        var old_price = data[label + '_current_price'];
        var new_price = data[label + '_expected_price'];
        var size = data[label + '_pack_size'];
        var copy = desc + ',<br/>';
        copy += old_price + ',<br/>';
        copy += new_price + ',<br/>';
        copy += size;
        console.log(data[desc]);
        
        product_list.push({name:products[index].text, value:copy, url:'/which_products'} );
    }
    /* var product_list = Object.keys(products).map(function (key) { 
        console.log(key);
        return {name:products[key].text, value:data[key], url:''} 
    }); */


    
    console.log(contacts);
    
    res.render('summary', {
        business,
        reason,
        product_list,
        contacts
    });
});

router.post('/summary', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    console.log('final data = ',req.session.data);
    res.redirect('summary');
});

router.get('/which_products', function (req, res) {
    console.log(food_products,medical_products,hygiene_products)
   try { res.render('which_products', {values: req.session.data, food_products, medical_products, hygiene_products});}
   catch(err){
        console.log('liz',err.toString());
    }
});
router.post('/which_products',
    [ ...validate_pack_sizes(body),  ... validate_expected_price(body) ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/where_was_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log(errors);

                console.log('found errors in validation');
                try {
                    response.render('which_products', {
                        // reports,
                        food_products,
                        hygiene_products,
                        medical_products,
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
router.get('/what_is_business_url', function (req, res) {
    res.render('what_is_business_url');
});
router.post('/what_is_business_url',
    [ body('website')
        .exists()
        .not().isEmpty().withMessage('Please provide the url for the business in question.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/when_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('what_is_business_url', {
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
router.get('/where_was_behaviour', function (req, res) {
    console.log(req.session.data);
    res.render('where_was_behaviour', {});
});
router.post('/where_was_behaviour',
    [ body('is-online')
        .exists()
        .not().isEmpty().withMessage('Please indicate where the behaviour was observed.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                const location = request.session.data['is-online'];
                if(location==='true') {
                    response.redirect('/what_is_business_url');
                }
                else {
                    response.redirect('/where_is_business');

                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {
                    response.render('where_was_behaviour', {
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

router.get('/more_information', function (req, res) {
    res.render('more_information', {});
});
router.post('/more_information',
    [ body('more-info')
        .exists()
        .not().isEmpty().withMessage('Please indicate whether you are happy to provide your contact details.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                const more_info = request.session.data['more-info'];
                if(more_info === 'true'){
                    response.redirect('/contact_details');
                }
                else {
                    response.redirect('/summary');
                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('more_information', {
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
router.get('/evidence', function (req, res) {
    res.render('evidence', {values: req.session.data});
});
router.post('/evidence',
    [ body('evidence')
        .exists()
        .not().isEmpty().withMessage('Please indicate whether you have evidence to support your report.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/more_information');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('evidence', {
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

router.get('/when_behaviour', function (req, res) {
    console.log('when',req.session)
    res.render('when_behaviour', {values: req.session.data});
});
router.post('/when_behaviour',
    [ body('date-day')
        .exists()
        .not().isEmpty().withMessage('Enter the day of the report'),
        body('date-month')
            .exists()
            .not().isEmpty().withMessage('Enter the month of the report'),
        body('date-year')
            .exists()
            .not().isEmpty().withMessage('Enter the year of the report') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/evidence');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('when_behaviour', {
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

router.get('/contact_details', function (req, res) {
    console.log('contact',req.session)
    res.render('contact_details', {values: req.session.data});
});
router.post('/contact_details', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('summary');
});

router.get('/where_is_business', function (req, res) {
    console.log('where is business',req.session)
    res.render('where_is_business', {values: req.session.data});
});
router.post('/where_is_business',
    [ body('business-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the name of the business.'),
        body('town-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the town/city of the business.')  ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/when_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('where_is_business', {
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

router.get('/privacy', function (req, res) {
  res.render('privacy', {values: req.session.data});
});

router.get('/confirm/:id',function (req, res) {
  res.render("confirm",{id:req.params.id});
})
router.get('/redirect', function (req, res, next) {
    res.render('redirect', {});
});

module.exports = router;

//
// [ { id: 'website',
//     href: '#website',
//     value: '',
//     text: 'Please provide the url of the business in question.' } ] errors= { website:
//         { id: 'website',
//             href: '#website',
//             value: '',
//             text: 'Please provide the url of the business in question.' } }
//
//
// found errors in validation [ { id: 'description',
//     href: '#description',
//     value: '',
//     text: 'Please give a full description of the issue.' } ] { description:
// { id: 'description',
//     href: '#description',
//     value: '',
//     text: 'Please give a full description of the issue.' } }

