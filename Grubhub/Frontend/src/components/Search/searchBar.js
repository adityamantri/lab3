import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './Login.css';
import { connect } from 'react-redux';
import { searchItemRestaurantPosts } from '../../actions/searchActions';
//Define a Login Component

let flag = false, redirectToRest = null;
class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterValue :null,
            itemName:null
        }
        this.onChangee = this.onChangee.bind(this);
        this.valueChangedHandler= this.valueChangedHandler.bind(this);

    }

    valueChangedHandler(e){
        const {name,value} = e.target;
        this.setState({
            [name]:value
        });
        console.log("value set............",this.state.itemName)
      }

    onChangee(e){
        this.setState({
            filterValue : e.target.value
        })
    }
    searchData = () => {
        return {
            itemName: this.state.itemName,
            error: this.props.error
        }
    }

    selectData = (restaurantid, restaurantName) => {
        console.log("inside SelectData()");
        flag = true;
        redirectToRest = (
            <Redirect to={{
                pathname: '/restaurant',
                state: { restId: restaurantid, restName: restaurantName }
            }} />

        )
        this.setState({});
    }

    render() {
        //console.log("FGUJVHBKNLJHCFVJBKN", this.props.restaurantList)
        if (flag) {
            flag = false;
        } else {
            redirectToRest = null;
        }
        let details = null;
        if (this.props.restaurantList.length > 0 && typeof (this.props.restaurantList) !== 'undefined' && this.props.restaurantList !== null) {
             let restaurantList=this.props.restaurantList;
             console.log("outside filter",restaurantList)
            //  console.log("this.props.cuisine ", this.props.cuisine)
            if (this.state.filterValue) {
                console.log("inside Filter",restaurantList)
                restaurantList = restaurantList.filter(restaurant => restaurant.cuisine == this.state.filterValue)
                console.log("After Filter", restaurantList)
            }


            details = restaurantList.map(item => {

                return (

                    <tr>
                        <td><h4>{item.restaurantName}</h4></td>
                        <td>{item.cuisine}</td>
                        <td><button value={item.restaurantId} class="btn btn-primary"
                            onClick={(e) => this.selectData(item.restaurantId, item.restaurantName)}>Select</button></td>
                    </tr>
                )
            });
        }

        let display = (
            <div class="container">
                <div style={{ textAlign: "center" }}><h1>Restaurant List</h1></div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Restaurant Name</th>
                            <th>Cuisine</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details}
                    </tbody>
                </table>
            </div>);

        //redirect based on successful login
        let redirectVar = null;
        console.log("  inside render------", this.createData)
        if (localStorage.getItem('buyer')) {
            //redirectVar = <Redirect to="/buyerProfile" />
        }
        return (
            <div>

                <div class="container">

                    <div class="login-form">
                        <div class="main-div">
                            <form onSubmit={(e) => this.props.onSubmit(e, this.searchData())}>

                                <div class="panel">
                                    <h4>{this.props.error}</h4>
                                    <h2>Welcome to Grubhub</h2>
                                </div>

                                <div class="form-group">
                                    <h4>Search</h4>
                                    <input type="text" placeholder="search for food" onChange={this.valueChangedHandler} value={this.state.search} class="form-control " name="itemName" required />
                                </div>
                                <br />
                                <div class="form-group">
                                    <h5>Filter Cuisine</h5>
                                    <input type="text" placeholder="Filter by Cuisine" onChange={this.onChangee} value = {this.state.filterValue} class="form-control " name="cuisine" />
                                </div>
                                <button type="submit" class="btn btn-danger btn-lg btn-block" ><strong>Find</strong></button>
                                <br />
                                {redirectToRest}
                            </form>
                        </div>
                    </div>
                </div>
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
        cuisine: store.posts.cuisine,
        error: store.posts.error
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
        onFilter: (e, data) => {
            e.preventDefault();
            console.log("mapDispatchToProps data:  ", data)
            {/* dispatch(filterItemRestaurantPosts(data)) */ }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)