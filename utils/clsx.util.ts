const clsx = (...args: (string | {[key: string]: boolean | undefined} | undefined)[]): string => {
  const classes: string[] = []

  // 문자열로 된 클래스 추가
  for (const arg of args) {
    if (typeof arg === "string") {
      classes.push(arg.trim());
    }
  }

  // 조건부 클래스 추가
  for (const arg of args) {
    if (typeof arg === "object") {
      for (const key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key.trim());
        }
      }
    }
  }

  return classes.join(" ");
}

export default clsx
