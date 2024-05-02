const rateLimit = (options) => {
	const { windowMs, max } = options;
	const requests = new Map();

	return (req, res, next) => {
		const now = Date.now();
		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		if (!requests.has(ip)) {
			requests.set(ip, { startTime: now, count: 1 });
			next();
		} else {
			const requestLog = requests.get(ip);

			if (now - requestLog.startTime < windowMs) {
				if (requestLog.count >= max) {
					return res
						.status(429)
						.json({ error: "Too many requests, please try again later." });
				}
				requestLog.count++;
				next();
			} else {
				requests.set(ip, { startTime: now, count: 1 });
				next();
			}
		}
	};
};

export default rateLimit;
