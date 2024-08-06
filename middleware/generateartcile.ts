function generateUniqueArticle() {
  const timestamp = Date.now().toString();
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  let article = timestamp.slice(-8) + randomPart;

  while (article.length < 12) {
    article = '0' + article;
  }

  return article;
}

export default generateUniqueArticle;
