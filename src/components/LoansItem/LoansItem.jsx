import React from 'react';
import { Button, Icon } from '@material-ui/core';
import PropTypes from 'prop-types';

import './LoansItem.sass';

const LoansItem = ({ loan, onLoanClick }) => {
  return (
    <div onClick={() => onLoanClick(loan.id)} className="loans__item">
      {loan.isInvested && (
        <span className="loans__item-label">
          <Icon fontSize="inherit">done_all</Icon>
        </span>
      )}
      <div className="loans__item-info">
        <p className="loans__item-title">{loan.title}</p>
        <div className="loans__item-details">
          <p className="loans__item-details-title">Loan details</p>
          <ul className="loans__item-details-list">
            <li>Tranche: {loan.tranche}</li>
            <li>Available: ${loan.available}</li>
            <li>Return: {loan.annualised_return}</li>
            <li>LTV: {loan.ltv}</li>
            <li>Amount: ${loan.amount}</li>
          </ul>
        </div>
      </div>
      <div className="loans__item-btn">
        <Button
          variant="contained"
          className="loans__item-button"
          color="primary"
        >
          Invest
        </Button>
      </div>
    </div>
  );
};

LoansItem.propTypes = {
  loan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tranche: PropTypes.string.isRequired,
    available: PropTypes.string.isRequired,
    annualised_return: PropTypes.string.isRequired,
    ltv: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    isInvested: PropTypes.bool.isRequired
  }),
  onLoanClick: PropTypes.func.isRequired
};

export default LoansItem;
