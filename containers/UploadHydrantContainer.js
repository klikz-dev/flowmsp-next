import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Button, ProgressBar, Grid, Row, FormGroup, FormControl, Col, ControlLabel, Form} from 'react-bootstrap';
import Modal from '../components/common/ModalComponent';
import * as hydrantAPI from '../api/HydrantAPI';

class UploadHydrantContainer extends React.Component {

    constructor(props) {
        super();
        this.toggleModal = this.toggleModal.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showLoadingModel = this.showLoadingModel.bind(this);
        this.showSuccessMessage = this.showSuccessMessage.bind(this);
        this.ShowErrorMessage = this.ShowErrorMessage.bind(this);
        this.state = {
          showModal: false,
        	  modal: { heading: null, body: null },
        	  redirectToHome: false,
        	  uploadSuccess: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && nextProps.user.role && (nextProps.user !== this.props.user)) {
            this.userHasPermission(nextProps.user);
        }
    } 
    
    userHasPermission = (user) => {
        if(user && (user.role === 'ADMIN' || user.role === 'PLANNER')) {
       	    return true;
        }
        return this.setState({ redirectToHome: true });
    }
    
    toggleModal() {
	    this.setState({ showModal: !this.state.showModal });
	    if(this.state.uploadSuccess) {
	    		this.setState({ redirectToHome: true });
	    }
    }
    
    handleFileUpload(file) {
			// TODO: Do the next action
    }
   
    showLoadingModel() {
        const newState = Object.assign({}, this.state);
        newState.modal.heading = 'Uploading';
        newState.modal.body = (
          <div>
            <span>Uploading hydrant data</span>
            <ProgressBar active now={100} />
          </div>
        );
        this.setState(newState);
        this.toggleModal();
    }

    ShowErrorMessage(message) {
        const newState = Object.assign({}, this.state);
        newState.modal.body = (
          <div>
	          <div>
	            <span>Oops! Something went wrong.</span>
	          </div>
	          <div className="text-align-right margin-top-10px">
	            <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
	          </div>
          </div>
        );
        this.setState(newState);
    }

    showSuccessMessage(message) {
    	if (message) {
    		const newState = Object.assign({}, this.state);
	      newState.modal.body = (
	        <div>
	          <div>{message}</div>
	          <div className="text-align-right margin-top-10px">
	            <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
	          </div>
	        </div>
	      );
	      newState.uploadSuccess = true;
	      this.setState(newState);
	    } else {
	      this.toggleModal();
	    }
    }

    onSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        const file = document.querySelector('#file');
        if(file.files[0]) {
            formData.append('file', file.files[0]);
            this.showLoadingModel();
            hydrantAPI.uploadHydrant(formData, this.showSuccessMessage, this.ShowErrorMessage);
        }else{
          	this.showSuccessMessage('ShowErrorMessage');
        }
    }

    render() {
    	
      	 if (this.state.	redirectToHome) {
    	       return <Redirect to="/" />;
    	     }
      	 
		 return (
			   <div>
				   <Grid>
				     <Row className="show-grid">
				       <h3>
				          Upload Hydrant
				       </h3>
				       <hr />
				    </Row>
		    		<Form horizontal onSubmit={this.onSubmit}>
		    		    <FormGroup>
		    		      <Col smOffset={1} sm={10}>
		    		        <FormControl type="file" name="file" value={this.state.file} id="file" accept=".csv,text/csv" />
		    		      </Col>
		    		    </FormGroup>
	    		        <FormGroup>
	    		          <Col smOffset={1} sm={10}>
	    		            <Button type="submit" bsStyle="primary">
	    		              Upload
	    		            </Button>
	    		          </Col>
	    		        </FormGroup>
	    		    </Form>
				  </Grid>
				   <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal} />
			   </div>
		   );
    }
}

const mapStateToProps = function(store) {
    return {
      	user: store.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
    	   
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadHydrantContainer);
