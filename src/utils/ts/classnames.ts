interface IClassname {
  [key: string]: boolean;
}

function classNames(classes: IClassname) {
  return Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}

export default classNames;
