import React from 'react';
import { connect } from 'react-redux';
import { Button, Tabs, Tab, ProgressBar, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Modal from '../components/common/ModalComponent';
import * as AdminAPI from '../api/AdminAPI';
import AdminLogComponent from '../components/admin/AdminLogComponent';
import ActivityLogComponent from '../components/admin/ActivityLogComponent';
import UsersListComponent from '../components/admin/UsersListComponent';
import adminpanel from '../styles/adminpanel.scss';
import { dpstyles } from '../styles/react-datepicker.scss';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class AdminPanelContainer extends React.Component {

  constructor(props) {
    super();
    const timeZone = props.customer && props.customer.timeZone ? props.customer.timeZone : '';
    const locations = props.locations;

    this.state = {
    	 showModal: false,
    	 modal: { heading: null, body: null },
    	 activeKey: 1,
    	 showErrorsOnly: false,
    	 errorFlag: 0,
    	 dispatchDateFrom: moment().tz(timeZone).startOf('day'),
    	 dispatchDateTill: moment().tz(timeZone).endOf('day'),
    	 activityDateFrom: moment().tz(timeZone).startOf('day'),
    	 activityDateTill: moment().tz(timeZone).endOf('day'),
    	 activitySource: 'All'
    };
    
    this.toggleModal = this.toggleModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSuccessDispatch = this.handleSuccessDispatch.bind(this);
    this.handleSuccessActivity = this.handleSuccessActivity.bind(this);
    this.handleSuccessUsers = this.handleSuccessUsers.bind(this);
    this.handleError = this.handleError.bind(this);
    this.optionChanged = this.optionChanged.bind(this);
    this.fetchDispatchFromServer = this.fetchDispatchFromServer.bind(this);
    this.fetchActivityFromServer = this.fetchActivityFromServer.bind(this);
    this.fetchUsersFromServer = this.fetchUsersFromServer.bind(this);
    this.handleErrorInputChange = this.handleErrorInputChange.bind(this);
    this.handleDispatchDateFromChange = this.handleDispatchDateFromChange.bind(this);
    this.handleDispatchDateFromSelect = this.handleDispatchDateFromSelect.bind(this);
    this.handleDispatchDateTillChange = this.handleDispatchDateTillChange.bind(this);
    this.handleDispatchDateTillSelect = this.handleDispatchDateTillSelect.bind(this);
    this.handleActivityDateFromChange = this.handleActivityDateFromChange.bind(this);
    this.handleActivityDateFromSelect = this.handleActivityDateFromSelect.bind(this);
    this.handleActivityDateTillChange = this.handleActivityDateTillChange.bind(this);
    this.handleActivityDateTillSelect = this.handleActivityDateTillSelect.bind(this);
    
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
  
  optionChanged(event) {
  	this.setState({
  		showErrorsOnly: event.target.checked
  	});
  }
  
  handleErrorInputChange(val) {
  	this.setState({
  		errorFlag: val
  	});
  }
  
  fetchActivityFromServer() {
    let parameters = 'timeFrom=' + this.state.activityDateFrom;
  	parameters = parameters + '&timeTill=' + this.state.activityDateTill;
  	parameters = parameters + '&customer=all';
  	
  	if (this.state.activitySource === 'All') {
  		parameters = parameters + '&source=Activity';
  	} else {
  		parameters = parameters + '&source=' + this.state.activitySource;
  	}	
  	this.props.getLog(parameters, this.handleSuccessActivity, this.handleError);
  	
	const newState = Object.assign({}, this.state);
    newState.modal.heading = 'Refreshing';
    newState.modal.body = (
      <div>
        <span> Wait!! fetching from server... </span>
        <ProgressBar active now={100} />
      </div>
    );
    this.setState(newState);
    this.toggleModal();  
  }
  
  fetchDispatchFromServer() {
  	let parameters = 'source=DISPATCH';
  	parameters = parameters + '&timeFrom=' + this.state.dispatchDateFrom;
  	parameters = parameters + '&timeTill=' + this.state.dispatchDateTill;
  	parameters = parameters + '&customer=all';  	
  	this.props.getLog(parameters, this.handleSuccessDispatch, this.handleError);
  	
	const newState = Object.assign({}, this.state);
    newState.modal.heading = 'Refreshing';
    newState.modal.body = (
      <div>
        <span> Wait!! fetching from server... </span>
        <ProgressBar active now={100} />
      </div>
    );
    this.setState(newState);
    this.toggleModal();
  }
    
  fetchUsersFromServer() {  	  	
  	this.props.getUsersList(this.handleSuccessUsers, this.handleError);
  	
	const newState = Object.assign({}, this.state);
    newState.modal.heading = 'Refreshing';
    newState.modal.body = (
      <div>
        <span> Wait!! fetching from server... </span>
        <ProgressBar active now={100} />
      </div>
    );
    this.setState(newState);
    this.toggleModal();
  }
  
  handleSelect(key) {
	 this.setState({ activeKey: key });
  }
  
  handleSuccessDispatch(response) {
	this.toggleModal();
	const data = response.data;
  	const dataDownload = [];
  	const timeZone = this.props.customer && this.props.customer.timeZone ? this.props.customer.timeZone : '';
 	for (let ii = 0; ii < data.length; ii ++) {
 		const stamp = moment.utc(data[ii].TimeStamp, 'YYYY-MM-DD HH.mm.ss').tz(timeZone);
 		if (stamp.isAfter(this.state.dispatchDateTill, 'day')) {
 			continue;
 		}
 		if (stamp.isBefore(this.state.dispatchDateFrom, 'day')) {
 			continue;
 		} 		
 		dataDownload.push({ID: data[ii].id, Source: data[ii].Source, TimeStamp: stamp.format('YYYY-MM-DD HH:mm:ss'), ErrorFlag: data[ii].ErrorFlag, ErrorDescription: data[ii].ErrorDescription, Details: data[ii].Details});
 	}  	
	this.setState({
		dispatchData: dataDownload
	});
  }
  
  handleSuccessActivity(response) {
  	this.toggleModal();
  	const data = response.data;
  	const dataDownload = [];
  	const timeZone = this.props.customer && this.props.customer.timeZone ? this.props.customer.timeZone : '';
  	for (let ii = 0; ii < data.length; ii ++) {
  		const stamp = moment.utc(data[ii].TimeStamp, 'YYYY-MM-DD HH.mm.ss').tz(timeZone);
 		if (stamp.isAfter(this.state.activityDateTill, 'day')) {
 			continue;
 		}
 		if (stamp.isBefore(this.state.activityDateFrom, 'day')) {
 			continue;
 		}
 		dataDownload.push({ID: data[ii].id, Customer: data[ii].Details.customerSlug, Subject: data[ii].Details.subject, user: data[ii].Details.userName, Source: data[ii].Source, TimeStamp: stamp.format('YYYY-MM-DD HH:mm:ss'), Version: data[ii].Details.version});
 	} 	
	this.setState({
		activityData: dataDownload
	});
  }
  
  handleSuccessUsers(response) {
	this.toggleModal();	 	
	this.setState({
		usersData: response.data
	});
  }
  
  handleError(response) {
	    this.hideModal();
	    this.setState({
		      modal: {
		        heading: 'Error',
		        body: (
		          <div>
		            <div>{response}</div>
		            <div className="text-align-right margin-top-10px">
		              <Button type="button" bsStyle="primary" onClick={this.toggleModal}>OK</Button>
		            </div>
		          </div>
		        )
		      }
		    });	
		this.showModal();    
  }
  
  handleDispatchDateFromChange(event) {
	   const date = moment(event);
	   this.setState({
	   		dispatchDateFrom: date
	   });
  }
  
  handleDispatchDateFromSelect(date, event) {
  	    this.setState({
	   		dispatchDateFrom: date
	   });
  }
  
  handleDispatchDateTillChange(event) {
	   const date = moment(event);
	   this.setState({
	   		dispatchDateTill: date
	   });
  }
  
  handleDispatchDateTillSelect(date, event) {
  	    this.setState({
	   		dispatchDateTill: date
	   });
  }
  
  handleActivityDateFromChange(event) {
	   const date = moment(event);
	   this.setState({
	   		activityDateFrom: date
	   });
  }
  
  handleActivityDateFromSelect(date, event) {
  	    this.setState({
	   		activityDateFrom: date
	   });
  }
  
  handleActivityDateTillChange(event) {
	   const date = moment(event);
	   this.setState({
	   		activityDateTill: date
	   });
  }
  
  handleActivityDateTillSelect(date, event) {
  	    this.setState({
	   		activityDateTill: date
	   });
  }
  
  activtySourceChange(event) {
  	this.setState({
  		activitySource: event.target.value
  	});
  }
  
  render() {
	  return (
			  <div className = "main-div">
			  <Tabs
		        activeKey={this.state.key}
		        onSelect={this.handleSelect}
		        id="admin-panel-tab"
		      >		       		      
		        <Tab eventKey={2} title="Dispatch Logs">
		          <div className = "form-div-dispatch">
		          <form>
				   	  <FormGroup key="FormDispatchDate">
				   	  <label>Date From
				      <DatePicker className="form-control" name="DispatchDateFrom" title="Date From" placeholderText="Date From"
				          dateFormat="YYYY-MM-DD"
				          selected={this.state.dispatchDateFrom}
	                      onChange={this.handleDispatchDateFromChange}
	                      onSelect={this.handleDispatchDateFromSelect} 
				          required
				      />
				      </label>
					  <label>Date Till
				      <DatePicker className="form-control" name="DispatchDateTill" title="Date Till" placeholderText="Date Till"
				          dateFormat="YYYY-MM-DD"
				          selected={this.state.dispatchDateTill}
	                      onChangeRaw={this.handleDispatchDateTillChange}
	                      onSelect={this.handleDispatchDateTillSelect}
				          required
				      />
				      </label>
				  </FormGroup>
                    <Button bsStyle="primary" onClick={this.fetchDispatchFromServer}>Refresh log information</Button>                  	                  	
				  </form>
				  </div>
				  <div className="data-div-dispatch">
		          	<AdminLogComponent logData= {this.state.dispatchData}/>
		          </div>
		        </Tab>
		        <Tab eventKey={3} title="Activity Logs">
		          <div className = "form-div-activity">
		          <form>
				   <FormGroup key="FormActivityDate">
				   	  <label>Date From
				      <DatePicker className="form-control" name="ActivityDateFrom" title="Date From" placeholderText="Date From"
				          dateFormat="YYYY-MM-DD"
				          selected={this.state.activityDateFrom}
	                      onChange={this.handleActivityDateFromChange}
	                      onSelect={this.handleActivityDateFromSelect} 
				          required
				      />
				      </label>
					  <label>Date Till
				      <DatePicker className="form-control" name="ActivityDateTill" title="Date Till" placeholderText="Date Till"
				          dateFormat="YYYY-MM-DD"
				          selected={this.state.activityDateTill}
	                      onChangeRaw={this.handleActivityDateTillChange}
	                      onSelect={this.handleActivityDateTillSelect}
				          required
				      />
				      </label>
				      <br/>
				      <label>Source
				      <FormControl componentClass="select" name="selectActivitySource" value={this.state.activtySource}   onChange={this.activtySourceChange.bind(this)}>
	            		    <option key="sourceAll" value="All">All</option>
	            		    <option key="sourceWeb" value="Web">Web</option>
	            		    <option key="sourceMobile" value="Mobile">Mobile</option>
	            	    });
                  	</FormControl>
                  	</label>                  	
				  </FormGroup>
                    <Button bsStyle="primary" onClick={this.fetchActivityFromServer}>Refresh activity information</Button>                  	                  	
				  </form>		          
		          </div>
		          <div className="data-div-activity">
		          	<ActivityLogComponent logData= {this.state.activityData}/>
		          </div>
		        </Tab>
		        <Tab eventKey={4} title="All Users">
		          <div className = "form-div-users">
		          <form>
                    <Button bsStyle="primary" onClick={this.fetchUsersFromServer}>Refresh users list</Button>                  	                  	
				  </form>		          
		          </div>
		          <div className="data-div-users">
		          	<UsersListComponent logData= {this.state.usersData}/>
		          </div>
		        </Tab>
		      </Tabs>
		        <Modal
		          showModal={this.state.showModal}
		          toggleModal={this.toggleModal}
		          modal={this.state.modal}
		        />
		       </div>
	  );
  }

}

const mapStateToProps = function(store) {
	return {
		user: store.user,
		customer: store.customer,
		locations: store.customer.locations,
		hydrants: store.customer.hydrants
	};
};

const mapDispatchToProps =  function(dispatch) {
	  return {
	    getLog: (parameters, handleSuccess, handleError) => AdminAPI.getLog(parameters, handleSuccess, handleError, dispatch),
	    getUsersList: (handleSuccess, handleError) => AdminAPI.getUsersList(handleSuccess, handleError, dispatch),
	  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanelContainer);
