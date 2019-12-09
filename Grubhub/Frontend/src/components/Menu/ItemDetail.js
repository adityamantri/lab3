import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import './BuyerProfile.css';
import { getItemDetails, updateItemPosts, addItemPosts } from '../../actions/itemActions'
import { connect } from 'react-redux';
import axios from 'axios';
import {URL} from '../../Constant';

export class ItemDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            itemName: ""
        }

    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        if (localStorage.getItem('owner')) {
            let data = {
                restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
                itemName: this.props.location.state.itemName,
                sectionName: this.props.location.state.sectionName
            };
            this.props.onGetItem(data);
            console.log("component will mount section.js ");
        }
    }


    onGetItem = () => {
        return {
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            itemName: this.props.location.state.itemName,
            sectionName: this.props.location.state.sectionName
        }
    }

    updateData = () => {
        return {
            sectionName: this.props.sectionName,
            itemDescription: this.props.itemDescription,
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            sectionId: this.props.sectionId,
            itemName: this.props.itemName,
            itemImage: this.props.itemImage,
            restId: this.props.restId,
            itemId: this.props.itemId,
            itemPrice: this.props.itemPrice
        }
    }

    onChangeHandler = event => {
        event.preventDefault();
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    onClickHandler = (e) => {
        e.preventDefault();
        let data = new FormData()
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        data.append('productImage', this.state.selectedFile);
        console.log("productImage ", this.state.selectedFile)
        console.log("Item ID :", this.props.itemId)
        data.append('itemId', this.props.itemId);
        data.append('sectionName', this.props.location.state.sectionName)
        data.append('restaurantId', JSON.parse( localStorage.getItem('owner')).restaurantId);
        axios.post(URL+"item/upload", data, config, { // receive two parameter endpoint url ,form data 
        })
            .then(res => { // then print response status
                console.log(res.statusText)
            })
    }

    render() {
        console.log("section List n render: ", this.props.sectionList)

        let addItem = (
            <div>
                <div class="container top-margin main viewItem" >
                    <p><h3>View Item</h3></p>
                    <hr></hr>

                    <br />
                    <form onSubmit={(e) => this.props.onSubmit(e, this.createData())}>
                        <div class="form-group">
                            <img alt="Item not uploaded" src={URL+"item/" + this.props.itemImage} style={{ height: "200px", width: "200px", borderRadius: "15%" }}></img>
                            <br></br>
                            <h4>Section</h4>
                            <div>{this.props.location.state.sectionName}</div>
                            <h4>Item Name</h4>
                            <div >{this.props.location.state.itemName}</div>
                            <h4>Item Description</h4>
                            <div >{this.props.itemDescription} </div>
                            <br></br>
                            <h4>Item Price</h4>
                            <div>{this.props.itemPrice}</div>
                        </div>
                        <br />
                        <a href="/addItem"><button type="button" class="btn btn-default " value="cancel" ><strong>Return</strong></button></a>
                    </form>
                    <br />
                </div>

                <div class="container top-margin main updateItem" >
                    <p><h3>Update Item</h3></p>
                    <hr></hr>
                    {/* <iframe name="hiddenFrame" class="hide"></iframe> */}
                    {/* <form action=URL+"item/upload" method="post" enctype="multipart/form-data" target="hiddenFrame"> */}

                    <form onSubmit={this.onClickHandler}>
                        <input type="file" name='productImage' onChange={this.onChangeHandler}></input>
                        {/* <input type="text" name="itemId" value={this.props.itemId} style={{display:"none"}}></input> */}
                        <button type="submit" >Update Image</button>
                    </form>
                    <form onSubmit={(e) => this.props.onSubmit(e, this.createData())}>
                        <div class="form-group">



                            <h4>Section</h4>
                            <div>{this.props.location.state.sectionName}</div>
                            <h4>Item Name</h4>
                            <input type="text" onChange={this.props.onChange} class="form-control" placeholder={this.props.location.state.itemName} name="itemName" required />
                            <h4>Item Description</h4>
                            <textarea type="text" onChange={this.props.onChange} class="form-control" placeholder={this.props.itemDescription} name="itemDescription" required />
                            <h4>Item Price</h4>
                            <input type="text" onChange={this.props.onChange} class="form-control" placeholder={this.props.itemPrice} name="itemPrice" required />
                        </div>
                        <br />
                        <button type="button" onClick={(e) => this.props.onUpdate(e, this.updateData())} class="btn btn-primary " ><strong>Update</strong></button>
                        <a href="/addItem"><button type="button" class="btn btn-default " value="cancel" ><strong>Cancel</strong></button></a>
                    </form>
                    <br />
                </div>
            </div>
        );


        return (
            <div>
                {/* {sidebar} */}
                <div id="addItem" style={{ "display": "block" }}> {addItem} </div >
                <br /><br />
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
        itemImage: store.posts.itemImage,
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
            console.log("mapDispatchToProps data:  ", data);
            dispatch(addItemPosts(data));
        },
        onUpdate: (e, data) => {
            console.log("onUpdate mapdispatchtoprops data:  ", data);
            dispatch(updateItemPosts(data));
            window.location.reload();
        },
        onGetItem: (data) => {
            console.log("Item Details");
            dispatch(getItemDetails(data));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail)