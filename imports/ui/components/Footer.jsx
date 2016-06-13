import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export default class Footer extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     open: false,
  //   };
  //   this.toggle = this.toggle.bind(this);
  // }

  render() {
    return (
      <div className="footer">
        <div className="pull-right">
            10GB of <strong>250GB</strong> Free.
        </div>
        <div>
            <strong>Copyright</strong> Example Company &copy; 2014-2015
        </div>
    </div>
    );
  }
}

Footer.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};
