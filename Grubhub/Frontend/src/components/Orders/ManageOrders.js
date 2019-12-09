import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import './Login.css';
import { connect } from 'react-redux';
import { searchItemRestaurantPosts } from '../../actions/searchActions';
import { fetchOrderPosts, sendMessageOwnerPosts, updateOrderPosts } from '../../actions/orderActions';

class ManageOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            upcomingList: [],
            message: ""

        }
        this.onChangeMessage = this.onChangeMessage.bind(this)

    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        let restId = { restId: JSON.parse( localStorage.getItem('owner')).restaurantId }
        console.log("restId is : ", restId)
        this.props.fetchOrder(restId);

    }

    searchData = () => {
        return {
            itemName: this.props.itemName,
            error: this.props.error
        }
    }

    handleChange = (e, series) => {
        let status = e.target.value;
        let data = {
            orderStatus: status,
            series: series
        }
        this.props.updateOrderPosts(data);
        // window.location.reload();

    }
    setMessage(id) {
        return {
            message: this.state.message,
            _id: id
        }
    }
    onChangeMessage(e) {
        console.log(e.target.value, "--------")
        this.setState({ message: "Restaurant: " + e.target.value })

    }

    render() {
        let details = null;
        if (this.props.upcomingList.length > 0 && typeof (this.props.upcomingList) !== 'undefined' && this.props.upcomingList !== null) {

            details = this.props.upcomingList.map(orders => {
                return (
                    <tbody>

                        <tr>
                            <td><h4>{orders.firstName}</h4></td>
                            <td>{orders.address}</td>
                            <td>{orders.itemName}</td>
                            <td>{orders.orderItemQty}</td>
                            <td>{orders.itemPrice}</td>
                            <td>{orders.orderStatus}</td>
                            <td><select
                                onChange={(e) => this.handleChange(e, orders.series)} name="selectValue" id="selectValue">
                                <option value="NEW">NEW</option>
                                <option value="PREPARING">PREPARING</option>
                                <option value="READY">READY</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCEL">CANCEL</option>
                            </select></td>
                        </tr>
                        <tr>
                            <td colspan="7">
                                {orders.message.map(element => {
                                    return <div>{element}<br /></div>
                                })
                                }
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6">
                                <textarea type="text" cols="45" id={orders._id} onChange={this.onChangeMessage}></textarea>
                            </td>
                            <td>
                                <button class="btn-primary" type="submit" onClick={() => { this.props.sendNewMessage(this.setMessage(orders._id)) }}>Message</button>
                            </td>
                        </tr>
                    </tbody>
                )
            });
        }

        let display = (
            <div class="container">
                <div style={{ textAlign: "center" }}><h1>Manage Orders</h1></div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Address</th>
                            <th>Item Name</th>
                            <th>Ouantity</th>
                            <th>Price</th>
                            <th>Current Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    {details}
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
        upcomingList: store.posts.upcomingList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrder: (restId) => {
            console.log("mapDispatchToProps data:  ", restId)

            dispatch(fetchOrderPosts(restId));
        },
        sendNewMessage: (data) => {
            dispatch(sendMessageOwnerPosts(data));
        },
        updateOrderPosts: (data) => {
            dispatch(updateOrderPosts(data))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrders)