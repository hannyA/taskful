// const wrapAsync = require("../utils/wrapAsync");
// const User = require("../models/user");
const Issue = require("../models/issue");
const project = require("../models/project");
const Project = require("../models/project");
const Task = require("../models/task");
const { getStatusCount, getPriorityCount } = require("../utils/aggregation");
//

module.exports.renderCompanyDashbaord = async (req, res) => {
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
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { priority: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    const companyProgressProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { status: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    // const getCount = (priority) => {
    //   const obj = companyPriorityProjects.find((e) => e.priority === priority);
    //   if (obj) return obj.count;
    //   return 0;
    // };

    // for (item of companyPriorityProjects) {
    //   console.log("item");
    //   if (item.priority === "Low") {
    //     console.log("Low: ", item.count);
    //   }
    //   if (item.priority === "Medium") {
    //     console.log("Medium: ", item.count);
    //   }
    // }

    // console.log(
    //   "getArrCountcompanyProgressProjects, New: ",
    //   getStatusCount(companyProgressProjects, "New")
    // );

    // console.log(
    //   "getArrCountcompanyProgressProjects, Complete: ",
    //   getStatusCount(companyProgressProjects, "Complete")
    // );
    // console.log(
    //   "getArrCountcompanyProgressProjects, Canceled: ",
    //   getStatusCount(companyProgressProjects, "Canceled")
    // );
    // console.log(
    //   "getArrCountcompanyProgressProjects, On Hold: ",
    //   getStatusCount(companyProgressProjects, "On Hold")
    // );
    // console.log(
    //   "getArrCountcompanyProgressProjects, In Progress: ",
    //   getStatusCount(companyProgressProjects, "In Progress")
    // );

    const stats = {
      companyPriorityProjects: {
        low: getPriorityCount(companyPriorityProjects, "Low"),
        medium: getPriorityCount(companyPriorityProjects, "Medium"),
        high: getPriorityCount(companyPriorityProjects, "High"),
        vhigh: getPriorityCount(companyPriorityProjects, "Very High"),
      },
      companyProgressProjects: {
        new: getStatusCount(companyProgressProjects, "New"),
        complete: getStatusCount(companyProgressProjects, "Complete"),
        cancel: getStatusCount(companyProgressProjects, "Canceled"),
        hold: getStatusCount(companyProgressProjects, "On Hold"),
        progress: getStatusCount(companyProgressProjects, "In Progress"),
      },
    };

    console.log("stats: ", stats);
    res.render("dashboards/index", {
      stats,
      page: "stats",
      navbar: "dashboard",
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.renderMyDashboard = async (req, res) => {
  console.log("renderMyDashboard dashRoutes");

  console.log("render dashRoutes");
  const company = req.body.company;
  const user = req.user;
  console.log("user: ", user);

  //TODO: Get for this month, past 3 months, past year, ytd
  try {
    const userPriorityProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company }, owner: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { priority: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    const userProgressProjects = await Project.aggregate([
      {
        $match: { company: { $eq: company }, owner: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { status: "$_id" },
      },
      {
        $project: {
          _id: 0,
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
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { priority: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const issueStatus = await Issue.aggregate([
      {
        $match: { author: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { status: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const stats = {
      userPriorityProjects: {
        low: getPriorityCount(userPriorityProjects, "Low"),
        medium: getPriorityCount(userPriorityProjects, "Medium"),
        high: getPriorityCount(userPriorityProjects, "High"),
        vhigh: getPriorityCount(userPriorityProjects, "Very High"),
      },
      userProgressProjects: {
        new: getStatusCount(userProgressProjects, "New"),
        complete: getStatusCount(userProgressProjects, "Complete"),
        cancel: getStatusCount(userProgressProjects, "Canceled"),
        hold: getStatusCount(userProgressProjects, "On Hold"),
        progress: getStatusCount(userProgressProjects, "In Progress"),
      },
      issuePriority: {
        low: getPriorityCount(issuePriority, "Low"),
        medium: getPriorityCount(issuePriority, "Medium"),
        high: getPriorityCount(issuePriority, "High"),
        vhigh: getPriorityCount(issuePriority, "Very High"),
      },
      issueStatus: {
        new: getStatusCount(issueStatus, "New"),
        assign: getStatusCount(issueStatus, "Assigned"),
        close: getStatusCount(issueStatus, "Closed"),
        solve: getStatusCount(issueStatus, "Solved"),
        progress: getStatusCount(issueStatus, "In Progress"),
      },
    };
    console.log("stats: ", stats);
    res.render("dashboards/mine", {
      stats,
      page: "my-stats",
      navbar: "dashboard",
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
    const issuePriority = await Issue.aggregate([
      {
        $match: { author: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { priority: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const issueStatus = await Issue.aggregate([
      {
        $match: { author: { $eq: user._id } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: { status: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    console.log("issuePriority: ", issuePriority);
    console.log("issueStatus: ", issueStatus);

    const stats = {
      issuePriority: {
        low: getPriorityCount(issuePriority, "Low"),
        medium: getPriorityCount(issuePriority, "Medium"),
        high: getPriorityCount(issuePriority, "High"),
        vhigh: getPriorityCount(issuePriority, "Very High"),
      },
      issueStatus: {
        new: getStatusCount(issueStatus, "New"),
        assign: getStatusCount(issueStatus, "Assigned"),
        close: getStatusCount(issueStatus, "Closed"),
        solve: getStatusCount(issueStatus, "Solved"),
        progress: getStatusCount(issueStatus, "In Progress"),
      },
    };

    console.log("stats: ", stats);
    res.render("dashboards/index", {
      stats,
      navbar: "dashboard",
    });
  } catch (e) {
    console.log(e);
  }
};

// Return minutes worked each day
// time avg time to close issues: less than 30 minutes, 30-1 hour, 1 hour -2, 2-5, more than 5
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
          _id: {
            $dateToString: {
              format: "%m-%d-%Y",
              date: "$createdAt",
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
      navbar: "dashboard",
    });
  } catch (e) {
    console.log(e);
  }
};
