
const home = async (req, res) => {
  return res.status(200).json({ message: "Welcome to Home Page" });
};
const about = async (req, res) => {
  return res.status(200).json({ message: "Welcome to About Page" });
};
const news = async (req, res) => {
  return res.status(200).json({ message: "Welcome to News Page" });
};
const blogs = async (req, res) => {
  return res.status(200).json({ message: "Welcome to Blogs Page" });
};

module.exports = { home, about, news, blogs };
