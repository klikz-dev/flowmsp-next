import React from "react";
import Dock from "react-dock";
import {
  Glyphicon,
  Button,
  Grid,
  Row,
  Col,
  Checkbox,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";

export default class ReactDock extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isVisible: false,
      filterArray: [],
      excludePartner: "",
      selectBuildingInfo: "",
      commercial: false,
      vacant: false,
      sprinklered: false,
      nonSprinklered: false,
      withPictures: false,
      withoutPictures: false,
      trussRoof: false,
      standpipes: false,
      fireAlarm: false,
      multiFamily: false,
      special: false,
      selectPreplanAge: "",
      roofAreaMin: "",
      roofAreaMax: "",
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.changedNumeric = this.changedNumeric.bind(this);
    this.changedSelectOption = this.changedSelectOption.bind(this);
    this.changedCheckbox = this.changedCheckbox.bind(this);
  }

  changedNumeric(event) {
    if (event.target.value === "") {
      this.setState({ [event.target.name]: event.target.value });
    } else {
      this.setState({ [event.target.name]: parseFloat(event.target.value) });
    }
  }

  changedSelectOption(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  changedCheckbox(event) {
    this.setState({ [event.target.name]: event.target.checked });
  }

  applyFilter() {
    const arr = [];
    if (this.state.excludePartner) {
      arr.push({
        field: "excludePartner",
        value: this.state.excludePartner,
      });
    }
    if (this.state.selectBuildingInfo !== "") {
      arr.push({
        field: "selectBuildingInfo",
        value: this.state.selectBuildingInfo,
      });
    }
    if (this.state.commercial) {
      arr.push({
        field: "commercial",
        value: this.state.commercial,
      });
    }
    if (this.state.vacant) {
      arr.push({
        field: "vacant",
        value: this.state.vacant,
      });
    }
    if (this.state.sprinklered) {
      arr.push({
        field: "sprinklered",
        value: this.state.sprinklered,
      });
    }
    if (this.state.nonSprinklered) {
      arr.push({
        field: "nonSprinklered",
        value: this.state.nonSprinklered,
      });
    }
    if (this.state.withPictures) {
      arr.push({
        field: "withPictures",
        value: this.state.withPictures,
      });
    }
    if (this.state.withoutPictures) {
      arr.push({
        field: "withoutPictures",
        value: this.state.withoutPictures,
      });
    }
    if (this.state.trussRoof) {
      arr.push({
        field: "trussRoof",
        value: this.state.trussRoof,
      });
    }
    if (this.state.standpipes) {
      arr.push({
        field: "standpipes",
        value: this.state.standpipes,
      });
    }
    if (this.state.fireAlarm) {
      arr.push({
        field: "fireAlarm",
        value: this.state.fireAlarm,
      });
    }
    if (this.state.multiFamily) {
      arr.push({
        field: "multiFamily",
        value: this.state.multiFamily,
      });
    }
    if (this.state.special) {
      arr.push({
        field: "special",
        value: this.state.special,
      });
    }
    if (this.state.selectPreplanAge !== "") {
      arr.push({
        field: "selectPreplanAge",
        value: this.state.selectPreplanAge,
      });
    }
    if (this.state.roofAreaMin !== "") {
      arr.push({
        field: "roofAreaMin",
        value: this.state.roofAreaMin,
      });
    }
    if (this.state.roofAreaMax !== "") {
      arr.push({
        field: "roofAreaMax",
        value: this.state.roofAreaMax,
      });
    }
    this.props.OnFilterChange(arr);
    this.setState({
      isVisible: false,
    });
  }

  clearFilter() {
    const arr = [];
    this.props.OnFilterChange(arr);
    this.setState({
      isVisible: false,
      filterArray: [],
      excludePartner: "",
      selectBuildingInfo: "",
      commercial: false,
      vacant: false,
      sprinklered: false,
      nonSprinklered: false,
      withPictures: false,
      withoutPictures: false,
      trussRoof: false,
      standpipes: false,
      fireAlarm: false,
      multiFamily: false,
      special: false,
      selectPreplanAge: "",
      roofAreaMin: "",
      roofAreaMax: "",
    });
  }

  render() {
    return (
      <div>
        <Dock position="left" size={0.35} isVisible={this.state.isVisible}>
          <Form horizontal>
            <div
              className="doKclose"
              onClick={() =>
                this.setState({ isVisible: !this.state.isVisible })
              }
            >
              <Glyphicon glyph="arrow-left" />
            </div>
            <FormGroup>
              <hr />
              <Col smOffset={4} sm={3}>
                <Button bsStyle="primary" onClick={this.applyFilter}>
                  Apply
                </Button>
              </Col>
              <Col sm={3}>
                <Button bsStyle="warning" onClick={this.clearFilter}>
                  Clear
                </Button>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="formPartnerInfo">
              <Col componentClass={ControlLabel} xs={3}>
                Partner preference
              </Col>
              <Col xs={8}>
                <Checkbox
                  name="excludePartner"
                  checked={this.state.excludePartner}
                  onChange={this.changedCheckbox}
                >
                  Exclude Partner
                </Checkbox>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="formBuildingInfo">
              <Col componentClass={ControlLabel} xs={3}>
                Building Info.
              </Col>
              <Col xs={8}>
                <FormControl
                  componentClass="select"
                  name="selectBuildingInfo"
                  value={this.state.selectBuildingInfo}
                  onChange={this.changedSelectOption}
                >
                  <option key="Select Building Info Option" value="">
                    Select Building Info Option
                  </option>
                  <option key="present" value="Present">
                    Present
                  </option>
                  <option key="notPresent" value="Not present">
                    Not present
                  </option>
                </FormControl>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="formBuildings">
              <Col componentClass={ControlLabel} xs={3}>
                Buildings
              </Col>
              <Col xs={4}>
                <Checkbox
                  name="commercial"
                  checked={this.state.commercial}
                  onChange={this.changedCheckbox}
                >
                  Commercial
                </Checkbox>
              </Col>
              <Col xs={5}>
                <Checkbox
                  name="vacant"
                  checked={this.state.vacant}
                  onChange={this.changedCheckbox}
                >
                  Vacant
                </Checkbox>
              </Col>
              <Row>
                <Col xsOffset={3} xs={4}>
                  <Checkbox
                    name="sprinklered"
                    checked={this.state.sprinklered}
                    onChange={this.changedCheckbox}
                  >
                    Sprinklered
                  </Checkbox>
                </Col>
                <Col xs={5}>
                  <Checkbox
                    name="nonSprinklered"
                    checked={this.state.nonSprinklered}
                    onChange={this.changedCheckbox}
                  >
                    Non-sprinklered
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col xsOffset={3} xs={4}>
                  <Checkbox
                    name="withPictures"
                    checked={this.state.withPictures}
                    onChange={this.changedCheckbox}
                  >
                    With pictures
                  </Checkbox>
                </Col>
                <Col xs={5}>
                  <Checkbox
                    name="withoutPictures"
                    checked={this.state.withoutPictures}
                    onChange={this.changedCheckbox}
                  >
                    Without pictures
                  </Checkbox>
                </Col>
              </Row>
            </FormGroup>
            <hr />
            <FormGroup controlId="formBuildingWith">
              <Col componentClass={ControlLabel} xs={3}>
                Buildings with..
              </Col>
              <Col xs={4}>
                <Checkbox
                  name="trussRoof"
                  checked={this.state.trussRoof}
                  onChange={this.changedCheckbox}
                >
                  Truss Roof
                </Checkbox>
              </Col>
              <Col xs={5}>
                <Checkbox
                  name="standpipes"
                  checked={this.state.standpipes}
                  onChange={this.changedCheckbox}
                >
                  Standpipes
                </Checkbox>
              </Col>
              <Row>
                <Col xsOffset={3} xs={9}>
                  <Checkbox
                    name="fireAlarm"
                    checked={this.state.fireAlarm}
                    onChange={this.changedCheckbox}
                  >
                    Fire Alarms
                  </Checkbox>
                </Col>
              </Row>
            </FormGroup>
            <hr />
            <FormGroup controlId="formStructures">
              <Col componentClass={ControlLabel} xs={3}>
                Structures
              </Col>
              <Col xs={4}>
                <Checkbox
                  name="multiFamily"
                  checked={this.state.multiFamily}
                  onChange={this.changedCheckbox}
                >
                  Multi-family
                </Checkbox>
              </Col>
              <Col xs={5}>
                <Checkbox
                  name="special"
                  checked={this.state.special}
                  onChange={this.changedCheckbox}
                >
                  Special
                </Checkbox>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="formPrePlanAge">
              <Col componentClass={ControlLabel} xs={3}>
                Pre-plans
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  name="selectPreplanAge"
                  value={this.state.selectPreplanAge}
                  onChange={this.changedSelectOption}
                >
                  <option key="Select Pre-plans" value="">
                    Select Pre-plans
                  </option>
                  <option key="withinThirtyDays" value="withinThirtyDays">
                    Within the Last 30 Days
                  </option>
                  <option key="olderThanAYear" value="olderThanAYear">
                    Older than a year
                  </option>
                </FormControl>
              </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="formRoofArea">
              <Col componentClass={ControlLabel} xs={3}>
                Area(sq.ft.)
              </Col>
              <Col xs={4}>
                <FormControl
                  name="roofAreaMin"
                  type="number"
                  placeholder="Min"
                  value={this.state.roofAreaMin}
                  onChange={this.changedNumeric}
                />
              </Col>
              <Col xs={4}>
                <FormControl
                  name="roofAreaMax"
                  type="number"
                  placeholder="Max"
                  value={this.state.roofAreaMax}
                  onChange={this.changedNumeric}
                />
              </Col>
            </FormGroup>
          </Form>
        </Dock>
        <Glyphicon
          className="filterIcon"
          onClick={() => this.setState({ isVisible: !this.state.isVisible })}
          glyph="filter"
        />
        <span>
          <Glyphicon
            className="locator"
            glyph="globe"
            onClick={this.props.onLocatorClick}
          />
          <Glyphicon
            className="nextLocator"
            glyph="chevron-up"
            onClick={this.props.onNextLocatorClick}
          />
          <Glyphicon
            className="prevLocator"
            glyph="chevron-down"
            onClick={this.props.onPrevLocatorClick}
          />
        </span>
      </div>
    );
  }
}
