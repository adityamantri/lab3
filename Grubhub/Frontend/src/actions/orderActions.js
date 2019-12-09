import { ADD_ORDER_POST, UPCOMING_ORDER_POST, PAST_ORDER, FETCH_ORDER_POST } from './types';
import axios from 'axios';
// import cookie from 'react-cookies';
import {URL} from '../Constant'


export const insertOrderPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    let authorization = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.post(URL+'order/add', postData, { headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("insertOrderSuccess", response);

            dispatch(insertOrderSuccess(response.data));

        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}
export const insertOrderSuccess = (data) => {
    console.log("item posts succcess: data ", data)
    return {
        type: ADD_ORDER_POST,
        payload: {
            addOrderOutput: data.output
        }
    }
}

export const fetchOrderPosts = (postData) => dispatch => {
    axios.defaults.withCredentials = true;
    console.log("reached axios", postData)
    let authorization = localStorage.getItem('token');
    axios.post(URL+`ownerOrder/currentOrder`, postData, { headers: { 'Authorization': authorization } })
        .then(response => {
            dispatch(fetchOrderSuccess(response.data));

        }).catch(error => {
            console.log("error thrown from backend ", error)
            throw (error);
        });
}

export const fetchOrderSuccess = (data) => {
    console.log("item posts succcess: data ", data)
    return {
        type: FETCH_ORDER_POST,
        payload: {
            upcomingList: data
        }
    }
}

export const upcomingOrderPosts = (postData) => dispatch => {
    axios.defaults.withCredentials = true;
    console.log("reached axios", postData)
    let authorization = localStorage.getItem('token');
    axios.post(URL+`order/upcomingOrder`, JSON.parse( localStorage.getItem('buyer')), { headers: { 'Authorization': authorization } })
        .then(response => {
            dispatch(upcomingOrderSuccess(response.data));

        }).catch(error => {
            console.log("error thrown from backend ", error)
            throw (error);
        });
}

export const upcomingOrderSuccess = (data) => {
    console.log("item posts succcess: data ", data)
    return {
        type: UPCOMING_ORDER_POST,
        payload: {
            upcomingList: data
        }
    }
}

export const pastOrdersPosts = (postData) => dispatch => {
    axios.defaults.withCredentials = true;
    console.log("reached axios", postData)
    let authorization = localStorage.getItem('token');
    axios.post(URL+`order/pastOrder`, postData, { headers: { 'Authorization': authorization } })
        .then(response => {
            dispatch({
                type: PAST_ORDER,
                payload: {
                    pastList: response.data
                }
            })

        }).catch(error => {
            console.log("error thrown from backend ", error)
            throw (error);
        });
}

export const ownerPastOrderPosts = (postData) => dispatch => {
    axios.defaults.withCredentials = true;
    console.log("reached axios", postData)
    let authorization = localStorage.getItem('token');
    axios.post(URL+`ownerOrder/pastOrder`, postData, { headers: { 'Authorization': authorization } })
        .then(response => {
            dispatch({
                type: PAST_ORDER,
                payload: {
                    pastList: response.data
                }
            })
        }).catch(error => {
            console.log("error thrown from backend ", error)
            throw (error);
        });
}

export const sendMessagePosts= (postData)=> dispatch=>{
    axios.defaults.withCredentials = true;
    console.log("reached sendMessagePosts axios", postData)
    let authorization = localStorage.getItem('token');
    postData.buyerId=JSON.parse(localStorage.getItem('buyer'))._id;
    axios.post(URL+`order/sendMessage`, postData, { headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("send Message Posts Success", response);
            dispatch(upcomingOrderSuccess(response.data));

        })
        // .then(upcomingOrderPosts(JSON.parse( localStorage.getItem('buyer')).buyerId))
        .catch(error => {
            console.log("error thrown from backend ", error)
            throw (error);
        });
}

export const sendMessageOwnerPosts= (postData)=> dispatch=>{
    axios.defaults.withCredentials = true;
    console.log("reached sendMessagePosts axios", postData)
    let authorization = localStorage.getItem('token');
    postData.restId=JSON.parse( localStorage.getItem('owner')).restaurantId;
    axios.post(URL+`ownerOrder/sendMessage`, postData, { headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("send Message Posts Success", response);
            dispatch(fetchOrderSuccess(response.data));
        })
        // .then(upcomingOrderPosts(JSON.parse( localStorage.getItem('buyer')).buyerId))
        .catch(error => {
            console.log("error thrown from backend ", error)
            throw (error);
        });
}

export const updateOrderPosts=(postData)=>dispatch=>{
    axios.defaults.withCredentials = true;
    console.log("reached sendMessagePosts axios", postData)
    postData.restId=JSON.parse( localStorage.getItem('owner')).restaurantId;
    let authorization = localStorage.getItem('token');
        axios.post(URL+`ownerOrder/updateOrderStatus`, postData, { headers: { 'Authorization': authorization } })
            .then(response => {
                console.log("update Status Posts Success", response);
                dispatch(fetchOrderSuccess(response.data));
            }).catch(error => {
                console.log("error thrown from backend ", error)
                throw (error);
            });
}