import { SEARCH_POST } from './types';
import axios from 'axios';
import {URL} from '../Constant';

export const searchItemRestaurantPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    let authorization=localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    axios.post(URL+'search/searchRestaurant', postData, {headers:{ 'Authorization': authorization }})
        .then(response => {
            console.log("sectionPostsSuccess", response);

            dispatch(searchPostsSuccess(response.data));

        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}
export const searchPostsSuccess = (data) => {
    return {
        type: SEARCH_POST,
        payload: {
            restaurantList: data
        }
    }
}

