import React, { useState } from "react";
import { Form, InputGroup, FormControl, Button } from "react-bootstrap";

interface PasswordInputProps {
    label: string;
    placeholder: string;
    name: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    placeholder,
    name,
    value,
    error,
    onChange,
  }) => {
    const [showPassword, setShowPassword] = useState(false);
  
    return (
      <Form.Group className="mb-3" controlId={name}>
        <Form.Label>{label}</Form.Label>
        <InputGroup>
          <FormControl
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
          {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </InputGroup>
      </Form.Group>
    );
  };
  
  export default PasswordInput;