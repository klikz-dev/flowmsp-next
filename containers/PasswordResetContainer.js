import React from 'react';
import { Button } from 'react-bootstrap';
import PasswordResetComponent from '../components/PasswordReset/PasswordResetComponent';
import Modal from '../components/common/ModalComponent';
import * as sessionAPI from '../api/SessionAPI';
import { Redirect } from 'react-router';

class PasswordResetContainer extends React.Component {
	
  constructor(props) {
	    super();
	    this.state = {
	    		  resetRequestId: '',
	    		  resetRequestComplete: false,
	    		  redirectToLogin: false,
	    	      showModal: false,
	    	      modal: { heading: null, body: null },
	    	      isFormSubmitting: false
	    	};
  }
    
  getTokenValue = (name) => {
	    const url = window.location.href;
	    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	    const results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
	
  resetPassword = (form) => {
	  const resetRequestId = this.getTokenValue('resetRequestId');
	  const data = {
			  email: form.email,
			  newPassword: form.password,
			  resetRequestId: resetRequestId
	  };
	  
      this.setState({isFormSubmitting: true});
	  sessionAPI.forgotPasswordReset(data, this.showMessage);
  }
  
  toggleModal = () => {
	    this.setState({ showModal: !this.state.showModal });
	    if(this.state.resetRequestComplete === true) {
	      	this.setState({redirectToLogin: true});
	    }
  }
  
  showMessage = (obj) => {
	  this.toggleModal();
	  this.setState({
		   isFormSubmitting: false,
		   resetRequestComplete: true,
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
   	    if (this.state.redirectToLogin) {
	       return <Redirect to="/login" />;
	    }
	    return (
	      <div>
	         <PasswordResetComponent resetPassword={this.resetPassword} isFormSubmitting={this.state.isFormSubmitting}/>
	         <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal} />
	      </div>
	    );
  }
}

export default PasswordResetContainer;
