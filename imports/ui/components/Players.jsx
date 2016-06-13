import React from 'react';
import { Link } from 'react-router';
import { insert } from '../../api/lists/methods.js';

export default class Players extends React.Component {

  render() {
    const { players } = this.props;
    return (
      <div className="list-todos">
        {/*{players.map(player => (
          <div>{player.name}</div>
        ))}*/}
        Blah
      </div>
    );
  }
}
