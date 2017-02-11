import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addUserActivity, lookForReps } from '../../actions/index';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { cyan700 } from 'material-ui/styles/colors';
import { Dialog, RaisedButton, TableRow, TableRowColumn } from 'material-ui';

const styles = {
  tableCell: {
    whiteSpace: 'inherit',
    textOverflow: 'inherit',
    width: 'auto',
    verticalAlign: 'middle'
  },
  tableRow: {
    backgroundColor: cyan700
  },
  ActivityTitleCell: {
    whiteSpace: 'inherit',
    textOverflow: 'inherit'
  },
  ActivityTitleHeader: {
    fontSize: '15px',
    whiteSpace: 'normal'
  },
  detailsLinkCell: {
    textAlign: 'right',
    width: '150px'
  },
  btnCol: {
    width: '70px',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  whiteText: {
    color: 'white'
  },
  dialogAlignTop: {
    top: '-20%'
  }
};

class IndividualActivity extends Component {
  constructor(props) {
    super(props);

    const closeBtn = [
      <RaisedButton
        key="close"
        label="Close"
        primary
        onTouchTap={this.handleClose}
      />
    ];

    this.state = {
      bodyStyle: styles,
      addBtnLabel: 'Add',
      addBtnClass: 'add-activity-btn',
      open: false,
      contactModalText: 'Find Your Local Representative',
      closeBtn
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  loadElectionWidget() {
    // Is `vit` a global? Was an import missed? Not sure what this is exactly.
    // Determine if vit needs to be declared as a global within eslint and re-enable this rule.
    //eslint-disable-next-line no-undef
    vit.load({
      modal: true,
      officialOnly: false,
      width: '100%',
      height: '480px',
      colors: {
        'header': '#229acd',
        'landscapeBackgroundHeader': '#228a9d'
      },
      language: 'en'
    });
  }

  addActivity(activityData) {
    if (activityData.acf.special_content !== 'findrep' && activityData.acf.special_content !== 'elections') {
      this.props.addUserActivity(activityData);
      browserHistory.push('/');
    } else {

      switch (activityData.acf.special_content) {
        case 'findrep':
          this.props.lookForReps(activityData);
          browserHistory.push('/find-representative');
          break;
        case 'elections':
          // do something
          break;
        default:
        // do something by default
      }
    }
  }

  render() {

    // Determine if there isn't a better way to set the ActivityData Title. Perhaps a new component?
    /*eslint-disable react/no-danger*/
    return (
      <TableRow
        key={this.props.ActivityData.id}
        style={this.state.bodyStyle.tableRow}
      >
        <TableRowColumn style={this.state.bodyStyle.btnCol}>
          <RaisedButton
            label={this.state.addBtnLabel}
            default
            onClick={() => this.addActivity(this.props.ActivityData)}
          />
        </TableRowColumn>
        <TableRowColumn style={this.state.bodyStyle.ActivityTitleCell}>
          <h3 dangerouslySetInnerHTML={{__html: this.props.ActivityData.title.rendered}}/>
          <Dialog
            actions={this.state.closeBtn}
            modal
            open={this.state.open}
          >
            <h3
              style={this.state.bodyStyle.whiteText}
              dangerouslySetInnerHTML={{__html: this.props.ActivityData.title.rendered}}>
            </h3>
            <span
              style={this.state.bodyStyle.whiteText}
              dangerouslySetInnerHTML={{__html: this.props.ActivityData.content.rendered}}>
            </span>
          </Dialog>
        </TableRowColumn>
        <TableRowColumn style={this.state.bodyStyle.detailsLinkCell}>
          <a className="activity-details-link" onTouchTap={this.handleOpen}>Click for details</a>
        </TableRowColumn>
      </TableRow>
    );
  }
}

function mapStateToProps(state) {
  return {
    activity: state.userActivities.activity,
    userActivities: state.userActivities
  };
}

IndividualActivity.propTypes = {
  ActivityData: PropTypes.object.isRequired,
  lookForReps: PropTypes.func.isRequired,
  addUserActivity: PropTypes.func.isRequired
};
export default connect(mapStateToProps, {addUserActivity, lookForReps})(IndividualActivity);
