import { snackbarMessage } from './store/GameStore';

/**
 * duration 동안 draw 애니메이션을 timing 규칙에 따라 실행함.
 * @param {Function} timing
 * @param {Function} draw
 * @param {number} duration
 */
export function animate(timing, draw, duration) {
	let start = performance.now();

	requestAnimationFrame(function animate(time) {
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) {
			timeFraction = 1;
		}

		// 타이밍 함수에 따라 진행도 0 ~ 1 사이로 계산.
		let progress = timing(timeFraction);

		draw(progress);

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}

export function showSnackbar(message) {
	snackbarMessage.set(message);

	const snackbar = document.getElementById('snackbar');
	snackbar.className = 'show';
	setTimeout(function () {
		snackbar.className = snackbar.className.replace('show', '');
	}, 3500);
}
