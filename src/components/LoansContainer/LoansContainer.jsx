import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Modal,
  Button,
  TextField,
  Icon
} from '@material-ui/core';
import Countdown from 'react-countdown-now';

import Spinner from '../Spinner/Spinner';
import LoansItem from '../LoansItem/LoansItem';
import { stringPriceToInt, intPriceToString } from '../../helpers';
import './LoansContainer.sass';

class LoansContainer extends Component {
  state = {
    loans: [],
    isFetching: false,
    totalAvailable: 0,
    isModalOpen: false,
    selectedLoanId: null,
    form: {
      amountOfInvest: 0
    }
  };

  componentDidMount() {
    this.setState({
      isFetching: true
    });

    axios
      .get('current-loans.json')
      .then(res => {
        const loans = res.data.loans.map(loan => {
          return {
            ...loan,
            isInvested: false
          };
        });

        const totalAvailable = this.calculateTotalAvailable(loans);

        this.setState({
          loans,
          isFetching: false,
          totalAvailable
        });
      })
      .catch(err => console.log(err));
  }

  calculateTotalAvailable = (loans, isUpdateState = false) => {
    const totalAvailable = loans.reduce(
      (total, item) => (total += stringPriceToInt(item.available)),
      0
    );

    if (isUpdateState) {
      this.setState({
        totalAvailable
      });
    }

    return totalAvailable;
  };

  onLoanClick = selectedLoanId => {
    this.setState({
      isModalOpen: true,
      selectedLoanId
    });
  };

  getItemById = (arr, id) => {
    return arr.find(item => item.id === id);
  };

  investInLoan = e => {
    e.preventDefault();

    const { form, loans, selectedLoanId } = this.state;

    if (form.amountOfInvest) {
      const loansCopy = [...loans];
      const loanIndex = loansCopy.findIndex(item => item.id === selectedLoanId);

      let remainPrice =
        stringPriceToInt(loansCopy[loanIndex].available) -
        parseInt(form.amountOfInvest, 10);

      loansCopy[loanIndex].available = intPriceToString(remainPrice);
      loansCopy[loanIndex].isInvested = true;

      this.closeForm(loansCopy);

      this.calculateTotalAvailable(loansCopy, true);
    } else {
      this.closeForm();
    }
  };

  handleInputChange = e => {
    const { selectedLoanId, loans } = this.state;
    const available = stringPriceToInt(
      this.getItemById(loans, selectedLoanId).available
    );

    let value = e.target.value.replace(/[^0-9 ]/g, '').trim();

    if (value.charAt(0) === '0') {
      value = value.substr(1);
    }

    if (stringPriceToInt(value) > available) {
      value = available;
    }

    this.setState({
      form: {
        [e.target.name]: value
      }
    });
  };

  countDown = ({
    total,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    completed
  }) => {
    if (completed) {
      return <span>completed</span>;
    }

    return (
      <span>
        {days} days {hours} hours {minutes} minutes
      </span>
    );
  };

  closeForm = (loansPassed = false) => {
    this.setState(prevState => {
      return {
        loans: loansPassed ? loansPassed : [...prevState.loans],
        isModalOpen: false,
        selectedLoanId: null,
        form: {
          amountOfInvest: 0
        }
      };
    });
  };

  render() {
    const {
      isFetching,
      loans,
      totalAvailable,
      isModalOpen,
      selectedLoanId,
      form
    } = this.state;

    const selectedLoan = selectedLoanId
      ? this.getItemById(loans, selectedLoanId)
      : null;

    const loanItems = loans.map(loan => (
      <Grid key={loan.id} item lg={4} sm={6} xs={12}>
        <LoansItem onLoanClick={this.onLoanClick} loan={loan} />
      </Grid>
    ));

    return (
      <section className="loans__container">
        <Modal
          onBackdropClick={() => this.closeForm()}
          open={isModalOpen}
          className="modal loans__modal"
        >
          <div className="modal__inner">
            <span onClick={() => this.closeForm()} className="modal__close">
              <Icon fontSize="inherit">clear</Icon>
            </span>
            <p className="modal__title">Invest in loan</p>
            {selectedLoan && (
              <div className="modal__content">
                <div className="loans__modal-info">
                  <p className="loans__modal-title">{selectedLoan.title}</p>
                  <p className="loans__modal-row loans__modal-available">
                    - Amount available: ${selectedLoan.available}
                  </p>
                  <p className="loans__modal-row loans__modal-ends">
                    - Loan ends in:{' '}
                    <Countdown
                      renderer={this.countDown}
                      date={
                        Date.now() + parseInt(selectedLoan.term_remaining, 10)
                      }
                    />
                  </p>
                </div>
                <div className="loans__modal-invest">
                  <p className="loans__modal-invest-title">
                    Investment amount ($)
                  </p>
                  <form
                    className="loans__modal-invest-form"
                    onSubmit={this.investInLoan}
                  >
                    <TextField
                      id="invest-amount"
                      name="amountOfInvest"
                      className="loans__modal-invest-input"
                      value={intPriceToString(form.amountOfInvest)}
                      onChange={this.handleInputChange}
                      placeholder="Amount"
                    />
                    <Button
                      variant="contained"
                      className="loans__item-button"
                      color="primary"
                      type="submit"
                    >
                      Invest
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </Modal>
        <Container maxWidth="lg">
          <div className="loans__container-top">
            <p className="loans__container-caption">Current Loans</p>
          </div>
          <div className="loans__container-items">
            {isFetching ? (
              <Spinner />
            ) : (
              <Grid container spacing={4}>
                {loanItems}
              </Grid>
            )}
          </div>
          {totalAvailable !== null && (
            <div className="loans__container-total">
              <span>
                Total amount available for investments:{' '}
                <b>${intPriceToString(totalAvailable)}</b>
              </span>
            </div>
          )}
        </Container>
      </section>
    );
  }
}

export default LoansContainer;
