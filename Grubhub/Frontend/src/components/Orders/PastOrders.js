import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
// import { Redirect } from 'react-router';
import './Login.css';
import { connect } from 'react-redux';
import { pastOrdersPosts} from '../../actions/orderActions';
let restId=null;
let flag = false, redirectToRest = null;
class PastOrders extends Component {


    constructor(props){
       
        super(props);
        if(localStorage.getItem('buyer')){
        this.state={
            restId : JSON.parse( localStorage.getItem('buyer')).buyerId,
            pastList: []
            
        }}
    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        if(localStorage.getItem('buyer')){
        restId = {buyerId:JSON.parse( localStorage.getItem('buyer')).buyerId}
        this.props.onCookie(restId);
        }
        console.log("restId is : ",restId)
    }

    render() {
        //console.log("FGUJVHBKNLJHCFVJBKN", this.props.restaurantList)
        if (flag) {
            flag = false;
        } else {
            redirectToRest = null;
        }
        let details = null;
        if(localStorage.getItem('buyer')){
        if (this.props.pastList.length > 0 && typeof (this.props.pastList) !== 'undefined' && this.props.pastList !== null) {

            details = this.props.pastList.map(orders => {
                return (
                    <tr key={orders._id}>
                        <td><h4>{orders.restName}</h4></td>
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
                            <th>Restaurant Name</th>
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


        //redirect based on successful login
        let redirectVar = null;
        if (localStorage.getItem('buyer')) {
            //redirectVar = <Redirect to="/buyerProfile" />
        }
        return (
            <div>
                {/* <ul>  {restaurantlist}</ul> */}
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
        pastList: store.posts.pastList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCookie:(data)=>{
            dispatch(pastOrdersPosts(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PastOrders)