import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Trash extends Component {
	static propTypes = {
		pulling: PropTypes.bool.isRequired,
		open: PropTypes.bool.isRequired,
		enterTrashZone: PropTypes.func.isRequired,
		exitTrashZone: PropTypes.func.isRequired,
		registerTrashCoords: PropTypes.func.isRequired,
	};

	componentDidMount() {
		this.props.registerTrashCoords(this.trash);
	}

	render() {
		const { pulling, open, exitTrashZone, enterTrashZone } = this.props;
		const openClass = open ? 'open' : '';
		return (
			<div className="trash" ref={el => (this.trash = el)}>
				<div
					id="trashbox"
					className={pulling ? '' : 'hidden'}
					onMouseEnter={enterTrashZone}
					onMouseLeave={exitTrashZone}
				>
					<img
						src="../assets/Cover.svg"
						alt="trash_cover"
						id="cover"
						className={openClass}
					/>
					<img
						src="../assets/Body.svg"
						alt="trash_body"
						id="body"
						className={openClass}
					/>
				</div>
			</div>
		);
	}
}

export default Trash;
