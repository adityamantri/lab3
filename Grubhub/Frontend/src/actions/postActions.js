import { BUYER_SIGNUP_POST, BUYER_LOGIN_POST, OWNER_SIGNUP_POST } from './types';
import axios from 'axios';
import cookie from 'react-cookies';
import {URL} from '../Constant';


export const buyerSignUpPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    axios.post(URL+'buyer/signUpBuyer', postData)
        .then(response => {
            console.log("buyerSignUpPostsSuccess", response + response.data);
            localStorage.setItem('cookie',"Added Successfully")
            dispatch(buyerSignUpPostsSuccess(response.data));

        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}
export const buyerSignUpPostsSuccess = (data) => {
    return {
        type: BUYER_SIGNUP_POST,
        payload: {
            error: data
        }
    }
}

export const buyerLoginPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    axios.post(URL+'buyer/signInBuyer', postData)
        .then(response => {
            
            localStorage.setItem('token', response.headers.authorization);
            // console.log(localStorage.getItem('token'));
            localStorage.setItem('buyer',JSON.stringify(response.data))
            console.log("buyerSignInPostsSuccess--------", response.data);

            dispatch(buyerLoginPostsSuccess(response.data));

        }).catch(error => {
            throw (error);
        });
}
export const buyerLoginPostsSuccess = (data) => {
    return {
        type: BUYER_LOGIN_POST,
        payload: {
            address: data.address,
            buyerId: data.buyerId,
            email: data.email,
            firstName: data.firstName,
            image: data.image,
            lastName: data.lastName,
            password: data.password,
            phone: data.phone,
            error: data.error,
        }
    }
}


export const buyerProfilePosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    let authorization=localStorage.getItem('token');

    //make a post request with the user data
    axios.post(URL+'buyer/updateBuyer', postData, {headers:{ 'Authorization': authorization }})
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("buyer profile response--------- ", response)
                dispatch(buyerLoginPostsSuccess(response.data));
            }
        }).catch(error => {
            throw (error);
        });
}

export const buyerCookieData = () => dispatch => {

    let buyer =JSON.parse( localStorage.getItem('buyer'));
    console.log("cookie variable buyer", buyer);
    let authorization=localStorage.getItem('token');
    console.log("authorization: ",authorization)

    axios.get(URL+`buyer/getBuyer/${buyer.buyerId}`,{ params:{}, headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("buyer profile response--------- ", response)
                dispatch(buyerLoginPostsSuccess(response.data));
            }
        }).catch(error => {
            throw (error);
        });
}

export const ownerProfilePosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    let authorization=localStorage.getItem('token');

    //make a post request with the user data
    axios.post(URL+'owner/updateOwner', postData, {headers:{ 'Authorization': authorization }})
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("owner profile response--------- ", response)
                dispatch(ownerSignUpPostsSuccess(response.data));
            }
        }).catch(error => {
            throw (error);
        });
}

export const ownerCookieData = () => dispatch => {

    let owner = JSON.parse(localStorage.getItem('owner'));
    console.log("cookie variable owner", owner);
    let authorization=localStorage.getItem('token');
    console.log("authorization: ", authorization)
    
    axios.get(URL+`owner/getowner/${owner.restaurantId}`,{ params:{}, headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                localStorage.setItem('owner',JSON.stringify(response.data))
                console.log("owner profile response--------- ", response)
                dispatch(ownerSignUpPostsSuccess(response.data));
            }
        }).catch(error => {
            throw (error);
        });
}

export const ownerSignUpPosts = (postData) => dispatch => {
    console.log("reached axios", postData);
    
    axios.defaults.withCredentials = true;
    axios.post(URL+'owner/signUpOwner', postData)
        .then(response => {
            console.log("ownerSignInPostsSuccess--------", response.data);
            localStorage.setItem('token', response.headers.authorization);
            localStorage.setItem('owner',JSON.stringify(response.data))

            dispatch(ownerSignUpPostsSuccess(response.data));

        }).catch(error => {
            throw (error);
        });
}

export const ownerSignInPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    axios.post(URL+'owner/signInOwner', postData)
        .then(response => {
            console.log("ownerSignInPostsSuccess--------", response.data);
            localStorage.setItem('token', response.headers.authorization);
            localStorage.setItem('owner',JSON.stringify(response.data))

            dispatch(ownerSignUpPostsSuccess(response.data));

        }).catch(error => {
            throw (error);
        });
}

export const ownerSignUpPostsSuccess = (data) => {
    return {
        type: OWNER_SIGNUP_POST,
        payload: {
            owner_address: data.owner_address,
            restaurantId: data.restaurantId,
            owner_email: data.owner_email,
            owner_firstName: data.owner_firstName,
            owner_image: data.owner_image,
            owner_lastName: data.owner_lastName,
            owner_password: data.owner_password,
            owner_phone: data.owner_phone,
            zipCode: data.zipCode,
            cuisine: data.cuisine,
            restaurantImage: data.restaurantImage,
            restaurantName: data.restaurantName,
            error:data.ownerError
        }
    }
}

