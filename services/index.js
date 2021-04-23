const axios = require("axios");

if(!process.env.PORT){
  require("../Secrets")
}

//generate UID
function getUID() {
  let uid = "";
  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * 10);
    uid += rand;
  }
  return uid;
}

//get photo from unsplash
async function getPhotoFromUnsplash(name){
  const URL = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&page=1&query=${name}`;

  const res = await axios.get(URL)
  const photos = res.data.results;
  const fallBackPhoto =
    "https://images.unsplash.com/photo-1619100244920-b417eff59772?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60";

    if (photos.length ===0) return fallBackPhoto;

  return res.data.results[0].urls.small
}

  module.exports = {
  getUID,
  getPhoto: getPhotoFromUnsplash
};
