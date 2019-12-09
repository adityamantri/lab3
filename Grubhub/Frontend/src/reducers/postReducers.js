import { ITEM_POST, PAST_ORDER, ADD_ORDER_POST, UPCOMING_ORDER_POST, FETCH_ORDER_POST, BUYER_SIGNUP_POST, BUYER_LOGIN_POST, LOAD_BUYER_COOKIE, OWNER_SIGNUP_POST, SECTION_POST, SEARCH_POST } from '../actions/types';

// Reducer holds the functionality to modify any action done on component page

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    image: "",
    phone: "",

    error: "",

    owner_address: "",
    restaurantId: "",
    owner_email: "",
    owner_firstName: "",
    owner_image: "",
    owner_lastName: "",
    owner_password: "",
    owner_phone: "",
    zipCode: "",
    cuisine: "",
    restaurantImage: null,
    restaurantName: "",
    ownerError: "",

    sectionName: "",
    sectionDescription: "",
    sectionId: "",
    sectionList: [],

    itemList: [],
    itemName: "",
    itemDescription: "",
    itemImage: "",
    itemPrice: "",

    restaurantList: [],

    addOrderOutput: "",
    upcomingList: [],
    pastList: []
    //single post object that we send to backend---------imp
}

// the below function checks what action we are dealing with. 
export default function (state = initialState, action) {
    console.log('Action Value in Reducer ', action)
    switch (action.type) {

        case 'CHANGE':
            const { name, value } = action.value.target;
            let som = Object.assign({}, state, { [name]: value })
            console.log(som)
            return som;

        case BUYER_SIGNUP_POST:
            console.log("inside postReducer BUYER_SIGNUP_POST CASE: Action ---", action)
            return {
                error: action.payload.error
            }

        case BUYER_LOGIN_POST:
            console.log("inside postReducer BUYER_LOGIN_POST switch case", action)
            return {
                address: action.payload.address,
                buyerId: action.payload.buyerId,
                email: action.payload.email,
                firstName: action.payload.firstName,
                image: action.payload.image,
                lastName: action.payload.lastName,
                password: action.payload.password,
                phone: action.payload.phone,
                error: action.payload.error,
                restaurantList: []
            }

        case LOAD_BUYER_COOKIE:
            console.log("loading buyer cookie to state: ", action)
            return {

            }

        case OWNER_SIGNUP_POST:
            console.log("OWNER_SignUp reducer");
            var obj6= Object.assign({}, state,{

                owner_address: action.payload.owner_address,
                restaurantId: action.payload.restaurantId,
                owner_email: action.payload.owner_email,
                owner_firstName: action.payload.owner_firstName,
                owner_image: action.payload.owner_image,
                owner_lastName: action.payload.owner_lastName,
                owner_password: action.payload.owner_password,
                owner_phone: action.payload.owner_phone,
                zipCode: action.payload.zipCode,
                cuisine: action.payload.cuisine,
                restaurantImage: action.payload.restaurantImage,
                restaurantName: action.payload.restaurantName,
                ownerError: action.payload.error
            });
            return obj6;

        case SECTION_POST:
            console.log("Inside SECTION_POST Reducer Section");
            var obj5= Object.assign({}, state,{

                sectionList: action.payload.sectionList
                // sectionName: action.payload.sectionName,
                // sectionId: action.payload.sectionId,
                // sectionDescription: action.payload.sectionDescription,
                // //restaurant ID is restID
                // restaurantId: action.payload.restaurantId
            })
            return obj5;

        case ITEM_POST:
            console.log("inside ITEM_POST Reducer Section", action)
            var obj3=Object.assign({}, state,{ itemList: action.payload.itemList,
                sectionList: action.payload.sectionList,
                sectionId: action.payload.sectionId,
                sectionDescription: action.payload.sectionDescription,
                restaurantId: action.payload.restId,
                itemImage: action.payload.itemImage,
                itemId: action.payload.itemId,
                itemDescription: action.payload.itemDescription,
                itemPrice: action.payload.itemPrice,
                itemName: action.payload.itemName,
                sectionName: action.payload.sectionName});
            return obj3;

        case SEARCH_POST:
            console.log("Reached SEARCH_POST reducer")
            var obj=Object.assign({}, state,{ restaurantList: action.payload.restaurantList});
             return obj

        case ADD_ORDER_POST:
            console.log("Reached ADD_ORDER_POST reducer")
            return {
                addOrderOutput: action.payload.addOrderOutput
            }

        case UPCOMING_ORDER_POST:
            console.log("Reached FETCH_ORDER_POST reducer", action.payload)
            var obj1=Object.assign({}, state,{ upcomingList: action.payload.upcomingList});

            return obj1;

        case FETCH_ORDER_POST:
            console.log("Reached FETCH_ORDER_POST reducer", action.payload)
            var obj2=Object.assign({}, state,{ upcomingList: action.payload.upcomingList});
            return obj2;

        case PAST_ORDER:
            console.log("Reached PAST_ORDER reducer", action.payload)
            return {
                pastList: action.payload.pastList
            }

        default:
            return state;
    }
}