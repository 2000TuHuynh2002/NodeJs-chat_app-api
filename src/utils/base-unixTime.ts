const unixTimeNow = (): number => {
  return Math.floor(Date.now() / 1000);
};

const convertToSecond = (duration: string): number => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1));

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      throw new Error("Invalid duration format");
  }
};

export { unixTimeNow, convertToSecond };
