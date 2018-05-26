const raf = ((global as any).requestAnimationFrame = (callback: (() => void)) => {
	setTimeout(callback, 0);
});


export default raf;
