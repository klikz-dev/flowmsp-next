import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import ManageCustomerComponent from "../components/ManageCustomer/ManageCustomerComponent";
import * as CustomerAPI from "../api/CustomerAPI";
import EditLicenceFormComponent from "../components/form/EditLicenceFormComponent";
import Modal from "../components/common/ModalComponent";
import moment from "moment";
import { Redirect } from "react-router";
import managecustomer from "../styles/managecustomer.scss";

class ManageCustomerContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showModal: false,
      redirectToHome: false,
      modal: { heading: null, body: null },
    };
  }

  componentDidMount() {
    this.props.getCustomerList();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.customer &&
      nextProps.customer.links &&
      nextProps.customer !== this.props.customer
    ) {
      this.userHasPermission(nextProps.customer);
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  //smsNumber: row.smsNumber,
  //smsFormat: row.smsFormat,
  editLicence = (row) => {
    const customer = {
      links: row.links,
      id: row.id,
      licenseType: row.license.licenseType,
      licenseExpirationTimestamp: row.license.expirationTimestamp,
      emailGateway: row.emailGateway,
      emailFormat: row.emailFormat,
      emailSignature: row.emailSignature,
      emailSignatureLocation: row.emailSignatureLocation,
      fromContains: row.fromContains,
      toContains: row.toContains,
      subjectContains: row.subjectContains,
      bodyContains: row.bodyContains,
      fromNotContains: row.fromNotContains,
      toNotContains: row.toNotContains,
      subjectNotContains: row.subjectNotContains,
      bodyNotContains: row.bodyNotContains,
      boundSWLat: row.boundSWLat,
      boundSWLon: row.boundSWLon,
      boundNELat: row.boundNELat,
      boundNELon: row.boundNELon,
    };

    this.setState({
      modal: {
        heading: `Edit ${row.name} License`,
        body: (
          <EditLicenceFormComponent
            customer={customer}
            handleFormSubmit={this.handleFormSubmit}
          />
        ),
      },
    });
    this.toggleModal();
  };

  userHasPermission = (customer) => {
    if (
      customer &&
      customer.licence &&
      customer.licence.licenseType === "Master"
    ) {
      return true;
    }
    return this.setState({ redirectToHome: true });
  };

  handleFormSubmit = (customer) => {
    const expiryDateString = customer.expiryDate.format("YYYY-MM-DD HH:MM:SS");
    customer.licenseExpirationTimestamp = expiryDateString;
    this.props.updateCustomerLicence(
      customer,
      this.handleSuccess,
      this.handleError
    );
    this.setState({
      modal: {
        body: (
          <EditLicenceFormComponent
            customer={customer}
            handleFormSubmit={this.handleFormSubmit}
            isFormSubmitting
          />
        ),
      },
    });
  };

  handleSuccess = (message) => {
    this.setState({
      modal: {
        heading: "Success",
        body: (
          <div>
            <div>{message}</div>
            <div className="text-align-right margin-top-10px">
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.toggleModal}
              >
                OK
              </Button>
            </div>
          </div>
        ),
      },
    });
  };

  handleError = (customer, errorMsg) => {
    this.setState({
      modal: {
        body: (
          <EditLicenceFormComponent
            customer={customer}
            handleFormSubmit={this.handleFormSubmit}
            errorMessage={errorMsg}
          />
        ),
      },
    });
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <ManageCustomerComponent editLicence={this.editLicence} />
        <Modal
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}
          modal={this.state.modal}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    customer: store.customer,
    customerList: store.customer.customerList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomerList: () => CustomerAPI.getCustomerList(dispatch),
    updateCustomerLicence: (customer, handleSuccess, handleError) =>
      CustomerAPI.updateLicence(customer, handleSuccess, handleError, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCustomerContainer);
