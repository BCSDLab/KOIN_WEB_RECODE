const isCheckNewArticle = (registered: number[]) => {
  const today = new Date();

  if (
    registered[0] - today.getFullYear() === 0 &&
    registered[1] - today.getMonth() === 1 &&
    today.getDate() - registered[2] <= 4
  )
    return true;
  return false;
};

const convertDate = (time: string) => time.split(' ')[0].replaceAll('-', '.');

function setArticleRegisteredDate(time: string) {
  const registered = convertDate(time)
    .split('.')
    .map((item: string) => parseInt(item, 10));

  if (isCheckNewArticle(registered)) {
    return [`${registered.join('.')}`, true];
  }
  return [`${registered.join('.')}`, false];
}

export default setArticleRegisteredDate;
