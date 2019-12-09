import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './BuyerProfile.css';
import { getItemPosts, addItemPosts, deleteItemPosts } from '../../actions/itemActions';
import { insertOrderPosts } from '../../actions/orderActions'
import { connect } from 'react-redux';
import axios from 'axios';

let sectionHead = [], sectionBody = [], count = 0;
let redirectToView = null, itemDetailFlag = false;

let quantity = [];
let cart = [];
let total = 0;
let cartdisp = "";
let sectionList=[];
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

    constructor(props){
        super(props);
        
        this.state={
            restId : this.props.location.state.restId,
            sectionList: [],
            restaName:this.props.location.state.restName
            
        }
    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        let restId = this.props.location.state.restId;
       // this.props.onCookie(restId);
       axios.defaults.withCredentials = true;
       axios.get(URL+`item/getItem/${restId}`)
           .then(response => {
               console.log("itemPostsSuccess", response);
   
               this.setState({
                sectionList:response.data.results,
                itemList:response.data.result
               })
   
           }).catch(error => {
               console.log("error thrown from backend ",error)
               throw (error);
           });
    }

    showcart = () => {  // {itemName:itemName, itemPrice:itemPrice, quantity:e.tartget.value};
        console.log("cart is : ", cart)
        cartdisp = cart.map((item) => {

            return (
                <div>
                    <li>{item[2]} Number of {item[0]} and per item price @ {item[1]}  </li>
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

    qty = (e, itemName, itemPrice) => {
        // quantity[itemName]=e.target.value;
        // iName=itemName;
        // iPrice=itemPrice;
        // console.log("qty itemName:",itemName)
        // console.log("qty itemPrice:   ",itemPrice)
        // console.log("qty quantity e: ", e.target.value)
        console.log("qty function: ", itemName, itemPrice, e.target.value)
        let quan = e.target.value;
        let arr = [ itemName, itemPrice, quan, 
            this.props.location.state.restId,
             this.props.location.state.restName,
             JSON.parse( localStorage.getItem('buyer')).buyerId,];

        total += (itemPrice * quan);
        cart.push(arr);
    }


    refresh= ()=>{
        console.log("addOrderOutput:  ",this.props.addOrderOutput)
        if(this.props.addOrderOutput=="order accepted"){
            console.log("changing Redirect to Upcoming order");
            redirectToView =( <Redirect to={{
                pathname: '/upcomingOrders',
                state: { }
            }} />)
        }
        this.setState({})
    }

    render() {

        
        

        if (itemDetailFlag) {
            itemDetailFlag = false;
        }
        else {
            redirectToView = null;
        }
        if(this.props.addOrderOutput=="order accepted"){
            console.log("this.props.addOrderOutput:  ",this.props.addOrderOutput)
            console.log("changing Redirect to Upcoming order");
            redirectToView =( <Redirect to={{
                pathname: '/upcomingOrders',
                state: { }
            }} />)
        }

        
        console.log('Section List is -------------------------------------------------->',this.state.sectionList)
      let list = this.state.sectionList.map(section => {
            return (
                <option value={section.sectionId}>{section.sectionName}</option>
            )
        });
    
        


        let table = new Map();
      
            console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for reloaddddddddddddddddddddddddddd')
           
            let header = this.state.sectionList.map(heading => {
            table.set(heading.sectionId, heading.sectionName);
        }
        );
        
        console.log(this.state.itemList)
        let newMap = new Map();
        for (let element of table) {
            let id = element[0];
            let value = element[1];
            console.log("element: ", id, value)
            for (let item of this.state.itemList) {
                console.log("item  ---- ", item.sectionId)
                if (item.sectionId == id) {
                    console.log("checking newmap here: ", newMap)
                    console.log('!newMap.has(id)', !newMap.has(id), id)
                    if (newMap.has(value)) {
                        console.log("arr---")
                        let arr = newMap.get(value);
                        arr.push([item.itemName, item.itemPrice]);
                        console.log("arr---", arr)
                        newMap.set(value, arr);

                    } else {
                        newMap.set(value, [[item.itemName, item.itemPrice]])
                        console.log("sid---", id)

                    }
                }
            }

        } console.log("New MAp -----", newMap);
        console.log('Section List is ----------------------------->',this.state.sectionList)

          let details = this.state.sectionList.map(section => {
            console.log(table);
            for (let entity of newMap) {
                sectionHead[count] = <thead>{entity[0]}</thead>;
                sectionBody[count] = entity[1].map(item => {
                    console.log("item::::::", item)
                    return (
                        <tr>
                        <td><a onClick={this.onData.bind(this, item[0])}>{item[0]}</a></td>
                            <td>{(item[1])}</td>
                            <td><input type="text" name="quant" style={{ width: "40px" }} onChange={(e) => { this.qty(e, item[0], item[1]) }} placeholder="0" /></td>
                            {/* {(e) => this.props.onSubmit(e,this.createData())} */}
                        </tr>
                    )
                })
                count++;
            }

            return (
                <tr>
                    <td>{section.sectionName}</td>
                    <td>{section.sectionDescription}</td>
                </tr>
            )
        });
        

        let display = (
            <table class="table">
                <thead>
                    <h2>{sectionHead[0]}</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {sectionBody[0]}
                </tbody>
                <thead>
                    <h2>{sectionHead[1]}</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {sectionBody[1]}
                </tbody>
                <thead>
                    <h2>{sectionHead[2]}</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {sectionBody[2]}
                </tbody>
            </table>
        );
        let menuView=null;
        if(this.props.location.state !== undefined){
        menuView = (
            <div class="container top-margin main " >
                <p style={{ "textAlign": "center" }}><h2><strong>{this.props.location.state.restName}</strong></h2></p>
                <br />
                <form >
                    <div class="form-group">
                        {display}
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
                    <button name="confirm" onClick={(e) => this.props.onOrder(e,this.onOrderData())} class="btn btn-danger btn-lg btn-block">ORDER</button>

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
        //itemImage: store.props.itemImage,
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
            //e.preventDefault();
            console.log("mapDispatchToProps data:  ", data)
            dispatch(addItemPosts(data));
        },
        onCookie: (restId) => {
            console.log("onCookie mapDispatchToProps data:  ")
            //dispatch(getSectionPosts(localStorage.getItem('owner').restaurantId));
            console.log("this.props.location.state.restaurantId)", restId)
            dispatch(getItemPosts(restId))
        },
        deleteItem: (e, data) => {
            //e.preventDefault();
            console.log("inside delete item ");
            dispatch(deleteItemPosts(data))
        },
        onOrder: ( e,data) => {
            console.log("inside onOrder mapDispatchToProps",data);
            dispatch(insertOrderPosts(data));
            
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItem)