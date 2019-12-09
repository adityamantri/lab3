import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import './BuyerProfile.css';
import { getItemPosts, addItemPosts } from '../../actions/itemActions'
import { connect } from 'react-redux';
//Define a Login Component
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
        console.log("section List n render: ", this.props.sectionList)
        let sidebar = (
            <div class="sidenav">
                <h2 class="title nav-header">Add Item</h2>
                <ul>
                    <li ><a onClick={() => this.myFunction7("deleteItem")}>View/Delete</a></li>
                    <li ><a onClick={() => this.myFunction7("addItem")}>Add Section</a></li>
                    <li ><a onClick={() => this.myFunction7("updateItem")}>Update</a></li>
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
            console.log("table is :", table)
        }
        );

        let details = this.props.sectionList.map(section => {
            console.log(table);
            return (
                <tr>
                    <td>{section.sectionName}</td>
                    <td>{section.sectionDescription}</td>
                </tr>
            )
        });

        let display = (<table class="table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Item Price</th>
                </tr>
            </thead>
            <tbody>
                {/*Display the Tbale row based on data recieved*/}
                {details}
            </tbody>
        </table>);

        return (
            <div>
                {sidebar}
                <div id="addItem" style={{ "display": "none" }}> {addItem} </div >
                <div id="updateItem" style={{ "display": "none" }}> {updateItem} </div >
                <div id="deleteItem" style={{ "display": "none" }}>  </div >
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
            e.preventDefault();
            console.log("mapDispatchToProps data:  ", data)
            dispatch(addItemPosts(data));
        },
        onCookie: () => {
            console.log("mapDispatchToProps data:  ")
            // dispatch(getSectionPosts(localStorage.getItem('owner').restaurantId));
            dispatch(getItemPosts(JSON.parse( localStorage.getItem('owner')).restaurantId))
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItem)