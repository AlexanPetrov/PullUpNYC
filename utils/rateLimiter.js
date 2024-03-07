const rateLimit = (
  maxRequests,
  timeWindow,
  message = "You have exceeded the request limit."
) => {
  const requests = new Map();

  return async (req, res) => {
    const now = Date.now();
    const userIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (!requests.has(userIp)) {
      requests.set(userIp, []);
    }

    const timestamps = requests
      .get(userIp)
      .filter((timestamp) => now - timestamp < timeWindow);
    timestamps.push(now);
    requests.set(userIp, timestamps);

    if (timestamps.length > maxRequests) {
      res.status(429).json({ error: message });
      return false;
    }

    return true;
  };
};

export default rateLimit;
