import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './Login.css';
import { connect } from 'react-redux';
import { buyerLoginPosts } from '../../actions/postActions';
import { gql } from 'apollo-boost';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo';
const loginQuery = gql`
    mutation buyerLogin($email: String!, $password: String!) 
    {
    buyerLogin(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      phone
      password
    }
    }`
//Define a Login Component
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: null,
            password: null
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
    //         email: this.state.email,
    //         password: this.state.password,
    //         error:this.props.error
    //     }
    // }
    async submitForm(e) {
        e.preventDefault();
        let { data } = await this.props.loginQuery({
            variables: {
                email: this.state.email,
                password: this.state.password,
            }
        })
        console.log("data after submit ", data)
        if (data == null || data == undefined || data.buyerLogin.email == null || data == "Invalid Request") {
            alert('Invalid Credentials');
        } else {
            data.buyerLogin._id=data.buyerLogin.id;
            data.buyerLogin.buyerId=data.buyerLogin.id;
            localStorage.setItem('buyer', JSON.stringify(data.buyerLogin))
            // console.log("data after submit ",data)
            this.setState({})
        }
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        console.log("  inside render------", this.createData)
        if (localStorage.getItem('buyer')) {
            redirectVar = <Redirect to="/searchBar" />
        }
        return (
            <div>
                {redirectVar}
                <div class="container">

                    <div class="login-form">
                        <div class="main-div">
                            <form onSubmit={this.submitForm.bind(this)}>

                                <div class="panel">
                                    <h4>{this.props.error}</h4>
                                    <h2>Sign in with your Grubhub account</h2>
                                </div>

                                <div class="form-group">
                                    <p>Email</p>
                                    <input type="email" onChange={this.valueChangedHandler} class="form-control" name="email" required />
                                </div>

                                <div class="form-group">
                                    <p>Password</p>
                                    <input type="password" onChange={this.valueChangedHandler} class="form-control" name="password" required />
                                </div>

                                <button type="submit" class="btn btn-danger btn-lg btn-block" ><strong>Sign in</strong></button>
                                <br />
                            </form>
                            <a class="createRoute" href="/buyerSignUp">Create your account</a>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
// const mapStateToProps = (store) => {
//     console.log('store value', store);
//     return {
//         email: store.posts.email,
//         password: store.posts.password,
//         error: store.posts.error
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         // onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
//         onSubmit: (e,data) => {
//             e.preventDefault();
//             console.log("mapDispatchToProps data:  ", data)
//             dispatch(buyerLoginPosts(data));
//         }
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Login)
export default compose(
    graphql(loginQuery, { name: "loginQuery" })
)(Login);