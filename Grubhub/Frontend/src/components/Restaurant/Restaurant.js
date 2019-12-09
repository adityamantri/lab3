import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './BuyerProfile.css';
import { getItemDisplayPosts, addItemPosts, deleteItemPosts } from '../../actions/itemActions';
import { insertOrderPosts } from '../../actions/orderActions'
import { connect } from 'react-redux';

let sectionHead = [], sectionBody = [], count = 0;
let redirectToView = null, itemDetailFlag = false;
let arr = {};
let quantity = [];
let cart = [];
let total = 0;
let cartdisp = "";
let sectionList = [];
class AddItem extends Component {

    myFunction7 = (y) => {
        var x = document.getElementById(y);
        console.log("reached function ", y)
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            restId: this.props.location.state.restId,
            sectionList: [],
            restaName: this.props.location.state.restName

        }
    }

    componentWillMount() {
        let restId = this.props.location.state.restId;
        this.props.onCookie(restId);
    }

    showcart = () => {  // {itemName:itemName, itemPrice:itemPrice, quantity:e.tartget.value};
        console.log("cart is : ", arr)
        cartdisp = cart.map((item) => {

            return (
                <div>
                    <li>{item.orderItemQty} Number of {item.itemName} and per item price @ {item.itemPrice}  </li>
                </div>
            )
        })
        this.setState({})
        console.log("cart display", cartdisp)
    }

    onData = (itemName) => {
        let restaurantId = this.props.restId;
        redirectToView = <Redirect to={{
            pathname: '/itemDetail',
            state: { itemName: itemName, restId: restaurantId }
        }} />
        itemDetailFlag = true;
        this.setState({});
    }

    onOrderData = () => {
        return {
            cart: cart
        }
    }

    createData = () => {
        return {
            restName: this.props.restName,
            itemDescription: this.props.itemDescription,
            restaurantId: this.props.restId,
            itemList: this.props.itemList,
            itemName: this.props.itemName,
            itemImage: this.props.itemImage,
            restId: this.props.restId,
            itemId: this.props.itemId,
            itemPrice: this.props.itemPrice
        }
    }

    handleQty(e, itemName, itemPrice) {
        Object.assign({}, quantity, { [e.target.name]: e.target.value })
    }

    qty = (e, itemName, itemPrice) => {
        console.log("qty function: ", itemName, itemPrice, e.target.value)
        let quan = e.target.value;


        let arr = {
            restId: this.props.location.state.restId,
            buyerId: JSON.parse( localStorage.getItem('buyer')).buyerId,
            restName: this.props.location.state.restName,
            orderStatus: "NEW",
            itemName: itemName,
            orderItemQty: quan,
            itemPrice: itemPrice,
            address: JSON.parse( localStorage.getItem('buyer')).address,
            firstName: JSON.parse( localStorage.getItem('buyer')).firstName
        }

        let temp = false;
        cart.forEach(element => {
            if (element.itemName === arr.itemName) {
                console.log("ele item name", element.itemName)
                console.log("arr item name", arr.itemName)
                element.orderItemQty = arr.orderItemQty;
                console.log("updated ele qty", element.orderItemQty)
                temp = true;
                total += (element.itemPrice * (arr.orderItemQty - element.orderItemQty));
            }

        });
        if (!temp) {
            total += (itemPrice * quan);
            cart.push(arr);
        }
    }

    refresh = () => {
        if (this.props.addOrderOutput == "order accepted") {
            console.log("changing Redirect to Upcoming order");
            redirectToView = (<Redirect to={{
                pathname: '/upcomingOrders',
                state: {}
            }} />)
        }
        this.setState({})
    }

    map = new Map();
    secNam = [];
    mapping = () => {
        if (this.props.itemList !== undefined) {
            console.log("map called")
            this.props.itemList.forEach(itm => {
                if (this.map.has(itm.sectionName)) {
                    let itmArray = this.map.get(itm.sectionName);
                    itmArray.push(itm);
                } else {
                    let itmArray1 = [];
                    itmArray1.push(itm);
                    this.map.set(itm.sectionName, itmArray1);
                    console.log(itm);
                    this.secNam.push(<option value={itm.sectionId}>{itm.sectionName}</option>)
                }
            });
        }
    }

    display = () => {
        console.log("reached display")
        this.map.clear();
        this.mapping();
        let foodArray = [];
        for (let [key, value] of this.map) {
            foodArray.push(
                <thead>
                    <h2>{key}</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Qty</th>
                    </tr>
                </thead>
            )
            for (let food of value) {
                foodArray.push(
                    <tr>
                        <a onClick={this.onData.bind(this, food.itemName, key)}><td>{food.itemName}</td></a>
                        <td>{food.itemPrice}</td>
                        <td><input type="text" name="quant" style={{ width: "40px" }} onChange={(e) => { this.qty(e, food.itemName, food.itemPrice) }} placeholder="0" /></td>
                        {/* <input value={food.itemName} class="btn btn-primary" onClick={(e) => this.props.deleteItem(e, this.onDeleteItem(food.itemName,key))}>Delete</input> */}
                        <br />
                    </tr>
                );
            }
        }
        return foodArray;
    }

    render() {
        if (itemDetailFlag) {
            itemDetailFlag = false;
        }
        else {
            redirectToView = null;
        }
        // eslint-disable-next-line eqeqeq
        if (this.props.addOrderOutput == "order accepted") {
            console.log("this.props.addOrderOutput:  ", this.props.addOrderOutput)
            console.log("changing Redirect to Upcoming order");
            redirectToView = (<Redirect to={{
                pathname: '/upcomingOrders',
                state: {}
            }} />)
        }

        let menu = this.display()
        let menuView = null;
        if (this.props.location.state !== undefined) {
            menuView = (
                <div class="container top-margin main " >
                    <p style={{ "textAlign": "center" }}><h2><strong>{this.props.location.state.restName}</strong></h2></p>
                    <br />
                    <form >
                        <div class="form-group">
                            <table class="table">
                                {menu}
                            </table>
                        </div>
                    </form>
                    <button class="btn btn-danger btn-lg btn-block" onClick={this.showcart} >Add To Cart</button>
                    <br />
                </div>
            );

        }

        return (
            <div>
                {redirectToView}
                <div id="deleteItem" style={{ "display": "block" }}> {menuView} </div >
                <div class="container">
                    <form>
                        <h2 style={{ textAlign: "center" }}>Your Cart</h2>
                        <ul>
                            {cartdisp}
                        </ul>
                        <h3 style={{ textAlign: "center" }}>Total {total}</h3>
                    </form>
                    <button name="confirm" onClick={(e) => this.props.onOrder(e, this.onOrderData())} class="btn btn-danger btn-lg btn-block">ORDER</button>

                </div>
            </div >
        )
    }
}
const mapStateToProps = (store) => {
    console.log('storte vaslur', store);
    return {
        sectionList: store.posts.sectionList,
        sectionName: store.posts.sectionName,
        sectionId: store.posts.sectionId,
        itemName: store.posts.itemName,
        itemDescription: store.posts.itemDescription,
        restaurantId: store.posts.restaurantId,
        itemId: store.posts.itemId,
        itemPrice: store.posts.itemPrice,
        itemList: store.posts.itemList,
        addOrderOutput: store.posts.addOrderOutput
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
        onSubmit: (e, data) => {
            console.log("mapDispatchToProps data:  ", data)
            dispatch(addItemPosts(data));
        },
        onCookie: (restId) => {
            console.log("onCookie mapDispatchToProps data:  ")
            //dispatch(getSectionPosts(localStorage.getItem('owner').restaurantId));
            console.log("this.props.location.state.restaurantId)", restId)
            //{/* dispatch(getItemPosts(restId)) */}
            if (localStorage.getItem('buyer')) {
                dispatch(getItemDisplayPosts(restId))
            }
        },
        deleteItem: (e, data) => {
            //e.preventDefault();
            console.log("inside delete item ");
            dispatch(deleteItemPosts(data))
        },
        onOrder: (e, data) => {
            console.log("inside onOrder mapDispatchToProps", data);
            dispatch(insertOrderPosts(data));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItem)