const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString,
    GraphQLSchema, GraphQLID, GraphQLList } = require("graphql");
const _ = require('lodash');
var db = require('../routes/schema');
var buyerModel = db.buyerModel;
var restownerModel = db.restownerModel;
const bcrypt = require('bcrypt');
const saltRounds = 10;
var mongoose = require('mongoose');


const buyerType = new GraphQLObjectType({
    name: 'buyer',
    fields: () => ({
        id: {type: GraphQLID},
        buyerId: { type: GraphQLString },
        phone: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        address: { type: GraphQLString }
    })
})

const ownerType = new GraphQLObjectType({
    name: 'restowners',
    fields: () => ({
        id: {type: GraphQLID},
        restaurantId: { type: GraphQLID },
        owner_firstName: { type: GraphQLString },
        owner_lastName: { type: GraphQLString },
        owner_email: { type: GraphQLString },
        owner_phone: { type: GraphQLString },
        owner_password: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        restaurantName: { type: GraphQLString },
        zipCode: { type: GraphQLString },
        section: {
            type: new GraphQLList(itemType)
        }
    })
})

const sectionType = new GraphQLObjectType({
    name: 'section',
    fields: () => ({
        sectionId: { type: GraphQLString },
        sectionName: { type: GraphQLString },
        sectionDescription: { type: GraphQLString },
        item: {
            type: new GraphQLList(itemType)
        }
    })
})

