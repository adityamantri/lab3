import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import './Login.css';
import { connect } from 'react-redux';
import { searchItemRestaurantPosts } from '../../actions/searchActions';
import { ownerPastOrderPosts } from '../../actions/orderActions';
// import axios from 'axios';
//Define a Login Component

class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            restId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            pastList: []

        }
    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        let restId = { restId: JSON.parse( localStorage.getItem('owner')).restaurantId }
        console.log("restId is : ", restId)
        this.props.onCookie(restId);

    }


    render() {
        let details = null;
        if (typeof (this.props.pastList) !== 'undefined' && this.props.pastList !== null) {
            if(this.props.pastList.length > 0 ){

            details = this.props.pastList.map(orders => {
                return (

                    <tr>
                        <td><h4>{orders.firstName}</h4></td>
                        <td>{orders.address}</td>
                        <td>{orders.itemName}</td>
                        <td>{orders.orderItemQty}</td>
                        <td>{orders.itemPrice}</td>
                        <td>{orders.orderStatus}</td>
                    </tr>
                )
            });
            }
        }

        let display = (
            <div class="container">
                <div style={{ textAlign: "center" }}><h1>Past Orders</h1></div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Address</th>
                            <th>Item Name</th>
                            <th>Ouantity</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details}
                    </tbody>
                </table>
            </div>);

        return (
            <div>
                {display}
            </div >
        )
    }
}
const mapStateToProps = (store) => {
    console.log('store value', store);
    return {
        itemName: store.posts.itemName,
        restaurantList: store.posts.restaurantList,
        error: store.posts.error,
        pastList: store.posts.pastList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
        onSubmit: (e, data) => {
            e.preventDefault();
            console.log("mapDispatchToProps data:  ", data)
            dispatch(searchItemRestaurantPosts(data));
        },
        onCookie: (data) => {
            dispatch(ownerPastOrderPosts(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)