const isCheckNewPost = (created: number[]) => {
  const today = new Date();

  if (created[0] - today.getFullYear() === 0 && (
    created[1] - today.getMonth() === 1) && (
    today.getDate() - created[2] <= 4)
  ) return true;
  return false;
};

const convertDate = (time: string) => time.split(' ')[0].replaceAll('-', '.');

function setPostCreateDate(time: string) {
  const created = convertDate(time).split('.').map((item: string) => parseInt(item, 10));

  if (isCheckNewPost(created)) {
    return [`${created}`, true];
  }
  return [`${created}`, false];
}

export default setPostCreateDate;
