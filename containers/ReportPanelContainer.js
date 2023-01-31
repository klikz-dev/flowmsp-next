import React from 'react';
import { connect } from 'react-redux';
import { Button, Tabs, Tab, ProgressBar, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Modal from '../components/common/ModalComponent';
import * as AdminAPI from '../api/AdminAPI';
import StatComponent from '../components/admin/StatComponent';
import adminpanel from '../styles/adminpanel.scss';
import { dpstyles } from '../styles/react-datepicker.scss';

class ReportPanelContainer extends React.Component {

  constructor(props) {
    super();
    const locations = props.locations.filter(x => x.isMine);
    const statData = [];
    
    statData.push({Title: 'Total pre-plans', 
    			   RawData: locations
    });
    statData.push({Title: 'Pre-plans with images', 
    			   RawData: locations.filter(x => x.imageLength > 0)
    });
    statData.push({Title: 'Sprinkler buildings', 
    			   RawData: locations.filter(x => x.building && ((x.building.sprinklered === 'Dry System') || (x.building.sprinklered === 'Wet System') || (x.building.sprinklered === 'Both')))
    });

    statData.push({Title: 'Non-sprinkled buildings',
    			   RawData: locations.filter(x => !(x.building && ((x.building.sprinklered === 'Dry System') || (x.building.sprinklered === 'Wet System') || (x.building.sprinklered === 'Both'))))
    });
    
    statData.push({Title: 'Building with a fire alarm', 
    			   RawData: locations.filter(x => x.building && x.building.fireAlarm === 'Yes')
    });
    statData.push({Title: 'Building with a truss roof', 
    			   RawData: locations.filter(x => x.building && (x.building.roofType === 'Bowstring Truss' || x.building.roofConstruction === 'Steel Truss - Open Web' || x.building.roofConstruction === 'Wood Truss - Closed Web' || x.building.roofConstruction === 'Wood Truss - Open Web'))
    });
    statData.push({Title: 'Building greater than 5,000 square feet', 
    			   RawData: locations.filter(x => x.roofArea > 5000)
    });
    statData.push({Title: 'Building with business / mercantile occupancy', 
    			   RawData: locations.filter(x => x.building && ((x.building.occupancyType === 'Business / Mercantile') || (x.building.occupancyType === 'Industrial')))
    });
    statData.push({Title: 'Building with multi-family occupancy', 
    			   RawData: locations.filter(x => x.building && x.building.occupancyType === 'Multi-Family')
    });

    this.state = {
    	 showModal: false,
    	 modal: { heading: null, body: null },
    	 activeKey: 1,
    	 showErrorsOnly: false,
    	 errorFlag: 0, 
    	 statData: statData
    };
    
    this.toggleModal = this.toggleModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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

  handleSelect(key) {
	 this.setState({ activeKey: key });
  }
  
  render() {
	  return (
			  <div className = "main-div">
			  <Tabs
		        activeKey={this.state.key}
		        onSelect={this.handleSelect}
		        id="admin-panel-tab"
		      >
		       <Tab eventKey={1} title="Statistics">
				  <div className="data-div-stat">
		          	<StatComponent statData= {this.state.statData} timeZone={this.props.customer && this.props.customer.timeZone ? this.props.customer.timeZone : ''}/>
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
		locations: store.customer.origLocations,
		hydrants: store.customer.hydrants
	};
};


export default connect(mapStateToProps)(ReportPanelContainer);
