const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

const pool = require("../database");
const HttpError = require("../models/http-error");

const feedbackController = {
  postFeedback: async (req, res, next) => {
    const insertQuery =
      "INSERT INTO user_feedback_mapping (user_id, teacher_id, topic_id, subtopic_id, feedback_type, feedback_value, viewed, text_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const body = JSON.parse(req.body.jsonData);
    const {
      feedbackType,
      feedbackValue,
      teacherId,
      studentId,
      topicId,
      subTopicId,
      fileName,
    } = body;

    pool
      .execute(insertQuery, [
        studentId,
        teacherId,
        topicId,
        subTopicId,
        feedbackType,
        fileName,
        false,
        feedbackType == 'text' ? feedbackValue : null
      ])
      .then(([rows]) => {
        res.status(201).send({ message: 'Sent successfully!'});
      })
      .catch((err) => {
        console.error(err);
        res
          .status(err.status || 500)
          .json({ message: err.message || "Something went wrong!" });
      });
  },

  fetchFeedback: async (req, res, next) => {
    // console.log("->", req.params.userid);
    // const queryString = `SELECT * FROM user_feedback_mapping where user_id = ${req.params.userid} and viewed = 0`;
    const queryString = `SELECT t1.*
    FROM user_feedback_mapping t1
    INNER JOIN (
      SELECT feedback_type, MAX(created_at) AS max_created_date
      FROM user_feedback_mapping
      WHERE user_id = ${req.params.userid}
      GROUP BY feedback_type
    ) t2 ON t1.feedback_type = t2.feedback_type AND t1.created_at = t2.max_created_date;`;

    pool
      .execute(queryString)
      .then(([rows]) => {
        let result = {};
        result.videoFeedback = rows.filter((i) => i.feedback_type == "video");
        result.audioFeedback = rows.filter((i) => i.feedback_type == "audio");
        result.screenFeedback = rows.filter((i) => i.feedback_type == "screen");
        result.textFeedback = rows.filter((i) => i.feedback_type == "text");
        res.status(201).json(result);
      })
      .catch((err) => {
        console.error(err);
        res
          .status(err.status || 500)
          .json({ message: err.message || "Something went wrong!" });
      });
  },

  markFileAsRead: async (req, res, next) => {
    // console.log("->", req.params.filename);
    const queryString = `UPDATE user_feedback_mapping SET viewed = 1 WHERE feedback_value="${req.params.filename}"`;

    pool
      .execute(queryString)
      .then(([rows]) => {
        res.status(200).json({ message: "success" });
      })
      .catch((err) => {
        console.error(err);
        res
          .status(err.status || 500)
          .json({ message: err.message || "Something went wrong!" });
      });
  },

  fetchFeedBackData: async (req, res, next) => {
    const dir = path.join(__dirname, "../uploads/feedback");
    // console.log(dir);

    const filePath = path.join(dir, req.params.filename);

    if (!fs.existsSync(filePath)) {
      res.sendStatus(404);
      return;
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  },
};

module.exports = feedbackController;
