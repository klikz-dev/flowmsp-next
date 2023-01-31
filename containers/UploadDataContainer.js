import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Button, ProgressBar, Grid, Row, FormGroup, FormControl, Col, ControlLabel, Form, Radio} from 'react-bootstrap';
import Modal from '../components/common/ModalComponent';
import * as HydrantAPI from '../api/HydrantAPI';
import * as LocationAPI from '../api/LocationAPI';
import * as UserAPI from '../api/UserAPI';
import ReactToPrint from 'react-to-print';
import ComponentToPrint from '../components/common/PrintFile';

class UploadDataContainer extends React.Component {

    constructor(props) {
        super();
        this.toggleModal = this.toggleModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showLoadingModel = this.showLoadingModel.bind(this);
        this.showSuccessMessage = this.showSuccessMessage.bind(this);
        this.ShowErrorMessage = this.ShowErrorMessage.bind(this);
        this.showUploading = this.showUploading.bind(this);
        this.state = {
        	  showModal: false,
        	  modal: { heading: null, body: null },
        	  redirectToHome: false,
        	  uploadSuccess: false,
        	  data: [],
        	  header: ''
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
    }

    showModal() {
	    this.setState({ showModal: true });
    }

    hideModal() {
	    this.setState({ showModal: false });
    }

    showLoadingModel(message, progress) {
        const newState = Object.assign({}, this.state);
        newState.modal.heading = 'Uploading';
        newState.modal.body = (
          <div>
            <span>{message}</span>
            <ProgressBar active now={progress} />
          </div>
        );
        this.setState(newState);
        this.showModal();
    }

    ShowErrorMessage(message) {
        const newState = Object.assign({}, this.state);
        newState.modal.body = (
          <div>
	          <div>
	            <span>Oops! Something went wrong in UploadDataContainer.</span>
	          </div>
	          <div className="text-align-right margin-top-10px">
	            <Button type="button" bsStyle="primary" onClick={this.hideModal}>OK</Button>
	          </div>
          </div>
        );
        this.setState(newState);
        this.setState({
	    	  data: message.split('\n'),
	    	  header: 'Upload Progress Error'
	    });
    }

    showSuccessMessage(message) {
    	if (message) {
    	  const newState = Object.assign({}, this.state);
	      newState.modal.body = (
	        <div>
	          <div>Upload Process Completed!!</div>
	          <div className="text-align-right margin-top-10px">
	            <Button type="button" bsStyle="primary" onClick={this.hideModal}>OK</Button>
	          </div>
	        </div>
	      );
	      newState.uploadSuccess = true;
	      this.setState(newState);
	      this.setState({
	    	  data: message.split('\n'),
	    	  header: 'Upload Progress Success'
	      });
	    } else {
	      this.hideModal();
	    }
    }

    onRadioChange(option) {
    	this.setState({
    		uploadType: option
    	});
    }
    
    onSubmit(event) {
    	this.setState({
    		data: [],
    		header: ''
    	});
        event.preventDefault();
        if (!this.state.uploadType) {
        	return;
        }
        const formData = new FormData();
        const file = document.querySelector('#file');
        if(file.files[0]) {
            formData.append('file', file.files[0]);
            this.showLoadingModel(`Initiated ${this.state.uploadType} file uploading`, 10);
            if (this.state.uploadType === 'Hydrant') {
            	HydrantAPI.uploadHydrant(formData, this.showSuccessMessage, this.ShowErrorMessage, this.showUploading);
            } else if (this.state.uploadType === 'Preplan') {
            	LocationAPI.uploadPrePlan(formData, this.showSuccessMessage, this.ShowErrorMessage, this.showUploading);
            } else if (this.state.uploadType === 'User') {
            	UserAPI.uploadUser(formData, this.showSuccessMessage, this.ShowErrorMessage, this.showUploading);
            }
        }else{
          	return;
        }
    }

    showUploading(event) {
    	if (event >= 100) {
    		this.showLoadingModel(`${this.state.uploadType} file uploaded. Processing initiated.`, 70);
    	} else {
    		this.showLoadingModel(`${this.state.uploadType} file uploaded ${event}%`, 50);	
    	}    	
    }
    
    render() {
    	const style = [
            {
              position: 'absolute',
              right: '25px',
            },
            {
            	overflowY: 'auto',
            	maxHeight: '90vh',
            }
          ];
    	
      	 if (this.state.	redirectToHome) {
    	       return <Redirect to="/" />;
    	 }
      	 
		 return (
			   <div style={style[1]}>
				   <Grid>
				     <Row className="show-grid">
				       <h3>
				          Upload Data
				       </h3>
				       <hr />
				     </Row>
				     
		    		<Form horizontal onSubmit={this.onSubmit}>
		    			<FormGroup>
			    		<Row className="option-grid">
					     	<Radio name="radioGroup" inline checked = {this.state.uploadType === 'Hydrant'} onChange={(e) => this.onRadioChange('Hydrant')}>
						      	Hydrants
						    </Radio>
						    <Radio name="radioGroup" inline checked = {this.state.uploadType === 'Preplan'} onChange={(e) => this.onRadioChange('Preplan')}>
						      	Preplans
						    </Radio>
						    <Radio name="radioGroup" inline checked = {this.state.uploadType === 'User'} onChange={(e) => this.onRadioChange('User')}>
						      	Users
						    </Radio>
						    <hr/>
		    		        <FormControl type="file" name="file" value={this.state.file} id="file" accept=".csv,text/csv" />
		    		        <hr/>
			    		    <Button type="submit" bsStyle="primary">
			    		     	Upload
			    		    </Button>
		    		      </Row>
		    		      {this.state.uploadType === 'Hydrant' &&
			    		      <div>
				    		      <Row>
				    		      	<a href="/images/HydrantsSample.csv" download>Download Sample Input File (Hydrant)</a>
				    		      </Row>
				    		      <Row>
				    		      	<a href="/images/HydrantsSampleData.csv" download>Download Sample Input File(With Sample Data) (Hydrant)</a>
				    		      </Row>
				    		      <Row>
				    		      	<a href="/images/HydrantsManual.pdf" download>Download Manual (Hydrant)</a>
				    		      </Row>
				    		   </div>
		    		      }
		    		      {this.state.uploadType === 'Preplan' &&
			    		      <div>
				    		      <Row>
				    		      	<a href="/images/PreplanSample.csv" download>Download Sample Input File (Preplan)</a>
				    		      </Row>
				    		      <Row>
				    		      	<a href="/images/PreplanSampleData.csv" download>Download Sample Input File(With Sample Data) (Preplan)</a>
				    		      </Row>
				    		      <Row>
				    		      	<a href="/images/PreplanManual.pdf" download>Download Manual (Preplan)</a>
				    		      </Row>
				    		   </div>
		    		      }
		    		      {this.state.uploadType === 'User' &&
			    		      <div>
				    		      <Row>
				    		      	<a href="/images/UserSample.csv" download>Download Sample Input File (User)</a>
				    		      </Row>
				    		      <Row>
				    		      	<a href="/images/UserSampleData.csv" download>Download Sample Input File(With Sample Data)(User)</a>
				    		      </Row>
				    		      <Row>
				    		      	<a href="/images/UserManual.pdf" download>Download Manual (User)</a>
				    		      </Row>
				    		   </div>
		    		      }
						</FormGroup>
	    		    </Form>
	    		    <div>
	                {this.state.header && this.state.data && 
	                	<ReactToPrint
		                  trigger={() => <a style={style[0]} href="#">Print this out</a>}
		                  content={() => this.componentRef}
		                />	
	                }
	                <ComponentToPrint 
	                	ref={el => (this.componentRef = el)}
	                	data = {this.state.data}
	                	header = {this.state.header}
	                />
	              </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(UploadDataContainer);
