const Product = require('../models/products')
const mongoose = require('mongoose');

exports.product_get_all_products = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then( doc => 
        {      const result = {
                    count: doc.length,
                    products: doc.map(doc => {
                        return {
                            name : doc.name,
                            price : doc.price,
                            _id : doc._id,
                            productImage: doc.productImage,
                            request:{
                                type: 'GET',
                                url: 'http://localhost:3000/products/' +doc._id
                            }    
                        }
                    })
                    }
        res.status(200).json(result)
        // if(doc.length > 0) {
        //     res.status(200).json({
        //         count: doc.length,
        //         products: doc
        //     })
        // } else {
        //     res.status(404).json({
        //         message : "No records present"
        //     })
        // }
        
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
}
exports.product_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.productName,
        price : req.body.productPrice,
        productImage : req.file.path
    });
    product.save()
    .then(result => {
        res.status(201).json({
            message: 'Product added successfully',
            createdProduct:{
                name: product.name,
                price: product.price,
                _id: product._id,
                request: {
                    type: 'GET',
                    url:'http://localhost:3000/products/' +product._id
                }
            }
        });
    }).catch(err => {
        res.status(201).json({
            error: err
        });
    })
}
exports.product_get_product_by_id = (req, res, next) => {
    const id = req.params.productId;
    console.log('id', id);
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(
        doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    doc,
                    request: {
                        type: 'GET',
                        description: 'get all products',
                        url:'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No record present to this id'
                })
            }
            
        }
    )
    .catch(
        err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        }
    )
    /* if(id === 'special') {
        res.status(200).json({
            message: 'you selected special id' ,
            id: id
        })
    } else {
        res.status(200).json({
            message: 'you selected general Id',
            id: id
        })
    }   */
}
exports.product_update_product = (req, res, next) => {
    const id = req.params.productId;
    /* res.status(200).json({
        message: 'patch request for products' ,
        id: id
    })   */
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps
    })
    .exec()
    .then( result =>
        {
            res.status(200).json({
                result,
                request: {
                    type:'GET',
                    description:'to get updated record',
                    url:'http://localhost:3000/products/' +id
                }
            })
        })
    .catch(
        err => {
            res.status(404).json({
                error : err
            })
        }
    )
}
exports.product_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
    .exec()
    .then(
        result => {
            res.status(200).json({
                result,
                request: {
                    method: 'POST',
                    description: 'You can add products here',
                    body : { productName:"String", productPrice: "Number" }
                }
            });
        }
    )
    .catch(
        err => {
            res.status(500).json(err);
        }
    )
    /* res.status(200).json({
        message: 'delete request for products' ,
        id: id
    })  */
}