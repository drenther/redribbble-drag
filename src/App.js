import React, { Component } from 'react';
import { listen } from 'popmotion';

import DragSelect from './components/DragSelect';
import Card from './components/Card';
import Trash from './components/Trash';
import { getCurrentDimensions, getCoords, ifSource } from './utils/helpers';
import { pullEndAnimation, unmountAnimation } from './utils/animations';

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
		trash: {
			open: false,
		},
	};

	state = this.initialState;

	componentDidMount() {
		this.pullEndListener = listen(document, 'mouseup').start(e => {
			const state = Object.assign({}, this.state);
			const { pulling, currentCard, pointerInstance } = state.card;
			if (pulling && currentCard) {
				const primaryInstance = state.days[currentCard].instance;
				const allInstances = Object.keys(state.days)
					.filter(d => state.days[d].selected)
					.map(day => state.days[day].instance);

				if (state.trash.open) {
					this.unmountDays();
				} else {
					this.resetSelection();
					pullEndAnimation(primaryInstance, pointerInstance, allInstances);
				}
			}
		});
	}

	componentWillUnmount() {
		this.pullEndListener.stop();
	}

	selectionAreaDragStart = e => {
		const source = e.target;
		const ifClickSource = ifSource.bind(null, source);
		const correctSource =
			ifClickSource('app') ||
			ifClickSource('container') ||
			ifClickSource('trash') ||
			ifClickSource('desc') ||
			ifClickSource('card-container');
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

	unmountDays = () => {
		const state = Object.assign({}, this.state);
		const days = state.days;
		const allSelectedDays = Object.keys(days).filter(day => days[day].selected);
		const allSelectedInstances = allSelectedDays.map(day => days[day].instance);

		unmountAnimation(allSelectedInstances).start({
			update: arr =>
				arr.forEach((scale, i) => allSelectedInstances[i].update(scale)),
			complete: () => {
				this.unmountDaysStateUpdate();
			},
		});
	};

	unmountDaysStateUpdate = () => {
		this.setState(prevState => {
			const days = prevState.days;
			const allSelectedDays = Object.keys(days).filter(
				day => days[day].selected
			);
			allSelectedDays.forEach(day => (days[day].available = false));
			const trash = Object.assign({}, prevState.trash, { open: false });
			return { days, trash, card: this.initialState.card };
		});
	};

	enterTrashZone = () => {
		console.log('entered');
		this.setState(prevState => {
			const { pulling } = prevState.card;
			if (pulling) {
				const trash = Object.assign({}, prevState.trash, { open: true });
				return { trash };
			} else {
				return null;
			}
		});
	};

	exitTrashZone = () => {
		console.log('exited');
		this.setState(prevState => {
			const trash = Object.assign({}, prevState.trash, { open: false });
			return { trash };
		});
	};

	render() {
		const state = this.state;
		const { days } = state;

		const {
			dragging,
			top,
			left,
			bottom,
			right,
			dimensions,
		} = state.selectionArea;
		const display = dragging ? 'initial' : 'none';

		const { pulling } = state.card;
		const { open } = state.trash;

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
				<Trash
					{...{ pulling, open }}
					enterTrashZone={this.enterTrashZone}
					exitTrashZone={this.exitTrashZone}
				/>
			</div>
		);
	}
}

export default App;
