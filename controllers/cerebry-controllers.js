const fetch = require("node-fetch");

const pool = require("../database");
const HttpError = require("../models/http-error");
const apiBaseUrl = `${process.env.CEREBRY_API_URL}${process.env.CEREBRY_API_VERSION}/partner`;
const cerebryPermanentToken = process.env.CEREBRY_PERMANENT_TOKEN;

const cerebryController = {
  registerUser: async (req, res, next) => {
    const data = req.body;
    let url = apiBaseUrl + "register-user/";
    let result = {};
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "jwt-token": cerebryPermanentToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
        // console.log(json);
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "Fetching users failed, please try again later.",
          500
        );
        return next(error);
      });
    res.json(result);
  },

  loginUser: async (req, res, next) => {
    let result = {};
    await fetch(apiBaseUrl + `/user/${req.params.userName}/login`, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "jwt-token": cerebryPermanentToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "User Login Failed, please try again later.",
          500
        );
        return next(error);
      });
    res.json(result);
  },

  addUserPackage: async (req, res, next) => {
    const data = req.body;
    let url = apiBaseUrl + `/user/${req.params.userName}/add-package/`;
    let result = {};
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "jwt-token": cerebryPermanentToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
        // console.log(json);
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "Adding Package Failed, please try again later.",
          500
        );
        return next(error);
      });
    res.json(result);
  },

  removeUserPackage: async (req, res, next) => {
    const data = req.body;
    let url = apiBaseUrl + `/user/${req.params.userName}/remove-package/`;
    let result = {};
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "jwt-token": cerebryPermanentToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
        // console.log(json);
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "Adding Package Failed, please try again later.",
          500
        );
        return next(error);
      });
    res.json(result);
  },

  editUserPackage: async (req, res, next) => {
    const data = req.body;
    let url = apiBaseUrl + `/user/${req.params.userName}/edit-package/`;
    let result = {};
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "jwt-token": cerebryPermanentToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
        // console.log(json);
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "Adding Package Failed, please try again later.",
          500
        );
        return next(error);
      });
    res.json(result);
  },

  postRequestHandler: async (req, res, next) => {
    const data = req.body;
    let url = apiBaseUrl + `${req.url}`;
    let result = {};

    // console.log("data body", data);
    // console.log("req.params", req.params);
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "Authorization": req.headers.token,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
        // console.log(json);
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "Something went wrong! Please contact support.",
          500
        );
        return next(error);
      });
    res.json(result);
  },

  getRequestHandler: async (req, res, next) => {
    const data = req.body;
    let url = apiBaseUrl + `${req.url}`;
    let result = {};

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.token,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        result = json;
        // console.log(json);
      })
      .catch((err) => {
        console.error(err);
        const error = new HttpError(
          "Something went wrong! Please contact support.",
          500
        );
        return next(error);
      });
    res.json(result);
  },
};

module.exports = cerebryController;
