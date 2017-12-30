import { spring, pointer, tween, stagger, easing } from 'popmotion';

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

export const unmountAnimation = allInstances => {
	console.log(allInstances);
	const tweens = allInstances.map(i => {
		const [instance, relative] = i;
		const { x, y } = instance.get();

		return tween({
			from: {
				x,
				y,
				scale: 1,
			},
			to: {
				x: x + 200 * relative,
				y: y + 80 * Math.abs(relative),
				scale: 0,
			},
			ease: easing.easeIn,
			duration: 300,
		});
	});

	return stagger(tweens, 0);
};
