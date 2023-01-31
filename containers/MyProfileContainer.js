import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import MyProfileComponent from '../components/MyProfile/MyProfileComponent';
import Modal from '../components/common/ModalComponent';
import ChangePasswordComponent from '../components/form/ChangePasswordComponent';
import EditMyProfileComponent from '../components/form/EditMyProfileComponent';
import * as UserAPI from '../api/UserAPI';

class MyProfileContainer extends React.Component {

  constructor(props) {
    super();
    this.state = {
    	 showModal: false,
    	 modal: { heading: null, body: null },
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
      this.props.getMyProfile();
  }

  toggleModal() {
	  this.setState({ showModal: !this.state.showModal }); 
  }
  
  editProfileFormSubmit = (form) => {
	    const newState = Object.assign({}, this.state);
	    newState.modal.body = <EditMyProfileComponent handleFormSubmit={this.editProfileFormSubmit} isFormSubmitting />;
	    this.setState(newState);
	    const data = [];
        for (const k in form) {
	        if (form.hasOwnProperty(k)) {
	           const d = {};
	           d.op = 'replace';
	           d.path = `/${  k}`;
	           d.value = form[k];
	           data.push(d);
	        }
        }
	    this.props.editProfile(data, this.showSuccessModel, this.showEditProfileError);
  }
  
  changePasswordFormSubmit = (form) => {
	    const newState = Object.assign({}, this.state);
	    newState.modal.body = <ChangePasswordComponent handleFormSubmit={this.changePasswordFormSubmit} isFormSubmitting />;
	    this.setState(newState);
	    const data = {};
	    data.currentPassword = form.currentPassword;
	    data.newPassword = form.password;
	    this.props.changePassword(data, this.showSuccessModel, this.showChangePasswordError);
  }
  
  showSuccessModel = (msg) => {
        this.props.getMyProfile();
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

  showChangePasswordError = (errorMessage) => {
    const newState = Object.assign({}, this.state);
    newState.modal.body = <ChangePasswordComponent handleFormSubmit={this.changePasswordFormSubmit} errorMessage={errorMessage} />;
    this.setState(newState);
  }
  
  showEditProfileError = (errorMessage) => {
	    const newState = Object.assign({}, this.state);
	    newState.modal.body = <EditMyProfileComponent handleFormSubmit={this.editProfileFormSubmit} errorMessage={errorMessage} />;
	    this.setState(newState);
  }
  
  showEditModal = () => {
	  this.setState({
	      modal: {
	        heading: 'Edit My Profile',
	        body: <EditMyProfileComponent user={this.props.user} handleFormSubmit={this.editProfileFormSubmit} />
	      }
	    });
	    this.toggleModal();	  
  };
  
  showChangePasswordModal = () => {
	  this.setState({
	      modal: {
	        heading: 'Change Password',
	        body: <ChangePasswordComponent user={this.props.user} handleFormSubmit={this.changePasswordFormSubmit} />
	      }
	  });
	  this.toggleModal();	
  };

  render() {
	  return (
	     <div>
	        <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal} />
	        <MyProfileComponent user={this.props.user} showEditModal={this.showEditModal} showChangePasswordModal={this.showChangePasswordModal} />
	     </div>
	  );
  }

}

const mapStateToProps = function(store) {
	return {
		user: store.user
	};
};

const mapDispatchToProps =  function(dispatch) {
	  return {
	    getMyProfile: () => UserAPI.getUser(dispatch),
	    changePassword: (data, successCallback, errorCallback) => UserAPI.changePassword(data, successCallback, errorCallback, dispatch),
	    editProfile: (data, successCallback, errorCallback) => UserAPI.editMyProfile(data, successCallback, errorCallback, dispatch)
	  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileContainer);
