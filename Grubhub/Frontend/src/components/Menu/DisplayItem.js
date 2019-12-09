import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './BuyerProfile.css';
import { getItemPosts, addItemPosts, deleteItemPosts } from '../../actions/itemActions';
import { connect } from 'react-redux';
//Define a Login Component

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
        console.log("component will mount section.js ");
    }

    onDeleteItem = (name) => {
        return {
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            itemName: name
        }
    }

    onData = (itemName) => {
        let restaurantId = JSON.parse( localStorage.getItem('owner')).restaurantId;
        redirectToView = <Redirect to={{
            pathname: '/itemDetail',
            state: { itemName: itemName, restId: restaurantId }
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
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            sectionId: a,
            itemList: this.props.itemList,
            itemName: this.props.itemName,
            itemImage: this.props.itemImage,
            restId: this.props.restId,
            itemId: this.props.itemId,
            itemPrice: this.props.itemPrice
        }
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
    render() {

        if (itemDetailFlag) {
            itemDetailFlag = false;
        }
        else {
            redirectToView = null;
        }
        if(!localStorage.getItem('owner')){
return(redirectToView=(<Redirect to= '/startPage' />))
        }
        console.log("section List n render: ", this.props.sectionList)
        let sidebar = (
            <div class="sidenav">
                <h2 class="title nav-header">Menu</h2>
                <ul>
                    <li ><a onClick={() => this.myFunction7("deleteItem")}>View/Update/Del</a></li>
                    <li ><a onClick={() => this.myFunction7("addItem")}>Add Item</a></li>
                </ul>
            </div>
        );

        let list = this.props.sectionList.map(section => {
            return (
                <option value={section.sectionId}>{section.sectionName}</option>
            )
        });


        let addItem = (
            <div class="container top-margin main " >
                <p><h3>Add Item</h3></p>
                <br />
                <form onSubmit={(e) => this.props.onSubmit(e, this.createData())}>
                    <div class="form-group">
                        <input type="file" ></input>
                        <h4>Section</h4>
                        <select name="sectionlist" id="sectionlist" >
                            {list}
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
                <form onSubmit={(e) => this.props.onSubmit(e, this.createData())}>
                    <div class="form-group">
                        <input type="file" ></input>
                        <h4>Section</h4>
                        <select name="sectionlist" id="sectionlist" >
                            {list}
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

        let table = new Map();
        let header = this.props.sectionList.map(heading => {
            table.set(heading.sectionId, heading.sectionName);
        }
        );
        console.log(this.props.itemList)
        let newMap = new Map();
        for (let element of table) {
            let id = element[0];
            let value = element[1];
            console.log("element: ", id, value)
            for (let item of this.props.itemList) {
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

        let details = this.props.sectionList.map(section => {
            console.log('table map',table);
            for (let entity of newMap) {
                sectionHead[count] = <thead>{entity[0]}</thead>;
                sectionBody[count] = entity[1].map(item => {
                    console.log("item::::::", item)
                    return (

                        <tr>
                            <a onClick={this.onData.bind(this, item[0])}><td>{item[0]}</td></a>
                            <td>{(item[1])}</td>
                            <td><button value={item[0]} class="btn btn-primary" onClick={(e) => this.props.deleteItem(e, this.onDeleteItem(item[0]))}>Delete</button></td>
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
                    <h2>Breakfast</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                    </tr>
                </thead>
                <tbody>
                    {sectionBody[0]}
                </tbody>
                <thead>
                    <h2>Lunch</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                    </tr>
                </thead>
                <tbody>
                    {sectionBody[1]}
                </tbody>
                <thead>
                    <h2>Dinner</h2>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                    </tr>
                </thead>
                <tbody>
                    {sectionBody[2]}
                </tbody>
            </table>
        );
        let menuView = (
            <div class="container top-margin main " >
                <p><h3>View/Delete Section</h3></p>
                <h5>Click on Item to Update</h5>
                <br />
                <form >
                    <div class="form-group">
                        {display}
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
        itemList: store.posts.itemList
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
        onCookie: () => {
            console.log("mapDispatchToProps data:  ")
            // dispatch(getSectionPosts(localStorage.getItem('owner').restaurantId));

            if(localStorage.getItem('owner')){
            dispatch(getItemPosts(JSON.parse( localStorage.getItem('owner')).restaurantId))
            }
        },
        deleteItem: (e, data) => {
            //e.preventDefault();
            console.log("inside delete item ");
            dispatch(deleteItemPosts(data))
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItem)