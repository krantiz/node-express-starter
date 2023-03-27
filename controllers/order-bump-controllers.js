const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

const pool = require("../database");
const HttpError = require("../models/http-error");
var requestData = {};
var orderBumpConfigData = {};

const orderBumpController = {
  getOrderBumps: async (req, res, next) => {
    requestData =
      req.query && req.query.cartdetails
        ? JSON.parse(req.query.cartdetails)
        : [];
    if (!requestData.length) {
      return res.status(404).send({ message: "Invalid request data!" });
    }

    orderBumpController
      .getOrderBumpConfig()
      .then(() => {
        // console.log("data1", requestData);
        return orderBumpController.getEligibleOrderBumps();
      })
      .then((data) => {
        // console.log("data2", data);
        return data.sort((a, b) => {
          if (
            a.settings.priority === undefined &&
            b.settings.priority === undefined
          ) {
            return 0;
          } else if (a.settings.priority === undefined) {
            return 1;
          } else if (b.settings.priority === undefined) {
            return -1;
          } else {
            return a.settings.priority - b.settings.priority;
          }
        });
      })
      .then((data) => {
        // console.log("data2", data);
        return data && data.length ? [data[0]] : [];
      })
      .then((data) => {
        // console.log("data2", data);
        // This way we can extract the random keys
        if (data && data.length) {
          data = data.map((d, index) => {
            if (d) {
              d.imageUrl = orderBumpController.getInternalKeyValue(
                d,
                "product_wfob_",
                "_featured_image_options",
                "design_data",
                "image_url"
              );

              d.cardTitle = orderBumpController.getInternalKeyValue(
                d,
                "product_wfob_",
                "_title",
                "design_data"
              );
              d.cardDescription = orderBumpController.getInternalKeyValue(
                d,
                "product_wfob_",
                "_description",
                "design_data"
              );
            }
            return d;
          });
        }

        return data;
      })
      .then((data) => {
        // console.log("data2", data);
        return res.status(200).json(data);
      })
      .catch((err) => {
        console.log("Error: " + err);
        return res.status(500).send(err);
      });
  },

  getInternalKeyValue(
    data,
    startKey,
    endKey,
    nestedObject = null,
    nestedKey = null
  ) {
    let result = null;
    let iterator = nestedObject ? data[nestedObject] : data;
    const propertyName = Object.keys(iterator).find(
      (key) => key.startsWith(startKey) && key.endsWith(endKey)
    );

    // console.log(propertyName, iterator, startKey, endKey);
    if (propertyName) {
      if (nestedObject && data[nestedObject][propertyName])
        result = data[nestedObject][propertyName];
      else if (data[propertyName]) result = data[propertyName];

      // console.log(propertyName, result);
      return result;
    }
  },

  getOrderBumpConfig() {
    // Get Config
    return new Promise(function (resolve, reject) {
      try {
        orderBumpConfigData = require("../order-bump-data.json").filter(
          (p) => p.post_status == "publish"
        );
        return resolve();
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  },

  getEligibleOrderBumps() {
    // Check Rules are satisfied or not
    return new Promise(function (resolve, reject) {
      try {
        let result = [];
        orderBumpConfigData.map((i, j) => {
          if (orderBumpController.evaluateExpression(i.rules, requestData)) {
            result.push(i);
          }
        });
        return resolve(result);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  },

  evaluateExpression(expr, products) {
    if (!Array.isArray(products)) {
      products = [products];
    }

    return products.some((product) => {
      if (expr.hasOwnProperty("AND")) {
        let result = expr.AND.every((cond) => {
          return orderBumpController.evaluateExpression(cond, product);
        });
        return result;
      } else if (expr.hasOwnProperty("OR")) {
        let result = expr.OR.some((cond) =>
          orderBumpController.evaluateExpression(cond, product)
        );
        return result;
      } else {
        for (let key in expr) {
          switch (key) {
            case "condition":
              let productsInCart = requestData.map((i) => i.productId);
              // console.log("expr[key].operator", expr[key].operator)
              // console.log("productsInCart", productsInCart)
              if (typeof expr[key] !== "object") {
                return false;
              }
              // ">",
              if (expr[key].operator == "==" || expr[key].operator == ">") {
                // console.log('first cond')
                // if (expr[key].operator[0] && !productsInCart.includes(expr[key].products[0])) {
                //   console.log('second cond')
                //   return false;
                // }
                const value = expr[key].products.every((prod) => {
                  // console.log(!productsInCart.includes(parseInt(prod)));
                  return !productsInCart.includes(parseInt(prod));
                });
                // console.log('value', expr[key].products, value)
                if (value == true) return false;
              }
              if (expr[key].operator == "!=") {
                // if (expr[key].operator[0] && productsInCart.includes(expr[key].products[0])) {
                //   return false;
                // }
                const value = expr[key].products.every((prod) =>
                  productsInCart.includes(parseInt(prod))
                );
                // console.log('value',expr[key].products, value)
                if (value == true) return false;
              }

              break;
            default:
              return false;
          }
        }
        return true;
      }
    });
  },
};

module.exports = orderBumpController;
