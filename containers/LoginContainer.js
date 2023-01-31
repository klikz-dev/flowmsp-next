import React from 'react';
import { Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import * as sessionAPI from '../api/SessionAPI';
import * as customerAPI from '../api/CustomerAPI';
import LoginComponent from '../components/login/LoginComponent';
import Modal from '../components/common/ModalComponent';
import FlowMSPAccountForm from '../components/form/FlowMSPAccountFormComponent';
import ForgotPasswordForm from '../components/form/ForgotPasswordForm';


class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modal: { heading: null, body: null }
    };
    this.handleFlowMSPAccountFormSubmit = this.handleFlowMSPAccountFormSubmit.bind(this);
    this.handleFlowMSPAccountCreationSuccess = this.handleFlowMSPAccountCreationSuccess.bind(this);
    this.handleFlowMSPAccountCreationFailure = this.handleFlowMSPAccountCreationFailure.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.showCreateFlowMSPAccountModal = this.showCreateFlowMSPAccountModal.bind(this);
  }

  handleFlowMSPAccountFormSubmit(form) {
    const newState = Object.assign({}, this.state);
    newState.modal.body = <FlowMSPAccountForm handleFormSubmit={this.handleFlowMSPAccountFormSubmit} isFormSubmitting />;
    this.setState(newState);
    const formData = {
      customerName: form.customerName,
      address: {
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        state: form.state,
        zip: form.zip
      },
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    };
    this.props.createCustomer(formData, this.handleFlowMSPAccountCreationSuccess, this.handleFlowMSPAccountCreationFailure);
  }

  handleFlowMSPAccountCreationSuccess() {
    this.setState({
      modal: {
        heading: 'Create Your FlowMSP Account',
        body: (
          <div>
            <div>Account creation is success! Your username will be your email address, which you will be able to change later.</div>
            <div className="text-align-right margin-top-10px">
              <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
            </div>
          </div>
        )
      }
    });
  }

  handleFlowMSPAccountCreationFailure(errorMessage) {
    const newState = Object.assign({}, this.state);
    newState.modal.body = <FlowMSPAccountForm handleFormSubmit={this.handleFlowMSPAccountFormSubmit} errorMessage={errorMessage} />;
    this.setState(newState);
  }

  loginUser(credentials) {
    this.props.loginUser(credentials, this.loginSuccessCallback, this.loginErrorCallback);
  }

  loginSuccessCallback = (email, userId) => { 
    this.loginComponent.setIsLoggingIn(false);
  };

  loginErrorCallback = () => {
    this.loginComponent.setIsLoggingIn(false);
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  showCreateFlowMSPAccountModal() {
    this.setState({
      modal: {
        heading: 'Create your FlowMSP account',
        body: <FlowMSPAccountForm handleFormSubmit={this.handleFlowMSPAccountFormSubmit} />
      }
    });
    this.toggleModal();
  }
  
  //Forgot Password
  handleForgotPassword = () => {
	    this.setState({
	        modal: {
	          heading: 'Forgot Password',
	          body: <ForgotPasswordForm handleFormSubmit={this.handleForgotPasswordFormSubmit} />
	        }
	      });
	      this.toggleModal();
  }
  
  handleForgotPasswordFormSubmit = (form) => {
	  this.setState({
	        modal: {
	          heading: 'Forgot Password',
	          body: 'Requesting ...'
	        }
	  });
	  sessionAPI.forgotPasswordResetRequest(form, this.showMessage);
  }
  
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
  
  render() {
    const loginComponentProps = {
      loginUser: this.loginUser,
      handleCreateAccountClick: this.showCreateFlowMSPAccountModal,
      errorMessage: this.props.errorMessage,
      handleForgotPassword: this.handleForgotPassword,
      ref: instance => {
        this.loginComponent = instance;
      }
    };
    return (
      <div>
        <LoginComponent {...loginComponentProps} />
        <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal} />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
	  return {
	     errorMessage: store.session.errorMessage
	  };
};

function mapDispatchToProps(dispatch) {
  return {
    loginUser: (credentials, successCallback, errorCallback) => sessionAPI.loginUser(dispatch, credentials, successCallback, errorCallback),
    createCustomer: (form, successCallback, errorCallback) => customerAPI.createCustomer(form, successCallback, errorCallback)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
