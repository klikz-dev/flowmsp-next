import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      {label && props.required && <span className="required-label">*</span>}
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}
