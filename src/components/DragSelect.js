import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DragSelect extends Component {
	static propTypes = {
		display: PropTypes.string.isRequired,
		top: PropTypes.number.isRequired,
		left: PropTypes.number.isRequired,
		bottom: PropTypes.number.isRequired,
		right: PropTypes.number.isRequired,
		selectionAreaRef: PropTypes.func.isRequired,
	};

	static defaultProps = {
		display: 'initial',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	};

	render() {
		const { display, top, left, bottom, right, selectionAreaRef } = this.props;
		return (
			<div
				className="drag-select"
				ref={selectionAreaRef}
				style={{
					display,
					top: `${top}px`,
					left: `${left}px`,
					bottom: `${bottom}px`,
					right: `${right}px`,
				}}
			/>
		);
	}
}

export default DragSelect;
