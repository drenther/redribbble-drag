import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component {
	static propTypes = {
		day: PropTypes.string.isRequired,
		selected: PropTypes.bool.isRequired,
	};

	render() {
		const { day, innerRef, selected } = this.props;
		return (
			<div className={`selectable ${selected ? 'selected' : ''}`} id={day}>
				<p>{day}</p>
			</div>
		);
	}
}

export default Card;
