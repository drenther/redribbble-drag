import { spring, pointer } from 'popmotion';

export const pullEndAnimation = (
	primaryInstance,
	pointerInstance,
	allInstances,
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
	allInstancesWithResistance,
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
