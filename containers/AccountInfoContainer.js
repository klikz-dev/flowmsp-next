import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import AccountInfoComponent from '../components/AccountInfo/AccountInfoComponent';
import Modal from '../components/common/ModalComponent';
import EditAccountFormComponent from '../components/form/EditAccountFormComponent';
import EditUserComponent from '../components/form/EditUserComponent';
import AddUserFormComponent from '../components/form/AddUserFormComponent';
import AddUserMainFormComponent from '../components/form/AddUserMainFormComponent';
import * as customerAPI from '../api/CustomerAPI';
import * as userAPI from '../api/UserAPI';
import * as sessionAPI from '../api/SessionAPI';
import auth from '../auth/Authenticator';
import { Redirect } from 'react-router';
import accountinfo from '../styles/accountinfo.scss';

class AccountInfoContainer extends React.Component {

	constructor(props) {
	    super();
	    this.state = {
	    	showModal: false,
	    	modal: { heading: null, body: null },
	    	redirectToHome: false,
	    };
	    this.toggleModal = this.toggleModal.bind(this);
	    this.handleFormSubmit = this.handleFormSubmit.bind(this);
	    this.handleAddUserFormSubmit = this.handleAddUserFormSubmit.bind(this);
		this.handleAddUserMainFormSubmit = this.handleAddUserMainFormSubmit.bind(this);
	    this.showEditModal = this.showEditModal.bind(this);
	    this.showAddUserModal = this.showAddUserModal.bind(this);
	    this.showSuccessModel = this.showSuccessModel.bind(this);
	    this.showError = this.showError.bind(this);
	    this.showAddUserError = this.showAddUserError.bind(this);
	    this.handleUpdateGeoLocation = this.handleUpdateGeoLocation.bind(this);
	}
	       
    componentWillReceiveProps(nextProps) {
       if (nextProps.customer && nextProps.customer.links && (nextProps.customer !== this.props.customer)) {
           this.userHasPermission(nextProps.customer);
       }
    } 
    
    userHasPermission = (customer) => {
        if(customer && customer.links) {
        	  const links = customer.links;
	      for(let i = 0; i < links.length; i++) {
        		const link = customer.links[i];
        		if(link && link.rel === 'customerUpdate') {
        			return true;
        		}
	       }
         }
         return this.setState({ redirectToHome: true });
    }
    		     
	toggleModal() {
		  this.setState({ showModal: !this.state.showModal });
	}
	 
	 handleFormSubmit(form) {
		    const newState = Object.assign({}, this.state);
		    newState.modal.body = <EditAccountFormComponent handleFormSubmit={this.handleFormSubmit} isFormSubmitting />;
		    this.setState(newState);
		    const data = [];
		    for (const key in form) {
		    	   if (form.hasOwnProperty(key)) {
		    	      const obj = {};
		    	      obj.op = 'replace';
		    	      obj.path = (key === 'name' || key === 'timeZone') ? `/${  key}` : `/address/${  key}`;		    	      
		    	      if (typeof form[key] !== 'undefined') {
		    	    	  obj.value	= form[key];
		    	      } else {
		    	    	  obj.value	= null;
		    	      }
		    	      data.push(obj);
		    	   }
		    }
		    this.props.editCustomer(data, this.showSuccessModel, this.showError);
     }
	 
	  handleUpdateGeoLocation() {
		  this.props.updateCustomerLatlon(this.showSuccessModel, this.showError);
	  }
	  
	 handleAddUserFormSubmit(form) {
		    const newState = Object.assign({}, this.state);
		 	newState.modal.body = <AddUserFormComponent handleFormSubmit={this.handleAddUserFormSubmit} isFormSubmitting />;
		    this.setState(newState);
		    const data = {};
		    data.email = form.email;
		    data.firstName = form.firstName;
		    data.lastName = form.lastName;
		    data.password = form.password;
		    data.role = form.role;
		    this.props.addCustomerUser(data, this.showSuccessModel, this.showAddUserError);
	 }

	handleAddUserMainFormSubmit(form) {
		const newState = Object.assign({}, this.state);
		newState.modal.body = <AddUserMainFormComponent handleFormSubmit={this.handleAddUserMainFormSubmit} isFormSubmitting />;
		this.setState(newState);
		const data = {};
		data.email = form.email;
		data.role = form.role;
		this.props.addCustomerUserMain(data, this.showSuccessModel, this.showAddUserError);
	}

	hanleDeleteUser = (user) => {
	  this.showUserDeleteConfirmationModel(user);
    };
    
    	hanleEditUser = (user) => {
    	  this.showEditUserModel(user);
    };
    
    handleEditUserFormSubmit = (form) => {
       this.editUser(form);
    }
    
    editUser = (form) => {
       this.setState({
		      modal: {
		        heading: 'Edit User',
		        body: <EditUserComponent user={form} handleFormSubmit={this.handleEditUserFormSubmit} isFormSubmitting/>
		      }
	   });
   	   
	   this.props.editCustomerUser(form, this.showSuccessModel, this.showEditUserError );
    }
    
    showEditUserModel = (user) => {
   	   this.setState({
	      modal: {
	        heading: 'Edit User',
	        body: <EditUserComponent user={user} handleFormSubmit={this.handleEditUserFormSubmit} />
	      }
	    });
	    this.toggleModal();   
    }
    
