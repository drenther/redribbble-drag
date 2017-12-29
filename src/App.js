import React, { Component } from 'react';
import { listen } from 'popmotion';

import DragSelect from './components/DragSelect';
import Card from './components/Card';
import Trash from './components/Trash';
import { getCurrentDimensions, getCoords, ifSource } from './utils/helpers';
import { pullEndAnimation } from './utils/animations';

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
				instance: null,
			},
			mon: {
				available: true,
				selected: false,
				instance: null,
			},
			tue: {
				available: true,
				selected: false,
				instance: null,
			},
			wed: {
				available: true,
				selected: false,
				instance: null,
			},
			thu: {
				available: true,
				selected: false,
				instance: null,
			},
			fri: {
				available: true,
				selected: false,
				instance: null,
			},
			sat: {
				available: true,
				selected: false,
				instance: null,
			},
		},
		card: {
			pulling: false,
			currentCard: '',
			pointerInstance: null,
		},
	};

	state = this.initialState;

	componentDidMount() {
		// listener on document for listening to mouseup when pulling true
		this.pullEndListener = listen(document, 'mouseup').start(e => {
			const state = Object.assign({}, this.state);
			const { pulling, currentCard, pointerInstance } = state.card;
			if (pulling && currentCard) {
				const primaryInstance = state.days[currentCard].instance;
				const allInstances = Object.keys(state.days)
					.filter(d => state.days[d].selected)
					.map(day => state.days[day].instance);

				pullEndAnimation(primaryInstance, pointerInstance, allInstances);

				this.resetSelection();
			}
		});
	}

	componentWillUnmount() {
		this.pullEndListener.stop();
	}

	selectionAreaDragStart = e => {
		const source = e.target;
		const correctSource =
			ifSource(source, 'app') ||
			ifSource(source, 'container') ||
			ifSource(source, 'trash');
		const isLeftClick = e.button === 0;

		if (correctSource && isLeftClick) {
			const { x, y } = getCoords(this.app, e.clientX, e.clientY);
			const newDimensions = getCurrentDimensions(this.app, x, y, x, y);

			this.setState(prevState => {
				const newSelectionArea = Object.assign(
					{},
					prevState.selectionArea,
					newDimensions,
					{ dragging: true }
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
					y
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
					newDimensions
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

	toggleCardSelection = (day, isSelected) => {
		this.setState(prevState => {
			const days = Object.assign({}, prevState.days);
			days[day].selected = isSelected;
			return { days };
		});
	};

	notifyPullStart = (day, pointerInstance) => {
		const newCardState = {
			pulling: true,
			currentCard: day,
			pointerInstance,
		};

		this.setState({ card: newCardState });
	};

	registerStylerInstance = (day, instance) => {
		this.setState(prevState => {
			const newState = Object.assign({}, prevState);
			newState.days[day].instance = instance;

			return newState;
		});
	};

	resetSelection = () => {
		this.setState(prevState => {
			const days = Object.assign({}, prevState.days);
			Object.keys(days).forEach(day => {
				days[day].selected = false;
			});
			return { days, card: this.initialState.card };
		});
	};

	render() {
		const { days } = this.state;

		const {
			dragging,
			top,
			left,
			bottom,
			right,
			dimensions,
		} = this.state.selectionArea;
		const display = dragging ? 'initial' : 'none';

		const { pulling } = this.state.card;

		return (
			<div
				className="app"
				ref={div => (this.app = div)}
				onMouseDown={this.selectionAreaDragStart}
				onMouseMove={this.selectionAreaDrag}
				onMouseUp={this.selectionAreaDragEnd}
			>
				<div className="desc typography">
					A simple drag and select interface prototype
				</div>
				<div className="container">
					{Object.keys(days).map(day => (
						<div className="card-container" key={day}>
							{days[day].available && (
								<Card
									{...{ day, days }}
									selected={days[day].selected}
									selectionAreaDimensions={dimensions}
									toggleCardSelection={this.toggleCardSelection}
									notifyPullStart={this.notifyPullStart}
									registerStylerInstance={this.registerStylerInstance}
								/>
							)}
						</div>
					))}
				</div>
				<DragSelect
					{...{ display, top, left, bottom, right }}
					selectionAreaRef={el => (this.selectionArea = el)}
				/>
				<Trash pulling={pulling} />
			</div>
		);
	}
}

export default App;
