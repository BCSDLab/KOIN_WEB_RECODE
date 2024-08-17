const isCheckNewArticle = (created: number[]) => {
  const today = new Date();

  if (created[0] - today.getFullYear() === 0 && (
    created[1] - today.getMonth() === 1) && (today.getDate() - created[2] <= 4)
  ) return true;
  return false;
};

const convertDate = (time: string) => time.split(' ')[0].replaceAll('-', '.');

function setArticleCreateDate(time: string) {
  const created = convertDate(time).split('.').map((item: string) => parseInt(item, 10));

  if (isCheckNewArticle(created)) {
    return [`${created.join('.')}`, true];
  }
  return [`${created.join('.')}`, false];
}

export default setArticleCreateDate;