    	hanleResetPassword = (user) => {
	   this.setState({
	        modal: {
	          heading: 'Reset Password',
	          body: 'Requesting ...'
	        }
	   });
	   this.toggleModal(); 
	   const data = {
	      email: user.email
	   };
	   sessionAPI.forgotPasswordResetRequest(data, this.showMessage);
    };
    
    showMessage = (obj) => {
	  this.setState({
	        modal: {
	          heading: obj.status,
	          body: (
	  		        <div>
			          <div>{obj.message}</div>
			          <div className="text-align-right margin-top-10px">
			            <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
			          </div>
			        </div>
			    )
	        }
	  });  
	
    }
    
    deleteUser = (userId) => {
       if(userId !== this.props.loggedInUser.id) {
           this.props.deleteCustomerUser(userId, this.showSuccessModel, this.showErrorModel);
	       this.setState({
			      modal: {
			        heading: 'Delete User',
			        body: (
			          <div>
			            <div>Deleting...</div>
			          </div>
			        )
			      }
			 });
        }else{
            this.showErrorModel('Can\'t delete this user because current session belongs to this user');
        }
    }
    
    	showEditUserError = (user, errorMessage) => {
	   const newState = Object.assign({}, this.state);
	   newState.modal.body = <EditUserComponent user={user} handleFormSubmit={this.handleEditUserFormSubmit} errorMessage={errorMessage} />;
	   this.setState(newState);
	}
    
    showUserDeleteConfirmationModel(user) {
    		 this.setState({
		      modal: {
		        heading: 'Delete User',
		        body: (
		          <div>
		            <div>Are you sure you want to delete user {user.email} ?</div>
		            <div className="text-align-right margin-top-10px">
		              <Button type="button" className="margin-right-10px" onClick={this.toggleModal}>No</Button>
		              <Button type="button" bsStyle="primary" onClick={() => {this.deleteUser(user.id);}}>Yes</Button>
		            </div>
		          </div>
		        )
		      }
		 });
		 this.toggleModal();
    }

	showSuccessModel(msg) {
	        //this.props.getCustomersUser();
		    this.setState({
		      modal: {
		        heading: 'Success',
		        body: (
		          <div>
		            <div>{msg}</div>
		            <div className="text-align-right margin-top-10px">
		              <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
		            </div>
		          </div>
		        )
		      }
		    });
	  }
	  
	  showErrorModel(msg) {
		    this.setState({
		      modal: {
		        heading: 'Error',
		        body: (
		          <div>
		            <div>{msg}</div>
		            <div className="text-align-right margin-top-10px">
		              <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
		            </div>
		          </div>
		        )
		      }
		    });
	  }

	  showError(errorMessage) {
	    const newState = Object.assign({}, this.state);
	    newState.modal.body = <EditAccountFormComponent handleFormSubmit={this.handleFormSubmit} errorMessage={errorMessage} />;
	    this.setState(newState);
	  }
	  
	  showAddUserError(errorMessage) {
		    const newState = Object.assign({}, this.state);
		  	newState.modal.body = <AddUserMainFormComponent handleFormSubmit={this.handleAddUserMainFormSubmit} errorMessage={errorMessage} />;
		    this.setState(newState);
	   }

	  showEditModal() {
		  this.setState({
		      modal: {
		        heading: 'Edit your Account',
		        body: <EditAccountFormComponent customer={this.props.customer} handleFormSubmit={this.handleFormSubmit} />
		      }
		    });
		    this.toggleModal();
	  }
	  
	  showAddUserModal() {
		  this.setState({
		      modal: {
		        heading: 'Add New User',
				  body: <AddUserMainFormComponent customer={this.props.customer} handleFormSubmit={this.handleAddUserMainFormSubmit} />
		      }
		    });
		    this.toggleModal();
	  }
	  
	render() {
	
      	 if (this.state.	redirectToHome) {
    	       return <Redirect to="/" />;
    	     }
    	     
		  return (
		     <div>
		        <AccountInfoComponent customer={this.props.customer} users={this.props.users}  showEditModal={this.showEditModal} showAddUserModal={this.showAddUserModal} deleteUser={this.hanleDeleteUser} editUser={this.hanleEditUser} resetPassword={this.hanleResetPassword} updateGeoLocation={this.handleUpdateGeoLocation}/>
		        <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal} />	        
 		     </div>
		  );
	}
}

function mapStateToProps(store) {
	return {
		customer: store.customer,
		users: store.customerUsers,
		loggedInUser: store.user
	};
}

function mapDispatchToProps(dispatch) {
  return {
    editCustomer: (form, successCallback, errorCallback) => customerAPI.editCustomer(form, successCallback, errorCallback, dispatch),
    editCustomerUser: (form, successCallback, errorCallback) => customerAPI.editCustomerUser(form, successCallback, errorCallback, dispatch),
    getLoggedInUser: () => userAPI.getUser(dispatch),
    addCustomerUser: (data, successCallback, errorCallback) => customerAPI.addCustomerUser(data, successCallback, errorCallback, dispatch),
	  addCustomerUserMain: (data, successCallback, errorCallback) => customerAPI.addCustomerUserMain(data, successCallback, errorCallback, dispatch),
	  getCustomersUser: () => customerAPI.getCustomersUser(dispatch),
    deleteCustomerUser: (data, successCallback, errorCallback) => customerAPI.deleteUser(data, successCallback, errorCallback, dispatch),
    updateCustomerLatlon: (successCallback, errorCallback) => customerAPI.updateCustomerLatlon(successCallback, errorCallback, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfoContainer);
