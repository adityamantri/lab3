import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './BuyerProfile.css';
import { getSectionPosts } from '../../actions/sectionActions';
import { getItemDisplayPosts, addItemPosts, deleteItemPosts } from '../../actions/itemActions';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo';
const addItemQuery = gql`
mutation addItem($restaurantId:String!, $sectionId: String!, $itemName: String, $itemDescription: String) 
    {
        addItem(restaurantId:$restaurantId, sectionId:$sectionId, itemName: $itemName, itemDescription: $itemDescription) {
      id
      
    }
    
}
`





let sectionHead = [], sectionBody = [], count = 0;
let redirectToView = null, itemDetailFlag = false;

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

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.props.onCookie();
    }
    componentDidMount() {
        this.props.displaySection();
    }
    onDeleteItem = (name, key) => {
        return {
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            sectionName: key,
            itemName: name
        }
    }

    onData = (itemName, sectionName) => {
        let restaurantId = JSON.parse( localStorage.getItem('owner')).restaurantId;
        redirectToView = <Redirect to={{
            pathname: '/itemDetail',
            state: { itemName: itemName, sectionName: sectionName, restId: restaurantId }
        }} />
        itemDetailFlag = true;
        this.setState({});
    }
    createData = () => {
        var a = document.getElementById("sectionlist");
        a = (a.options[a.selectedIndex].value);
        return {
            sectionName: this.props.sectionName,
            itemDescription: this.props.itemDescription,
            restaurantId: JSON.parse (localStorage.getItem('owner')).restaurantId,
            sectionId: a,
            itemList: this.props.itemList,
            itemName: this.props.itemName,
            itemImage: this.props.itemImage,
            restId: this.props.restId,
            itemId: this.props.itemId,
            itemPrice: this.props.itemPrice
        }
    }

    async submitForm(e) {
        e.preventDefault();
        let { data } = await this.props.addItemQuery({
            variables: {
                
                restaurantId: this.props.restaurantId,
            sectionId: this.props.sectionId,
            itemName: this.props.itemName,
            itemDescription: this.props.itemDescription,
            itemPrice: this.props.itemPrice

            }
        })
    }

    updateData = () => {
        console.log("inside updateData()");
        var a = document.getElementById("sectionlist");
        a = (a.options[a.selectedIndex].value);
        return {
            itemName: this.props.itemName,
            sectionDescription: this.props.sectionDescription,
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            sectionId: a
        }
    }
    map = new Map();
    secNam = [];
    mapping = () => {
        if (this.props.itemList !== undefined) {
            this.props.itemList.forEach(itm => {
                if (this.map.has(itm.sectionName)) {
                    let itmArray = this.map.get(itm.sectionName);
                    itmArray.push(itm);
                } else {
                    let itmArray1 = [];
                    itmArray1.push(itm);
                    this.map.set(itm.sectionName, itmArray1);
                    console.log(itm);
                }
            });
        }
        if (this.props.sectionList !== undefined) {
            this.props.sectionList.forEach(itm => {
                this.secNam.push(<option value={itm.sectionId}>{itm.sectionName}</option>)
            });
        }
    }

    display = () => {

        this.mapping();
        let foodArray = [];
        for (let [key, value] of this.map) {
            foodArray.push(
                <thead>
                    <h2>{key}</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                    </tr>
                </thead>
            )
            for (let food of value) {
                foodArray.push(

                    <tr>
                        <a onClick={this.onData.bind(this, food.itemName, key)}><td>{food.itemName}</td></a>
                        <td>{food.itemPrice}</td>
                        <td><button type="button" value={food.itemName} class="btn btn-primary" onClick={(e) => this.props.deleteItem(e, this.onDeleteItem(food.itemName, key))}>Delete</button></td>
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
        if (!localStorage.getItem('owner')) {
            return (redirectToView = (<Redirect to='/startPage' />))
        }

        let sidebar = (
            <div class="sidenav">
                <h2 class="title nav-header">Menu</h2>
                <ul>
                    <li><a onClick={() => this.myFunction7("deleteItem")}>View/Update/Del</a></li>
                    <li><a onClick={() => this.myFunction7("addItem")}>Add Item</a></li>
                </ul>
            </div>
        );

        let addItem = (
            <div class="container top-margin main " >
                <p><h3>Add Item</h3></p>
                <br />
                <form onSubmit={(e) => {this.props.onSubmit(e, this.createData());this.myFunction7("addItem")}}>
                    <div class="form-group">
                        <input type="file" ></input>
                        <h4>Section</h4>
                        <select name="sectionlist" id="sectionlist" >
                            {this.secNam}
                        </select>
                        <h4>Item Name</h4>
                        <input type="text" onChange={this.props.onChange} class="form-control" name="itemName" required />
                        <h4>Item Description</h4>
                        <textarea type="text" onChange={this.props.onChange} class="form-control" name="itemDescription" required />
                        <h4>Item Price</h4>
                        <input type="text" onChange={this.props.onChange} class="form-control" name="itemPrice" required />
                    </div>
                    <br />
                    <button type="submit" class="btn btn-primary " ><strong>Add</strong></button>
                    <button type="button" onClick={() => this.myFunction7("addItem")} class="btn btn-default " value="cancel" ><strong>Cancel</strong></button>
                </form>
                <br />
            </div>
        );

        let updateItem = (
            <div class="container top-margin main updateSection" >
                <p><h3>Update Item</h3></p>
                <br />
                <form onSubmit={(e) => {this.props.onSubmit(e, this.createData()); this.myFunction7("addItem");}}>
                    <div class="form-group">
                        <input type="file" ></input>
                        <h4>Section</h4>
                        <select name="sectionlist" id="sectionlist" >
                            {this.secNam}
                        </select>
                        <h4>Item Name</h4>
                        <input type="text" onChange={this.props.onChange} class="form-control" name="itemName" placeholder={this.props.itemName} required />
                        <h4>Item Description</h4>
                        <textarea type="text" onChange={this.props.onChange} class="form-control" name="itemDescription" placeholder={this.props.itemDescription} required />
                        <h4>Item Price</h4>
                        <input type="text" onChange={this.props.onChange} class="form-control" name="itemPrice" placeholder={this.props.itemPrice} required />
                    </div>
                    <br />
                    <button type="submit" class="btn btn-primary " ><strong>Add</strong></button>
                    <button type="button" onClick={() => this.myFunction7("addItem")} class="btn btn-default " value="cancel" ><strong>Cancel</strong></button>
                </form>
                <br />
            </div>
        );


        let menuView = (
            <div class="container top-margin main " >
                <p><h3>View/Delete Item</h3></p>
                <h5>Click on Item to Update</h5>
                <br />
                <form >
                    <div class="form-group">
                        <table class="table">
                            {this.display()}
                        </table>
                    </div>
                </form>
            </div>
        );

        return (
            <div>
                {redirectToView}
                {sidebar}
                <div id="addItem" style={{ "display": "none" }}> {addItem} </div >
                <div id="updateItem" style={{ "display": "none" }}> {updateItem} </div >
                <div id="deleteItem" style={{ "display": "block" }}> {menuView} </div >
            </div >
        )
    }
}

// c0
// export default connect(mapStateToProps, mapDispatchToProps)(AddItem)

export default compose(
    // graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addItemQuery, { name: "addItemQuery" })
    )(AddItem)