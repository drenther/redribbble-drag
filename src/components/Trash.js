import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Trash extends Component {
	static propTypes = {
		pulling: PropTypes.bool.isRequired,
		enterTrashZone: PropTypes.func.isRequired,
		exitTrashZone: PropTypes.func.isRequired,
	};

	render() {
		const { pulling, exitTrashZone, enterTrashZone } = this.props;
		return (
			<div className="trash">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="92"
					height="92"
					viewBox="0 0 92 92"
					id="trashbox"
					className={pulling ? '' : 'hidden'}
					onMouseEnter={enterTrashZone}
					onMouseLeave={exitTrashZone}
				>
					<defs>
						<clipPath id="_clipPath_Bv1RGNDO4QjzHgE8BI9Mx4EhtSIPt6jo">
							<rect width="92" height="92" />
						</clipPath>
					</defs>
					<g clipPath="url(#_clipPath_Bv1RGNDO4QjzHgE8BI9Mx4EhtSIPt6jo)">
						<g id="Cover">
							<line
								x1="12"
								x2="80"
								y1="18"
								y2="18"
								stroke="rgba(128, 0, 128, 1)"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeMiterlimit="3"
								strokeWidth="7"
								vectorEffect="non-scaling-stroke"
							/>
							<path
								fill="none"
								stroke="rgba(128, 0, 128, 1)"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeMiterlimit="3"
								strokeWidth="7"
								d=" M 36 18 L 36 5 L 56 5 L 56 18"
								vectorEffect="non-scaling-stroke"
							/>
						</g>
						<g id="Body">
							<path
								fill="none"
								stroke="rgba(128, 0, 128, 1)"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeMiterlimit="3"
								strokeWidth="7"
								d=" M 18 31 L 21 88 L 71 88 L 74 31"
								vectorEffect="non-scaling-stroke"
							/>
							<line
								x1="55"
								x2="54"
								y1="31"
								y2="74"
								stroke="rgba(128, 0, 128, 1)"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeMiterlimit="3"
								strokeWidth="7"
								vectorEffect="non-scaling-stroke"
							/>
							<line
								x1="37"
								x2="38"
								y1="31"
								y2="74"
								stroke="rgba(128, 0, 128, 1)"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeMiterlimit="3"
								strokeWidth="7"
								vectorEffect="non-scaling-stroke"
							/>
						</g>
					</g>
				</svg>
			</div>
		);
	}
}

export default Trash;
