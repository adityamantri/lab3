import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { ownerSignUpPosts } from '../../actions/postActions';
import './BuyerSignUp.css'
import { gql } from 'apollo-boost';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo';
const signUpQuery = gql`
mutation addOwner(
    $owner_firstName: String!,
      $owner_lastName: String!,
      $owner_email: String!,
      $owner_phone: String!,
      $owner_password: String!,
      $cuisine: String,
      $restaurantName: String!,
      $zipCode: String!
  ){
    addOwner(
        owner_firstName: $owner_firstName,
        owner_lastName: $owner_lastName,
        owner_email:  $owner_email,
          owner_phone:  $owner_phone,
          owner_password:  $owner_password,
          cuisine:  $cuisine,
          restaurantName:  $restaurantName,
          zipCode:  $zipCode
      ){
      id
    owner_firstName
      owner_lastName
      owner_email
      owner_phone
      owner_password
      cuisine
      restaurantName
      zipCode
  }
}
`

class OwnerSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            owner_firstName: null,
            owner_lastName: null,
            error: null,
            owner_email: null,
            owner_password: null,
            zipCode:null,
            owner_phone: null,
            restaurantName: null
        }
        this.valueChangedHandler = this.valueChangedHandler.bind(this)
    }
    valueChangedHandler(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // createData = () => {
    //     return {
    //         owner_address: this.props.owner_address,
    //         restaurantId: this.props.buyerId,
    //         owner_email: this.props.owner_email,
    //         owner_firstName: this.props.owner_firstName,
    //         owner_image: this.props.owner_image,
    //         owner_lastName: this.props.owner_lastName,
    //         owner_password: this.props.owner_password,
    //         owner_phone: this.props.owner_phone,
    //         zipCode: this.props.zipCode,
    //         cuisine: this.props.cousine,
    //         restaurantImage: this.props.restaurantImage,
    //         restaurantName: this.props.restaurantName,
    //         error: this.props.error
    //     }
    // }
    async submitForm(e) {
        e.preventDefault();
        let { data } = await this.props.signUpQuery({
            variables: {
                owner_firstName: this.state.owner_firstName,
                owner_lastName: this.state.owner_lastName,
                owner_email: this.state.owner_email,
                owner_password: this.state.owner_password,
                zipCode: this.state.zipCode,
                owner_phone: this.state.owner_phone,
                restaurantName: this.state.restaurantName

            }
        })
        console.log("data after submit ", data)
        if (data == null || data == undefined || data.addOwner.email == null || data == "Invalid Request") {
            // alert('Invalid Credentials');
        } else {
            data.addOwner._id=data.addOwner.id;
            data.addOwner.restaurantId=data.addOwner.id;
            localStorage.setItem('buyer', JSON.stringify(data.addOwner))
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
                <div class="container" style={{ marginTop: "80px" }}>

                    <div class="login-form" >
                        <div class="main-div">
                            <form onSubmit={this.submitForm.bind(this)}>
                                <h3>{this.props.error}</h3>
                                <div class="panel">
                                    <h2>Get more orders</h2>
                                    <h4> Ready to increase your takeout sales and reach new hungry customers? Become a Grubhub partner today!</h4>
                                </div>
                                <div class="common">
                                    <div class="form-group1">
                                        <p>First Name</p>

                                        <input type="text" onChange={this.valueChangedHandler} class="form-control" name="owner_firstName" required /></div>
                                    <div class="form-group1">
                                        <p>Last Name</p>
                                        <input type="text" onChange={this.valueChangedHandler} class="form-control" name="owner_lastName" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <p>Email</p>

                                    <input type="email" onChange={this.valueChangedHandler} class="form-control" name="owner_email" required />
                                </div>
                                <div class="form-group">
                                    <p>Password</p>

                                    <input type="password" onChange={this.valueChangedHandler} class="form-control" name="owner_password" required />
                                </div>
                                <div class="form-group">
                                    <p>Phone</p>

                                    <input type="text" onChange={this.valueChangedHandler} class="form-control" name="owner_phone" required />
                                </div>
                                <div class="form-group">
                                    <p>Restaurant Name</p>

                                    <input type="text" onChange={this.valueChangedHandler} class="form-control" name="restaurantName" required />
                                </div>
                                <div class="form-group">
                                    <p>Restaurant Zip Code</p>

                                    <input type="text" onChange={this.valueChangedHandler} class="form-control" name="zipCode" required />
                                </div>
                            
                            <button type="submit"  class="btn btn-primary btn-lg btn-block" ><strong>Sign up now</strong></button>
                            <br />
                            </form>
                            <div class="center">
                                <span>Have an account? </span><a href="/ownerLogin">Sign in</a>
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

//         owner_address: store.posts.owner_address,
//         restaurantId: store.posts.buyerId,
//         owner_email: store.posts.owner_email,
//         owner_firstName: store.posts.owner_firstName,
//         owner_image: store.posts.owner_image,
//         owner_lastName: store.posts.owner_lastName,
//         owner_password: store.posts.owner_password,
//         owner_phone: store.posts.owner_phone,
//         zipCode: store.posts.zipCode,
//         cuisine: store.posts.cousine,
//         restaurantImage: store.posts.restaurantImage,
//         restaurantName: store.posts.restaurantName,
//         error: store.posts.error
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
//         onSubmit: (e,data) => {
//             e.preventDefault();
//             console.log(data);
//             dispatch(ownerSignUpPosts(data));
//         }
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(OwnerSignUp);
export default compose(
    graphql(signUpQuery, { name: "signUpQuery" })
)(OwnerSignUp);