import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './containers/MainContainer';
import MapContainer from './containers/MapContainer';
import LoginContainer from './containers/LoginContainer';
import PasswordResetContainer from './containers/PasswordResetContainer';
import MyProfileContainer from './containers/MyProfileContainer';
import AccountInfoContainer from './containers/AccountInfoContainer';
import UploadDataContainer from './containers/UploadDataContainer';
import ManageCustomerContainer from './containers/ManageCustomerContainer';
import AdminPanelContainer from './containers/AdminPanelContainer';
import ReportPanelContainer from './containers/ReportPanelContainer';
import DataSharingContainer from './containers/DataSharingContainer';
import PrivateRoute from './components/PrivateRouteComponent';
import SignUpSecondaryContainer from "./containers/SignUpSecondaryContainer";

export default (
	<Switch>
		<Route exact path="/login" component={LoginContainer} />
		<Route exact path="/passwordResetForm" component={PasswordResetContainer} />
		<Route exact path="/signUpForm" component={SignUpSecondaryContainer} />
		<MainContainer>
			<PrivateRoute exact path="/my-profile" component={MyProfileContainer} />
			<PrivateRoute exact path="/account-info" component={AccountInfoContainer} />
			<PrivateRoute exact path="/upload-data" component={UploadDataContainer} />
			<PrivateRoute exact path="/manage-customer" component={ManageCustomerContainer} />
			<PrivateRoute exact path="/admin-panel" component={AdminPanelContainer} />
			<PrivateRoute exact path="/report-panel" component={ReportPanelContainer} />
			<PrivateRoute exact path="/data-sharing" component={DataSharingContainer} />
			<PrivateRoute exact path="/" component={MapContainer} />
		</MainContainer>
	</Switch>
);
