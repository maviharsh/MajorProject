// // const Joi=require("joi");

// // module.exports.listingSchema=Joi.object({
// //     listing:Joi.object({
// //         title:Joi.string().required(),
// //         description:Joi.string().required(),
// //         location:Joi.string().required(),
// //         country:Joi.string().required(),
// //         price:Joi.number().required().min(0),
// //         file:Joi.string().allow("",null),
// //         url:Joi.string().allow("",null),

// //     }).required()
// // });
// const Joi = require('joi');

// const listingSchema = Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.object({
//         filename: Joi.string().required(),
//         url: Joi.string().required()
//     }).required(),
//     price: Joi.number().required(),
//     country: Joi.string().required(),
//     location: Joi.string().required()
// });

// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body.listing);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };
// module.exports = { listingSchema };

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string()
        })
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});
