// const wrapAsync = require("../utils/wrapAsync");
// const User = require("../models/user");
const Issue = require("../models/issue");
const Project = require("../models/project");

module.exports.renderDashbaord = async (req, res) => {
  console.log("render dashRoutes");

  console.log("render dashRoutes");
  const company = req.body.company;
  const user = req.user;
  console.log("user: ", user);

  // Get for this month, past 3 months, past year, ytd

  /**
   *
   * 2 medium
   * 1 very high
   *
   *
   * 2 issues 15 and 25 min
   */
  try {
    const companyPriorityProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company } },
      },
      {
        $group: {
          _id: "$priority",
          numProjects: { $sum: 1 },
        },
      },
    ]);
    const companyProgressProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company } },
      },
      {
        $group: {
          _id: "$stage",
          numProjects: { $sum: 1 },
        },
      },
    ]);

    const userPriorityProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company }, owner: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$priority",
          numProjects: { $sum: 1 },
        },
      },
    ]);
    const userProgressProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company }, owner: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$stage",
          numProjects: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      companyPriorityProjects,
      companyProgressProjects,
      userPriorityProjects,
      userProgressProjects,
    };
    console.log("stats: ", stats);
    res.render("dashboards/index", {
      stats,
    });
  } catch (e) {
    console.log(e);
  }
};
