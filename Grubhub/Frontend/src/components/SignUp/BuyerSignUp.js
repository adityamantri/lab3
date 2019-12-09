import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import './BuyerSignUp.css';
import { connect } from 'react-redux';
import { buyerSignUpPosts } from '../../actions/postActions';
import { gql } from 'apollo-boost';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo';
const signUpQuery = gql`
mutation addBuyer($email: String!, $password: String!, $firstName: String!, $lastName: String) 
    {
    addBuyer(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
      email
      phone
      password
    }
    }
`

class BuyerSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
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
    //         firstName: this.props.firstName,
    //         lastName: this.props.lastName,
    //         password: this.props.password,
    //         email: this.props.email,
    //         error: this.props.error
    //     }
    // }
    async submitForm(e) {
        e.preventDefault();
        let { data } = await this.props.signUpQuery({
            variables: {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
            }
        })
        console.log("data after submit ", data)
        if (data == null || data == undefined || data.addBuyer.email == null || data == "Invalid Request") {
            alert('Invalid Credentials');
        } else {
            data.addBuyer._id=data.addBuyer.id;
            data.addBuyer.buyerId=data.addBuyer.id;
            localStorage.setItem('buyer', JSON.stringify(data.addBuyer))
            // console.log("data after submit ",data)
            this.setState({})
        }
    }
    render() {
        //redirect based on successful login
        let redirectVar = null;
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
                                {/* <h3>{this.props.error}</h3> */}
                                <div class="panel">
                                    <h2>Create your account</h2>
                                </div>

                                <div class="common">
                                    <div class="form-group1">
                                        <p>First Name</p>
                                        <input type="text" class="form-control" name="firstName" onChange={this.valueChangedHandler} required /></div>
                                    <div class="form-group1">
                                        <p>Last Name</p>
                                        <input type="text" class="form-control" name="lastName" onChange={this.valueChangedHandler} required />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <p>Email</p>
                                    <input type="email" class="form-control" name="email" onChange={this.valueChangedHandler} required />
                                </div>

                                <div class="form-group">
                                    <p>Password</p>
                                    <input type="password" class="form-control" name="password" onChange={this.valueChangedHandler} required />
                                </div>

                                <button type="submit" class="btn btn-primary btn-lg btn-block" ><strong>Create your account</strong></button>
                                <br />
                            </form>
                            <div class="center">
                                <span>Have an account? </span><a href="/login">Sign in</a>
                            </div>
                            <br />
                            <p class="center">By creating your Grubhub account, you agree to the Terms of Use and Privacy Policy.</p>

                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

// const mapStateToProps = (store) => {
//     console.log('storte vaslur', store);
//     return {
//         firstName: store.posts.firstName,
//         lastName: store.posts.lastName,
//         email: store.posts.email,
//         password: store.posts.password,
//         error: store.posts.error
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
//         onSubmit: (e, data) => {
//             e.preventDefault();
//             console.log(data);
//             dispatch(buyerSignUpPosts(data));
//         }
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(BuyerSignUp);

export default compose(
    graphql(signUpQuery, { name: "signUpQuery" })
)(BuyerSignUp);