const itemType = new GraphQLObjectType({
    name: 'item',
    fields: () => ({
        itemId: { type: GraphQLID },
        itemName: { type: GraphQLString },
        itemPrice: { type: GraphQLString },

    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        owner: {
            type: ownerType,
            args: { owner_email: { type: GraphQLString } },
            resolve(parent, args) {
                return restownerModel.findOne({ owner_email: args.owner_email });
            }
        },
        ownerLogin: {
            type: ownerType,
            args: {
                owner_email: { type: GraphQLString },
                owner_password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let output = null, res = null;
                let mong = await restownerModel.findOne({ owner_email: args.owner_email })
                if (mong == null || mong.length == 0) {
                    console.log("error in results --------", error);
                    throw new Error("Invalid request");
                }
                // else if (mong.length == 0) {
                //     output = { ownerError: "Incorrect userId" };
                //     console.log("output", output)
                //     throw output;
                // }
                var bcry = await bcrypt.compare(args.owner_password, mong.owner_password)
                if (!bcry) {
                    console.log("error in results ", error);
                    throw new Error("Does not compare")
                }
                if (bcry) {
                    console.log("final result", mong);
                    output = mong;
                };
                console.log("----- displaying--- ", output)
                return output;
            }
        },
        buyer: {
            type: buyerType,
            args: { email: { type: GraphQLString } },
            resolve(parent, args) {
                return buyerModel.findOne({ email: args.email });
            }
        },
        buyerLogin: {
            type: buyerType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let output = null, res = null;
                let mong = await buyerModel.findOne({ email: args.email })
                if (mong == null || mong.length == 0) {
                    console.log("error in results---- USER Not Found ");
                    throw new Error("USER Not Found");
                }
                var bcry = await bcrypt.compare(args.password, mong.password)
                if (!bcry) {
                    console.log("error in results ", error);
                    throw new Error("Does not compare")
                }
                if (bcry) {
                    console.log("final result", mong);
                    output = mong;
                };
                console.log("----- displaying--- ", output)
                return output;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addOwner: {
            type: ownerType,
            args: {
                owner_firstName: { type: GraphQLString },
                owner_lastName: { type: GraphQLString },
                owner_email: { type: GraphQLString },
                owner_phone: { type: GraphQLString },
                owner_password: { type: GraphQLString },
                cuisine: { type: GraphQLString },
                restaurantName: { type: GraphQLString },
                zipCode: { type: GraphQLString },
            },
            async resolve(parent, args) {
                console.log("inside resolve",args)
                
                let insertSignUp=null;
                insertSignUp = new restownerModel({
                    owner_firstName: args.owner_firstName,
                    owner_lastName: args.owner_lastName,
                    // cuisine: args.cuisine,
                    restaurantName: args.restaurantName,
                    zipCode: args.zipCode,
                    owner_phone: args.owner_phone,
                    owner_email: args.owner_email
                })
                let a= await bcrypt.hash(args.owner_password, saltRounds)
                console.log("a",a);
                insertSignUp.owner_password= a;

                return insertSignUp.save();
            }
        },
        addBuyer: {
            type: buyerType,
            args: {
                phone: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                address: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let insertSignUp=null;
                insertSignUp = new buyerModel({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                })
                let a= await bcrypt.hash(args.password, saltRounds);

                     insertSignUp.password= a
                    // return insertSignUp.save();
                // })
                return insertSignUp.save();
            }
        },
        updateOwner: {
            type: ownerType,
            args: {
                restaurantId: { type: GraphQLID },
                owner_firstName: { type: GraphQLString },
                owner_lastName: { type: GraphQLString },
                owner_phone: { type: GraphQLString },
                cuisine: { type: GraphQLString },
                restaurantName: { type: GraphQLString },
                zipCode: { type: GraphQLString },
            },
            resolve(parent, args) {
                return restownerModel.updateOne({ _id: args.restaurantId },
                    {
                        $set: {
                            owner_firstName: args.owner_firstName,
                            owner_lastName: args.owner_lastName,
                            owner_phone: args.owner_phone,
                            cuisine: args.cuisine,
                            restaurantName: args.restaurantName,
                            zipCode: args.zipCode,
                        }
                    })
            }
        },
        updateBuyer: {
            type: buyerType,
            args: {
                buyerId: { type: GraphQLID },
                phone: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                address: { type: GraphQLString }
            },
            resolve(parent, args) {
                return buyerModel.updateOne({ _id: args.buyerId },
                    {
                        $set: {
                            firstName: args.firstName,
                            lastName: args.lastName,
                            phone: args.phone,
                            address: args.address
                        }
                    })
            }
        },
        addSection: {
            type: ownerType,
            args: {
                restaurantId: { type: GraphQLID },
                sectionName: { type: GraphQLString },
                sectionDescription: { type: GraphQLString },
            },
            resolve(parent, args) {
                return restownerModel.update({ _id: args.restaurantId },
                    {
                        $push: {
                            section: {
                                sectionId: new mongoose.Types.ObjectId(),
                                sectionName: args.sectionName,
                                sectionDescription: args.sectionDescription,
                                item: []
                            }
                        }
                    })
            }
        },
        addItem: {
            type: ownerType,
            args: {
                restaurantId: { type: GraphQLID },
                sectionId: { type: GraphQLID },
                itemName: { type: GraphQLString },
                itemDescription: { type: GraphQLString },
                itemPrice: { type: GraphQLString }
            },
            resolve(parent, args) {
                return restownerModel.update({
                    _id: args.restaurantId,
                    "section.sectionId": mongoose.Types.ObjectId(args.sectionId)
                },
                    {
                        $push: {
                            "section.$.item": {
                                itemId: new mongoose.Types.ObjectId(),
                                itemName: args.itemName,
                                itemDescription: args.itemDescription,
                                itemPrice: args.itemPrice
                            }
                        }
                    })
            }
        },
        ownerLogin: {
            type: ownerType,
            args: {
                owner_email: { type: GraphQLString },
                owner_password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let output = null, res = null;
                let mong = await restownerModel.findOne({ owner_email: args.owner_email })
                if (mong == null || mong.length == 0) {
                    console.log("error in results --------", error);
                    output="Invalid Request";
                }
                // else if (mong.length == 0) {
                //     output = { ownerError: "Incorrect userId" };
                //     console.log("output", output)
                //     throw output;
                // }
                var bcry = await bcrypt.compare(args.owner_password, mong.owner_password)
                if (!bcry) {
                    console.log("error in results ");
                    // throw new Error("Does not compare")
                    output="Invalid Request";
                }
                if (bcry) {
                    console.log("final result", mong);
                    output = mong;
                };
                console.log("----- displaying--- ", output)
                return output;
            }
        },
        buyerLogin: {
            type: buyerType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let output = null, res = null;
                let mong = await buyerModel.findOne({ email: args.email })
                if (mong == null || mong.length == 0) {
                    console.log("error in results---- USER Not Found ");
                    // throw new Error("USER Not Found");
                    output="Invalid Request";
                }
                var bcry = await bcrypt.compare(args.password, mong.password)
                if (!bcry) {
                    console.log("error in results ");
                    // throw new Error("Does not compare")
                    output="Invalid Request";
                }
                if (bcry) {
                    console.log("final result", mong);
                    output = mong;
                };
                console.log("----- displaying--- ", output)
                return output;
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});