import { SECTION_POST } from './types';
import axios from 'axios';
import {URL} from '../Constant';

export const addSectionPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    let authorization=localStorage.getItem('token');
    axios.post(URL+'section/addSection', postData, {headers:{ 'Authorization': authorization }})
        .then(response => {
            console.log("sectionPostsSuccess", response);
// localStorage.setItem('section',response.data[0])
            dispatch(sectionPostsSuccess(response.data[0].section));

        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}
export const sectionPostsSuccess = (data) => {
    return {
        type: SECTION_POST,
        payload: {
            sectionList: data
            // sectionName: data.sectionName,
            // sectionId: data.sectionId,
            // sectionDescription: data.sectionDescription,
            // restaurantId: data.restId
        }
    }
}
export const deleteSectionPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    let restId=JSON.parse(localStorage.getItem('owner')).restaurantId
    let authorization=localStorage.getItem('token');
    axios.delete(URL+`section/deleteSection/${postData}/${restId}`,{ params:{}, headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("sectionPostsSuccess", response);

            dispatch(sectionPostsSuccess(response.data[0].section));

        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}

export const getSectionPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    let authorization=localStorage.getItem('token');
    axios.get(URL+`section/getSection/${postData}`,{ params:{}, headers: { 'Authorization': authorization } })
        .then(response => {
            console.log("sectionPostsSuccess", response);
localStorage.setItem('section',response.data[0])
            dispatch(sectionPostsSuccess(response.data[0].section));

        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}

export const updateSectionPosts = (postData) => dispatch => {
    console.log("reached axios", postData)
    axios.defaults.withCredentials = true;
    postData.restaurantId=JSON.parse(localStorage.getItem('owner')).restaurantId;
    let authorization=localStorage.getItem('token');
    axios.post(URL+`section/updateSection`,postData, {headers:{ 'Authorization': authorization }})
        .then(response => {
            console.log("sectionPostsSuccess", response);
            localStorage.setItem('section',response.data[0])
            dispatch(sectionPostsSuccess(response.data[0].section));
        }).catch(error => {
            console.log("error thrown from backend ")
            throw (error);
        });
}
