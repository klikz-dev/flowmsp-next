import React from 'react';
import { connect } from 'react-redux';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import { Button, ControlLabel, Checkbox, Alert, ProgressBar, Label } from 'react-bootstrap';
import Modal from '../components/common/ModalComponent';
import * as customerAPI from '../api/CustomerAPI';
import * as userAPI from '../api/UserAPI';
import * as sessionAPI from '../api/SessionAPI';
import { Redirect } from 'react-router';
import NumericInput from 'react-numeric-input';
import datasharing from '../styles/datasharing.scss';

class DataSharingContainer extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	showModal: false,
	    	modal: { heading: null, body: null },
	    	redirectToHome: false,
	    	consent: props.customer.dataSharingConsent ? true : false,
	    	showConsentSave: false,
	    	radius: 1,
	    	partners: props.partnersList ? props.partnersList : [],
	    	partnersChanged: false,
	    	progress: 0,
	    	dispatchSharingConsent: props.customer.dispatchSharingConsent ? true : false,
	    	iAmAdmin: props.customer && props.customer.licence && props.customer.licence.licenseType === 'Master'
	    };
	    this.toggleModal = this.toggleModal.bind(this);
	    this.showSuccessModel = this.showSuccessModel.bind(this);
	    this.showError = this.showError.bind(this);
			this.showSuccessRegisterDispatch = this.showSuccessRegisterDispatch.bind(this);
	    this.showErrorRegisterDispatch = this.showErrorRegisterDispatch.bind(this);
	    this.showSuccessDeRegisterDispatch = this.showSuccessDeRegisterDispatch.bind(this);
	    this.showErrorDeRegisterDispatch = this.showErrorDeRegisterDispatch.bind(this);
	    this.handleUpdateConsent = this.handleUpdateConsent.bind(this);
	    this.handleRegisterDispatch = this.handleRegisterDispatch.bind(this);
	    this.handleDeRegisterDispatch = this.handleDeRegisterDispatch.bind(this);
	    this.handleRadiusInputChange = this.handleRadiusInputChange.bind(this);
	    this.handleRadiusSearch = this.handleRadiusSearch.bind(this);
	    this.onPartnersChange = this.onPartnersChange.bind(this);
	    this.handleSavePartners = this.handleSavePartners.bind(this);
	    this.handleSearchError = this.handleSearchError.bind(this);
	    this.handleSearchSuccess = this.handleSearchSuccess.bind(this);
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
        			return this.setState({ consent: customer.dataSharingConsent ? true : false,
        			 dispatchSharingConsent: customer.dispatchSharingConsent ? true : false,
        			 iAmAdmin: customer && customer.licence && customer.licence.licenseType === 'Master'
        			 });
        		}
	       }
       }
       return this.setState({ redirectToHome: true });
	}

	toggleModal() {
		  this.setState({ showModal: !this.state.showModal });
	}

	handleUpdateConsent() {
	  const data = [];
	  const obj = {};
	  obj.op = 'replace';
	  obj.path = '/dataSharingConsent';
	  obj.value	= this.state.consent;
	  data.push(obj);
	  this.setState({
			progress: 90
		});
	  this.props.editCustomer(data, this.showSuccessModel, this.showError);
	}

	handleRegisterDispatch() {
		this.setState({
			progress: 90
		});
		this.props.registerMeForDispatchMessages(this.showSuccessRegisterDispatch, this.showErrorRegisterDispatch);
	}

	handleDeRegisterDispatch() {
	    this.setState({
			progress: 90
		});
		this.props.deRegisterMeForDispatchMessages(this.showSuccessDeRegisterDispatch, this.showErrorDeRegisterDispatch);
	}

	handleSearchError(msg) {
		this.setState({
			progress: 100
		});
		this.showErrorModel(msg);
	}

	handleSearchSuccess() {
		this.setState({
			progress: 100
		});
	}

	handleRadiusSearch() {
		if (!this.state.radius) {
			return;
		}
		this.setState({
			progress: 90
		});
		this.props.getCustomersRadius(this.state.radius, this.handleSearchSuccess, this.handleSearchError);
	}

	showError(errorMessage) {
	    const newState = Object.assign({}, this.state);
	    this.setState(newState);
	    this.setState({
			progress: 100
		});
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

	showSuccessModel(msg) {
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
		      },
		      showConsentSave: false
		    });
		    this.toggleModal();
		    this.setState({
				progress: 100
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
		   this.toggleModal();
		   this.setState({
				progress: 100
			});
	}

	showSuccessRegisterDispatch(msg) {
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
		    this.toggleModal();
		    this.setState({
				progress: 100,
				dispatchSharingConsent: true
			});
		}

	  showErrorRegisterDispatch(msg) {
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
		   this.toggleModal();
		   this.setState({
				progress: 100
			});
	  }

	 showSuccessDeRegisterDispatch(msg) {
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
		    this.toggleModal();
		    this.setState({
				progress: 100,
				dispatchSharingConsent: false
			});
	  }

	  showErrorDeRegisterDispatch(msg) {
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
		   this.toggleModal();
		   this.setState({
				progress: 100
			});
	  }

	  onDataSharingChange(event) {
		  this.setState({
			  consent: event.target.checked,
			  showConsentSave: true
		  });
	  }

	  handleRadiusInputChange(value) {
		  this.setState({
			 radius: value
		  });
	  }

	  returnAddress(row) {
		  if (!row.address) {
			  return ' ';
		  }
		  let address = '';
		  if (row.address.address1) {
			  address = address + row.address.address1 + ' ';
		  }
		  if (row.address.address2) {
			  address = address + row.address.address2 + ' ';
		  }
		  if (row.address.city) {
			  address = address + row.address.city + ' ';
		  }
		  if (row.address.state) {
			  address = address + row.address.state + ' ';
		  }
		  if (row.address.zip) {
			  address = address + row.address.zip + ' ';
		  }
		  return address;
	  }

	  onPartnersChange(event, row) {
		  const mypartners = this.state.partners;
		  let foundIndex = -1;
		  for (let ii = 0; ii < mypartners.length; ii ++) {
			  if (row.id === mypartners[ii]) {
				  foundIndex = ii;
				  break;
			  }
		  }
		  if (event.target.checked) {
			  if (foundIndex < 0) {
				  mypartners.push(row.id);
			  }
		  } else {
			  if (foundIndex >= 0) {
				  mypartners.splice(foundIndex, 1);
			  }
		  }
		  this.setState({
			  partners: mypartners,
			  partnersChanged: true
		  });
	  }

	  handleSavePartners() {
			this.props.addCustomerPartners(this.state.partners, this.showSuccessModel, this.showErrorModel);
			this.setState({
				partnersChanged: false,
				progress: 90
			});
	  }

	 renderRows() {
			const _this = this;
			if (!this.props.customerRadiusList)	{
				return null;
			}
			if (this.state.progress > 0 && this.state.progress < 100) {
				return null;
			}
	    return this.props.customerRadiusList.map(function(row) {
		    return (
		    	    <Tr key={row.id}>
		           <Td column="Fire Department">{row.name}</Td>
		           <Td column="Address">{_this.returnAddress(row)}</Td>
		           {
		           	(row.dataSharingConsent || _this.state.iAmAdmin) &&
		          	 <Td column="Pull Data From" className="user-table-action">
		           	<Checkbox defaultChecked={_this.props.partnersList.indexOf(row.id) > -1} value={_this.state.partners.indexOf(row.id) > -1} onChange={(e) => _this.onPartnersChange(e, row)}/>
		           	</Td>
		           }
		        </Tr>
		    );
	    });
	}

	render() {
		if (this.props.customer.customerId === null) {
			return (
			     <div className="main-div">
			     	<Alert bsStyle="danger">
	                	<strong>Error!</strong> Reload the page or goto Home page.
	              	</Alert>
	 		     </div>
			);
		}

    if (this.state.	redirectToHome) {
			return <Redirect to="/" />;
		}

		let iAmAdmin = this.state.iAmAdmin;
		if (typeof iAmAdmin === 'undefined') {
			iAmAdmin = this.props.customer && this.props.customer.licence && this.props.customer.licence.licenseType === 'Master';
			this.setState({
				iAmAdmin: iAmAdmin
			});
		}

    const tableProps = {
			itemsPerPage: 10,
			pageButtonLimit: 10,
			sortable: ['Fire Department', 'Address'],
			filterable: ['Fire Department', 'Address'],
			noDataText: 'No matching records found.',
			filterPlaceholder: 'Search by Fire Department or Address'
		};

		  return (
		     <div className="main-div">
		        <div className="consent-div">
		        	{
		        		!iAmAdmin &&
                		<Checkbox defaultChecked={this.state.consent} onChange={this.onDataSharingChange.bind(this)}>
                			I agree to share preplanning data with other fire departments.
                		</Checkbox>
                	}
                	{
			        	!iAmAdmin && this.state.showConsentSave &&
			        	<div className="saveConsent-div">
			        		<Button bsStyle="primary" onClick={this.handleUpdateConsent}>Save Consent</Button>
			        	</div>
			        }
			        {
		  		    	this.state.iAmAdmin && !this.state.dispatchSharingConsent  &&
		  		    	<div>
		  		    		<Button bsStyle="success" onClick={this.handleRegisterDispatch}>Register for Dispatch Messages</Button>
		  		    	</div>
		  		    }
		  		    {
		  		    	this.state.iAmAdmin && this.state.dispatchSharingConsent  &&
		  		    	<div>
		  		    		<Button bsStyle="warning" onClick={this.handleDeRegisterDispatch}>Deregister for Dispatch Messages</Button>
		  		    	</div>
		  		    }
		        </div>
		        {
		        	(this.state.consent || this.state.iAmAdmin) &&
		        	<div className="radius-div">
			        	<span>
			        		Radius
			        	</span>
			        	<span>
			        		<NumericInput min={1} max={9999} step={10}  onChange={valueAsNumber =>  this.handleRadiusInputChange(valueAsNumber)}/>
			        	</span>
			        	<span>
			        		In Miles
			        	</span>
			        	<span>
			        		<Button bsStyle="primary" onClick={this.handleRadiusSearch}>Search Partners</Button>
			        	</span>
			        	{
			        		(!this.state.radius) &&
				        	<Alert bsStyle="danger">
	                			<strong>Error!</strong> Radius is invalid.
	              			</Alert>
              			}
				  		<div className="table-div" >
			  		   		<Table className="table" {...tableProps}>{this.renderRows()}</Table>
			  		    </div>
			  		    {
			  		    	this.state.partnersChanged &&
				  		    <div className="savePartner-div">
			  		    		<Button bsStyle="primary" onClick={this.handleSavePartners}>Save Partners</Button>
			  		    	</div>
			  		    }
		        	</div>
		        }
		        {
          			(this.state.progress > 0 && this.state.progress < 100) && <div className="progress-div">
          				<ProgressBar active bsStyle="info" now={this.state.progress} />
          			</div>
              	}
		        <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal} />
 		     </div>
		  );
	}
}

function mapStateToProps(store) {
	return {
		customer: store.customer,
		customerRadiusList: store.customer.customerRadiusList,
		partnersList: store.customer.partners,
	};
}

function mapDispatchToProps(dispatch) {
  return {
    editCustomer: (form, successCallback, errorCallback) => customerAPI.editCustomer(form, successCallback, errorCallback, dispatch),
    getCustomersRadius: (radius, successCallback, errorCallback) => customerAPI.getCustomerRadius(radius, successCallback, errorCallback, dispatch),
    addCustomerPartners: (partners, successCallback, errorCallback) => customerAPI.addCustomerPartners(partners, successCallback, errorCallback, dispatch),
    registerMeForDispatchMessages: (successCallback, errorCallback) => customerAPI.registerMeForDispatchMessages(successCallback, errorCallback, dispatch),
    deRegisterMeForDispatchMessages: (successCallback, errorCallback) => customerAPI.deRegisterMeForDispatchMessages(successCallback, errorCallback, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DataSharingContainer);
