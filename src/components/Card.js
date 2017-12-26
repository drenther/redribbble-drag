import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { value, styler, listen } from 'popmotion';

import { checkIfSelected, dragResistance } from '../utils/helpers';
import { pullStartAnimation } from '../utils/animations';

class Card extends Component {
	static propTypes = {
		day: PropTypes.string.isRequired,
		selected: PropTypes.bool.isRequired,
		days: PropTypes.object.isRequired,
		toggleCardSelection: PropTypes.func.isRequired,
		selectionAreaDimensions: PropTypes.object,
		registerStylerInstance: PropTypes.func.isRequired,
		notifyPullStart: PropTypes.func.isRequired,
	};

	static defaultProps = {
		selected: false,
		selectionAreaDimensions: null,
	};

	componentDidMount() {
		const instance = value({ x: 0, y: 0 }, styler(this.card).set);
		const { day, registerStylerInstance } = this.props;
		registerStylerInstance(day, instance);

		this.pullStartListener = listen(this.card, 'mousedown').start(e => {
			e.preventDefault();

			const { selected, day, days, notifyPullStart } = this.props;
			if (selected) {
				const allDays = Object.keys(days);
				const allSelectedDays = allDays.filter(d => days[d].selected);

				const allInstancesWithResistance = allSelectedDays.map(d => {
					const resistance = dragResistance(day, d, allDays);
					return [days[d].instance, resistance];
				});

				const primaryInstance = days[day].instance;

				const pointerInstance = pullStartAnimation(
					primaryInstance,
					allInstancesWithResistance,
				);

				notifyPullStart(day, pointerInstance);
			}
		});
	}

	componentWillUnmount() {
		this.pullStartListener.stop();
	}

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
