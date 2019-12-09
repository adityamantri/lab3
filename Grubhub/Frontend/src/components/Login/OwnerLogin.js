import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { ownerSignInPosts } from '../../actions/postActions';
import {flowRight as compose} from 'lodash';
import { graphql} from 'react-apollo';

import {gql} from 'apollo-boost';

const loginQuery = gql`
    mutation ownerLogin($owner_email: String!, $owner_password: String!) 
    {
    ownerLogin(owner_email: $owner_email, owner_password: $owner_password) {
      id
      owner_email
      owner_phone
      owner_password
      cuisine
      restaurantName
      zipCode
    }
    }`
//Define a Login Component
class OwnerLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: this.props.error,
            owner_email: null,
            owner_password: null
        }
        this.valueChangedHandler = this.valueChangedHandler.bind(this)
    }
    valueChangedHandler(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
        // console.log("value set............", this.state.itemName)
    }

    // createData = () => {
    //     return {
    //         owner_email: this.state.owner_email,
    //         owner_password: this.state.owner_password,
    //         //error: this.props.ownerError
    //     }
    // }
    async submitForm (e){
        e.preventDefault();
        let {data}=await this.props.loginQuery({
            variables :{
                owner_email: this.state.owner_email,
            owner_password: this.state.owner_password,
            }
         })
         console.log(data);
        if(data==null || data== undefined || data.ownerLogin.owner_email==null || data=="Invalid Request"){
            alert('Invalid Credentials');
        }else{
            data.ownerLogin._id=data.ownerLogin.id;
            data.ownerLogin.restaurantId=data.ownerLogin.id;
        localStorage.setItem('owner',JSON.stringify(data.ownerLogin))
        // console.log("data after submit ",data)
        this.setState({})
        }
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        if (localStorage.getItem('owner')) {
            redirectVar = <Redirect to="/ownerProfile" />
        }
        return (
            <div>
                {redirectVar}
                <div class="container" style={{ "marginTop": "80px", "max-width": "420px", width: "auto" }}>

                    <div class="login-form" >
                        <form onSubmit={ this.submitForm.bind(this)}>
                            <div class="main-div">
                                <div class="panel">
                                    <h3><strong style={{ color: "red" }}>GRUBHUB</strong> FOR RESTAURANTS</h3>
                                    <br />
                                </div>
                                <div class="form-group">
                                    <div>Email</div>
                                    <input onChange={this.valueChangedHandler} type="text" class="form-control" name="owner_email" required />
                                </div>
                                <div class="form-group">
                                    <div>Password</div>
                                    <input onChange={this.valueChangedHandler} type="password" class="form-control" name="owner_password" required />
                                </div>
                                <div style={{ "textAlign": "center" }}>
                                    <button type="submit" class="btn btn-primary btn-lg btn-block">Sign in</button>
                                    <h3>{this.props.error}</h3>
                                    <br />

                                </div>
                            </div>
                        </form>
                        <a href="/ownerSignUp">Create your account</a>
                    </div>
                </div>
            </div>
        )
    }
}
// const mapStateToProps = (store) => {
//     console.log('storte vaslur', store);
//     return {

//         owner_address: store.posts.owner_address,
//         restaurantId: store.posts.restaurantId,
//         owner_email: store.posts.owner_email,
//         owner_firstName: store.posts.owner_firstName,
//         owner_image: store.posts.owner_image,
//         owner_lastName: store.posts.owner_lastName,
//         owner_password: store.posts.owner_password,
//         owner_phone: store.posts.owner_phone,
//         zipCode: store.posts.zipCode,
//         cuisine: store.posts.cusine,
//         restaurantImage: store.posts.restaurantImage,
//         restaurantName: store.posts.restaurantName,
//         error: store.posts.ownerError
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         //onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
//         onSubmit: (e,data) => {
//             e.preventDefault();
//             console.log(data)
//             dispatch(ownerSignInPosts(data));
//         }
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default compose(
    // graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(loginQuery, { name: "loginQuery" })
)(OwnerLogin);