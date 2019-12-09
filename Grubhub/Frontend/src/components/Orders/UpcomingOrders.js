import React, { Component } from 'react';
import '../../App.css';
// import cookie from 'react-cookies';
import './Login.css';
import { connect } from 'react-redux';
import { searchItemRestaurantPosts } from '../../actions/searchActions';
import { upcomingOrderPosts, sendMessagePosts } from '../../actions/orderActions';
import ReactPaginate from 'react-paginate';
let flag = false;
class UpcomingOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restId: JSON.parse( localStorage.getItem('buyer')).buyerId,
            upcomingList: [],
            message: ""

        }
        this.onChangeMessage = this.onChangeMessage.bind(this)
    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        let restId = JSON.parse( localStorage.getItem('buyer')).buyerId;
        console.log("restId is : ", restId)
        this.props.onCookie(restId);

    }



    onChangeMessage(e) {
        console.log(e.target.value, "--------")
        this.setState({ message: "Customer: " + e.target.value })

    }
    setMessage(id) {
        return {
            message: this.state.message,
            _id: id
        }
    }

    render() {
        if (flag) {
            flag = false;
        } else {
        }
        let details = null;
        if ( typeof (this.props.upcomingList) !== 'undefined' && this.props.upcomingList !== null) {
if(this.props.upcomingList.length > 0 ){
            details = this.props.upcomingList.map(orders => {
                return (

                    <tbody>

                        <tr >
                            <td><h4>{orders.restName}</h4></td>
                            <td><h4>{orders.itemName}</h4></td>
                            <td><h4>{orders.orderItemQty}</h4></td>
                            <td><h4>{orders.itemPrice}</h4></td>
                            <td><h4>{orders.orderStatus}</h4></td>
                        </tr>

                        <tr>
                            <td colSpan="5">
                                {orders.message.map(element => {
                                    return <div>{element}<br /></div>
                                })
                                }
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="4">
                                <textarea type="text" cols="50" id={orders._id} onChange={this.onChangeMessage}></textarea>
                            </td>
                            <td>
                                <button class="btn-primary" onClick={() => { this.props.sendNewMessage(this.setMessage(orders._id)); }}>Message</button>
                            </td>
                        </tr>

                    </tbody>


                )
            });
        }}

        let display = (
            <div class="container">
                <div style={{ textAlign: "center" }}><h1>Upcoming Orders</h1></div>
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

                    {details}
                </table>
            </div>);

        return (
            <div>
                {display}
                <div class='container'>
                        <ReactPaginate 
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={4}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                      />
                    </div>
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
        onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
      //  onSubmit: (e, data) => {
       //     e.preventDefault();
      //      console.log("mapDispatchToProps data:  ", data)
      //      dispatch(searchItemRestaurantPosts(data));
      //  },
        onCookie: (data) => {
            dispatch(upcomingOrderPosts(data));
        },
       sendNewMessage: ( data) => {
            dispatch(sendMessagePosts(data))
        // await   window.location.reload();

           // {/* .then(dispatch(upcomingOrderPosts(data))) */}
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingOrder)