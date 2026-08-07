const searchService = require("../services/search.service");

const search = async (req, res) => {
  try {
    const results = await searchService.search(req.query.q, req.user);

    res.status(200).json({
      success: true,
      message: "Search completed successfully",
      data: results,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { search };
