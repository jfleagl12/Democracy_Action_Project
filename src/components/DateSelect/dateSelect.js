import React, { Component, PropTypes } from 'react';
import { DatePicker } from 'material-ui';
import Moment from 'react-moment';
import { fetchUserActivities } from '../../actions/index';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';

function disablePrevDates(date) {
  return date.getDay() === 0;
}

class DateSelect extends Component {
  constructor(props) {
    super(props);

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    minDate.setHours(0, 0, 0, 0);

    this.state = {
      indexOfSelectedRow: props.indexOfSelectedRow,
      indexOfEditedRow: props.indexOfEditedRow,
      activities: props.activities,
      customFields: props.activities[props.indexOfSelectedRow].acf,
      datePlaceholder: '(any date)',
      startDate: null,
      datePickerHintText: 'select a date',
      minDate: minDate
    };
  }

  componentWillReceiveProps(nextProps) {

    // some of these can probably go...
    this.setState({
      indexOfSelectedRow: nextProps.indexOfSelectedRow,
      indexOfEditedRow: nextProps.indexOfEditedRow,
      activities: nextProps.activities,
      customFields: nextProps.activities[nextProps.indexOfSelectedRow].acf,
      timePlaceholder: '(any time)',
      timePickerHint: 'select time',
      startTime: null
    });
  }

  handleDateChange = (event, date) => {
    this.props.activities[this.state.indexOfSelectedRow].acf.date = moment(date).format('YYYYMMDD');

    this.setState({
      startDate: date,
      minDate: this.state.minDate
    });
  };

  render() {
    let startDate;

    if (_.every(['date'], _.partial(_.has, this.state.customFields))) {
      startDate = this.state.customFields.date;
    }

    if (this.props.indexOfEditedRow === this.state.indexOfSelectedRow) {
      return (
        <div>
          <DatePicker
            id={'date-' + this.state.indexOfSelectedRow}
            hintText={this.state.datePickerHintText}
            value={this.state.startDate}
            onChange={this.handleDateChange}
            minDate={this.state.minDate} />
        </div>
      );
    } else {
      if (startDate || this.state.startDate !== null) {

        if (!startDate && this.state.startDate !== null) {
          startDate = this.state.startDate;
        }

        return (
          <span>
            <Moment
              format="MM/DD/YYYY"
              date={startDate}
            />
          </span>
        );

      } else {
        //...or display the placeholder text for when no start date is selected
        return (
          <span>
            {this.state.datePlaceholder}
          </span>
        );
      }
    }
  }
}

DateSelect.propTypes = {
  indexOfSelectedRow: PropTypes.number,
  indexOfEditedRow: PropTypes.number,
  activities: PropTypes.array
};

export default DateSelect;
