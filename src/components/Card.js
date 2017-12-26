import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import { checkIfSelected } from '../utils/helpers';

class Card extends Component {
	static propTypes = {
		day: PropTypes.string.isRequired,
		selected: PropTypes.bool.isRequired,
		toggleCardSelection: PropTypes.func.isRequired,
		selectionAreaDimensions: PropTypes.object,
	};

	static defaultProps = {
		selected: false,
		selectionAreaDimensions: null,
	};

	componentWillReceiveProps(nextProps) {
		const { day, selectionAreaDimensions, toggleCardSelection } = this.props;
		if (!isEqual(nextProps.selectionAreaDimensions, selectionAreaDimensions)) {
			const elDimensions = this.card.getBoundingClientRect();
			const isSelected = checkIfSelected(
				nextProps.selectionAreaDimensions,
				elDimensions,
			);

			toggleCardSelection(day, isSelected);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.selected === this.props.selected) return false;
		else return true;
	}

	render() {
		const { day, selected } = this.props;
		return (
			<div
				className={`selectable ${selected ? 'selected' : ''}`}
				id={day}
				ref={el => (this.card = el)}
			>
				<p>{day}</p>
			</div>
		);
	}
}

export default Card;
