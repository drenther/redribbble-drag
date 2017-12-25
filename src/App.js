import React, { Component } from 'react';
import DragSelect from './components/DragSelect';
import Card from './components/Card';

import { getCurrentDimensions, getCoords } from './utils/helpers';

class App extends Component {
	initialState = {
		selectionArea: {
			dragging: false,
			startX: 0,
			startY: 0,
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			dimensions: null,
		},
		days: {
			sun: {
				available: true,
				selected: false,
			},
			mon: {
				available: true,
				selected: false,
			},
			tue: {
				available: true,
				selected: false,
			},
			wed: {
				available: true,
				selected: false,
			},
			thu: {
				available: true,
				selected: false,
			},
			fri: {
				available: true,
				selected: false,
			},
			sat: {
				available: true,
				selected: false,
			},
		},
	};

	state = this.initialState;

	selectionAreaDragStart = e => {
		const isSourceApp = [...e.target.classList].includes('app');
		const isLeftClick = e.button === 0;

		if (isSourceApp && isLeftClick) {
			const { x, y } = getCoords(this.app, e.clientX, e.clientY);
			const newDimensions = getCurrentDimensions(this.app, x, y, x, y);

			this.setState(prevState => {
				const newSelectionArea = Object.assign(
					{},
					prevState.selectionArea,
					newDimensions,
					{ dragging: true },
				);
				return { selectionArea: newSelectionArea };
			});
		}
	};

	selectionAreaDrag = e => {
		const { x, y } = getCoords(this.app, e.clientX, e.clientY);
		this.setState(prevState => {
			const { dragging, startX, startY } = prevState.selectionArea;
			if (dragging) {
				const newDimensions = getCurrentDimensions(
					this.app,
					startX,
					startY,
					x,
					y,
				);

				const DOMRect = this.selectionArea.getBoundingClientRect();
				const dimensions = {
					top: DOMRect.top,
					left: DOMRect.left,
					bottom: DOMRect.bottom,
					right: DOMRect.right,
				};

				const newSelectionArea = Object.assign(
					{},
					prevState.selectionArea,
					{ dimensions },
					newDimensions,
				);

				return { selectionArea: newSelectionArea };
			} else {
				return null;
			}
		});
	};

	selectionAreaDragEnd = e => {
		this.setState(prevState => {
			if (prevState.selectionArea.dragging) {
				const newSelectionArea = Object.assign({}, prevState.selectionArea, {
					dragging: false,
					startX: 0,
					startY: 0,
				});
				return { selectionArea: newSelectionArea };
			} else {
				return null;
			}
		});
	};

	render() {
		const { days } = this.state;
		const weekDays = Object.keys(days).filter(day => days[day].available);

		const {
			dragging,
			top,
			left,
			bottom,
			right,
			dimensions,
		} = this.state.selectionArea;
		const display = dragging ? 'initial' : 'none';

		return (
			<div
				className="app"
				ref={div => (this.app = div)}
				onMouseDown={this.selectionAreaDragStart}
				onMouseMove={this.selectionAreaDrag}
				onMouseUp={this.selectionAreaDragEnd}
			>
				{weekDays.map(day => (
					<Card key={day} day={day} selected={days[day].selected} />
				))}
				<DragSelect
					{...{ display, top, left, bottom, right }}
					selectionAreaRef={el => (this.selectionArea = el)}
				/>
			</div>
		);
	}
}

export default App;
