// const wrapAsync = require("../utils/wrapAsync");
// const User = require("../models/user");
const Issue = require("../models/issue");
const Project = require("../models/project");
const Task = require("../models/task");

//
module.exports.renderDashbaord = async (req, res) => {
  console.log("render dashRoutes");

  console.log("render dashRoutes");
  const company = req.body.company;
  const user = req.user;
  console.log("user: ", user);

  //TODO: Get for this month, past 3 months, past year, ytd
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

module.exports.renderDashboardIssues = async (req, res) => {
  console.log("render dashRoutes");

  console.log("render dashRoutes");
  const company = req.body.company;
  const user = req.user;
  console.log("user: ", user);
  try {
    const issueStatus = await Issue.aggregate([
      {
        $match: { author: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$status",
          numIssues: { $sum: 1 },
        },
      },
    ]);

    const issuePriority = await Issue.aggregate([
      {
        $match: { author: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$priority",
          numIssues: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      issueStatus,
      issuePriority,
    };
    console.log("stats: ", stats);
    res.render("dashboards/index", {
      stats,
    });
  } catch (e) {
    console.log(e);
  }
};

// Return minutes worked each day
module.exports.renderDashboardTasks = async (req, res) => {
  const company = req.body.company;
  const user = req.user;
  try {
    const timeOnTasks = await Task.aggregate([
      {
        $match: { author: { $eq: user._id } },
      },
      {
        $group: {
          // _id: { $toDate: "$createDate" },
          _id: {
            $dateToString: {
              format: "%m-%d-%Y",
              date: "$createDate",
              timezone: "America/New_York",
            },
          },
          minutes: { $sum: "$duration" },
        },
      },
    ]);

    const stats = { timeOnTasks };

    console.log("stats: ", stats);
    res.render("dashboards/index", {
      stats,
    });
  } catch (e) {
    console.log(e);
  }
};
