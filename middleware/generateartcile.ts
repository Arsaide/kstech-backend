function generateUniqueArticle() {
  const timestamp = Date.now().toString();

  let article = timestamp.slice(-8);

  while (article.length < 8) {
    article = '0' + article;
  }

  return article;
}
export default generateUniqueArticle;
