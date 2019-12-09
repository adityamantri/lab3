import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import './BuyerProfile.css'
import { addSectionPosts, deleteSectionPosts, getSectionPosts, updateSectionPosts } from '../../actions/sectionActions';
import { connect } from 'react-redux';
//Define a Login Component
let ownerId = null;
class Section extends Component {

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
        if (localStorage.getItem('owner')) {
            ownerId = JSON.parse( localStorage.getItem('owner')).restaurantId;
            this.props.onCookie();
            console.log("component will mount section.js ");
        }
    }

    createData = () => {
        return {
            sectionName: this.props.sectionName,
            sectionDescription: this.props.sectionDescription,
            restaurantId: ownerId,
            sectionId: this.props.sectionId
        }
    }

    updateData = () => {
        console.log("inside updateData()");
        var a = document.getElementById("sectionlist");
        a = (a.options[a.selectedIndex].value);
        return {
            sectionName: this.props.sectionName,
            sectionDescription: this.props.sectionDescription,
            restaurantId: JSON.parse( localStorage.getItem('owner')).restaurantId,
            sectionId: a
        }
    }
    render() {

        console.log("section List in render: ", this.props.sectionList)
        let sidebar = (
            <div class="sidenav">
                <h2 class="title nav-header">Manage Section</h2>
                <ul>
                    <li ><a onClick={() => this.myFunction7("deleteSection")}>View/Delete</a></li>
                    <li ><a onClick={() => this.myFunction7("addSection")}>Add Section</a></li>
                    <li ><a onClick={() => this.myFunction7("updateSection")}>Update</a></li>
                </ul>
            </div>
        );

        let addSection = (
            <div class="container top-margin main " >
                <p><h3>Add Section</h3></p>
                <br />
                <form onSubmit={(e) => this.props.onSubmit(e, this.createData())}>
                    <div class="form-group">
                        <h4>Section Name</h4>
                        {/* <select 
                            onChange={this.props.onChange} name="sectionName" id="sectionName">
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select> */}
                        <input type="text" onChange={this.props.onChange} class="form-control" name="sectionName" placeholder={this.props.sectionName} required />
                        <h4>Description</h4>
                        <textarea type="text" onChange={this.props.onChange} class="form-control" name="sectionDescription" placeholder={this.props.sectionDescription} required />
                    </div>
                    <br />
                    <button type="submit" onClick={() => this.myFunction7("addSection")} class="btn btn-primary " ><strong>Add</strong></button>
                    <button type="button" onClick={() => this.myFunction7("addSection")} class="btn btn-default " value="cancel" ><strong>Cancel</strong></button>
                </form>
                <br />
            </div>
        );

        let details = this.props.sectionList.map(section => {
            return (
                <tr>
                    <a href="/addItem"> <td>{section.sectionName}</td></a>
                    <td>{section.sectionDescription}</td>
                    <td><button value={section.sectionId} class="btn btn-primary" onClick={this.props.deleteSection}>Delete</button></td>
                </tr>
            )
        });

        let list = this.props.sectionList.map(section => {
            return (
                <option value={section.sectionId}>{section.sectionName}</option>
            )
        });

        let display = (<table class="table">
            <thead>
                <tr>
                    <th>Section Name</th>
                    <th>Section Description</th>
                    <th>Delete Section</th>
                </tr>
            </thead>
            <tbody>
                {/*Display the Tbale row based on data recieved*/}
                {details}
            </tbody>
        </table>);
        let deleteSection = (
            <div class="container top-margin main " >
                <p><h3>View/Delete Section</h3></p>
                <br />
                <form >
                    <div class="form-group">
                        {display}
                    </div>
                </form>
            </div>
        );

        let updateSection = (
            <div class="container top-margin main " >
                <p><h3>Update Section</h3></p>
                <br />
                <form >
                    <div class="form-group">
                        {/* onClick="showfield(this.options[this.selectedIndex].value)" */}
                        <h4>Select Section you want to Update</h4>
                        <select name="sectionlist" id="sectionlist" >
                            {list}

                        </select>
                        <div class="form-group">
                            <h4>Updated Section Name</h4>
                            <input type="text" onChange={this.props.onChange} class="form-control" name="sectionName" placeholder={this.props.sectionName} required />
                            <h4>Updated Description</h4>
                            <textarea type="text" onChange={this.props.onChange} class="form-control" name="sectionDescription" placeholder={this.props.sectionDescription} required />
                        </div>
                    </div>
                    <br />
                    <button type="submit" onClick={(e) => {this.props.updateSection(e, this.updateData()); this.myFunction7("updateSection");}} class="btn btn-primary " ><strong>Update</strong></button>
                    <button type="button" onClick={() => this.myFunction7("updateSection")} class="btn btn-default " value="cancel" ><strong>Cancel</strong></button>
                </form>
                <br />
            </div>
        );

        console.log("create data function:   ", this.createData());

        return (
            <div>
                {sidebar}
                <div id="addSection" style={{ "display": "none" }}> {addSection} </div >
                <div id="deleteSection" style={{ "display": "block" }}> {deleteSection} </div >
                <div id="updateSection" style={{ "display": "none" }}> {updateSection} </div >
            </div >

        )
    }
}
const mapStateToProps = (store) => {
    console.log('storte vaslur', store);
    return {
        sectionList: store.posts.sectionList,
        sectionName: store.posts.sectionName,
        sectionDescription: store.posts.sectionDescription,
        restId: store.posts.restId,
        sectionId: store.posts.sectionId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (e) => dispatch({ type: 'CHANGE', value: e }),
        onSelect: (e) => dispatch({ type: 'CHANGE', value: e.target.value }),
        onSubmit: (e, data) => {
            e.preventDefault();
            console.log("mapDispatchToProps data:  ", data)
            dispatch(addSectionPosts(data));
        },
        onCookie: () => {
            console.log("mapDispatchToProps data:  ")
            dispatch(getSectionPosts(JSON.parse( localStorage.getItem('owner')).restaurantId));
        },
        deleteSection: (e) => {
            e.preventDefault();
            console.log("delete button", e.target.value)
            dispatch(deleteSectionPosts(e.target.value));
        },

        updateSection: (e, data) => {
            e.preventDefault();
            dispatch(updateSectionPosts(data));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Section)