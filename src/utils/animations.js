import { spring, pointer, tween, stagger, easing } from 'popmotion';
import { getMidPoint } from '../utils/helpers';

export const pullEndAnimation = (
	primaryInstance,
	pointerInstance,
	allInstances
) => {
	primaryInstance.stop();
	if (pointerInstance) pointerInstance.stop();

	const springSettings = spring({
		from: primaryInstance.get(),
		velocity: primaryInstance.getVelocity(),
		to: { x: 0, y: 0 },
		stiffness: 200,
		mass: 1,
		damping: 18,
	});

	allInstances.forEach(i => springSettings.start(i));
};

export const pullStartAnimation = (
	primaryInstance,
	allInstancesWithResistance
) => {
	const pointerInstance = pointer(primaryInstance.get()).start({
		update: ({ x, y }) => {
			allInstancesWithResistance.forEach(i => {
				const [instance, resistance] = i;
				instance.update({
					x: x * resistance,
					y: y * resistance,
				});
			});
		},
	});

	return pointerInstance;
};

export const unmountAnimation = (allInstances, trashXY) => {
	const coords = trashXY.getBoundingClientRect();
	console.log(coords);
	const tweens = allInstances.map(i => {
		const { x, y } = i.get();
		const to = {
			x: getMidPoint(coords.x, coords.width) - x,
			y: getMidPoint(coords.y, coords.height),
		};
		return tween({
			from: { x, y },
			to,
			ease: { x: easing.easeOut, y: easing.easeIn },
		});
	});
	// console.table(tweens);
	return stagger(tweens, 100);
};
