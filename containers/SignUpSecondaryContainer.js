import React from 'react';
import {Button} from 'react-bootstrap';
import SignUpSecondaryComponent from '../components/SignUpSecondary/SignUpSecondaryComponent';
import Modal from '../components/common/ModalComponent';
import * as sessionAPI from '../api/SessionAPI';
import {Redirect} from 'react-router';

class SignUpSecondaryContainer extends React.Component {

    constructor(props) {
        super();
        this.state = {
            signupRequestComplete: false,
            redirectToLogin: false,
            showModal: false,
            modal: {heading: null, body: null},
            isFormSubmitting: false,
            isLoaded: false
        };
        this.validateLinkPart();
    }

    getTokenValue = (name) => {
        const url = window.location.href;
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    submitSignUpSecondary = (form) => {
        const linkPart = this.getTokenValue('linkPart');
        const data = {
            firstName: form.firstName,
            lastName: form.lastName,
            password: form.password
        };

        this.setState({isFormSubmitting: true});
        sessionAPI.submitSignUpSecondary(data, this.showMessage, linkPart);
    };

    validateLinkPart = (form) => {
        const linkPart = this.getTokenValue('linkPart');

        const validateLinkSuccess = () => {
            this.getUserFromLinkPart();
        };

        sessionAPI.validateLinkPart(this.showMessage, validateLinkSuccess, linkPart);
    };

    getUserFromLinkPart = (form) => {
        const linkPart = this.getTokenValue('linkPart');

        const getUserSuccess = (email) => {
            this.setState({userEmail: email});
            this.setState({isLoaded: true});
        };

        sessionAPI.getUserFromLinkPart(this.showMessage, getUserSuccess, linkPart);
    };

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal});
        if (this.state.signupRequestComplete === true) {
            this.setState({redirectToLogin: true});
        }
    }

    showMessage = (obj) => {
        this.toggleModal();
        this.setState({
            isFormSubmitting: false,
            signupRequestComplete: true,
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
            return <Redirect to="/login"/>;
        }
        return (
            <div>
                <SignUpSecondaryComponent isLoaded={this.state.isLoaded}
                    userEmail={this.state.userEmail}
                    submitSignUpSecondary={this.submitSignUpSecondary}
                                          isFormSubmitting={this.state.isFormSubmitting}/>
                <Modal showModal={this.state.showModal} toggleModal={this.toggleModal} modal={this.state.modal}/>
            </div>
        );
    }
}

export default SignUpSecondaryContainer;
