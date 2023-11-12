import React, { FC, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

interface AvailableFundsProps {
    getFunds: (...args: any[]) => any;
}

export const AvailableFunds: FC<AvailableFundsProps> = ({ getFunds }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [className, setClassName] = useState('');
    const [rawValue, setRawValue] = useState<string | undefined>(' ');

    const validateValue = (value: string | undefined): void => {
        const _rawValue = value === undefined ? 'undefined' : value;
        setRawValue(_rawValue || ' ');
        getFunds(rawValue);

        if (!value) {
            setClassName('');
        } else if (Number.isNaN(Number(value))) {
            setErrorMessage('Please enter a valid number');
            setClassName('is-invalid');
        } else {
            setClassName('is-valid');
        }
    };

    return (
        <div className="row">
            <div className="col-12 mb-4">
                <form className="needs-validation">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="validation-field">
                                Available funds:
                            </label>
                            <CurrencyInput
                                id="validation-field"
                                placeholder="Enter available funds!"
                                allowDecimals={false}
                                className={`form-control ${className}`}
                                onValueChange={validateValue}
                                prefix={'$'}
                                step={10}
                            />
                            <div className="invalid-feedback">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvailableFunds;
