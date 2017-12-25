export const getCurrentDimensions = (app, startX, startY, endX, endY) => {
	const { height, width } = app.getBoundingClientRect();
	let top, left, bottom, right;
	if (startX < endX) {
		left = startX;
		right = width - endX;
	} else {
		left = endX;
		right = width - startX;
	}
	if (startY < endY) {
		top = startY;
		bottom = height - endY;
	} else {
		top = endY;
		bottom = height - startY;
	}
	return { startX, startY, top, left, bottom, right };
};

export const getCoords = (app, clientX, clientY) => {
	const { y, x } = app.getBoundingClientRect();
	const [currentX, currentY] = [clientX - x, clientY - y];
	return { x: currentX, y: currentY };
};

export const checkIfSelected = (dragArea, elArea) =>
	dragArea ? isValidX(dragArea, elArea) && isValidY(dragArea, elArea) : false;

const isValidX = (elArea, dragArea) => {
	return (
		(elArea.left > dragArea.left && elArea.left < dragArea.right) ||
		(elArea.right > dragArea.left && elArea.right < dragArea.right) ||
		(elArea.left > dragArea.left && elArea.right < dragArea.right) ||
		(elArea.left < dragArea.left && elArea.right > dragArea.right)
	);
};

const isValidY = (elArea, dragArea) => {
	return (
		(elArea.top > dragArea.top && elArea.top < dragArea.bottom) ||
		(elArea.bottom > dragArea.top && elArea.bottom < dragArea.bottom) ||
		(elArea.top > dragArea.top && elArea.bottom < dragArea.bottom) ||
		(elArea.top < dragArea.top && elArea.bottom > dragArea.bottom)
	);
};
