const {
  verifyTokenAndAuthentication,
  verifyTokenAndAdmin,
} = require("./varifytoken");

const router = require("express").Router();
const Product = require("../Models/Product");
const User = require("../Models/User");

const { findByIdAndDelete, findById } = require("../Models/User");

// CREATE PRODUCT
router.post("/add", verifyTokenAndAdmin, async (req, res) => {
  console.log("We are inside add new prodcut function.");
  const prodcutData = new Product(req.body);

  try {
    const addedBy = await User.findById(req.user.id);
    const newProduct = await prodcutData.save();
    console.log(
      `New Product is added by ${addedBy.username} successfully : `,
      newProduct
    );
    res
      .status(200)
      .json({
        Message: `New Product is added by ${addedBy.username} successfully :`,
        Product: newProduct,
      });
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).json(error);
  }
});

router.put("/:id", verifyTokenAndAuthentication, async (req, res) => {
  console.log("We are inside update function.");
  try {
    const addedBy = await User.findById(req.user.id);

    const newProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    console.log(
      `Product is updated by ${addedBy.username} and product is: `,
      newProduct
    );
    res
      .status(200)
      .json({
        Message: `Product is updated byy ${addedBy.username} successfully :`,
        Product: newProduct,
      });
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).json(error);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    console.log("Here we are inside delete function");
    const accessBy = await User.findById(req.user.id);
    const deleteRequired = await Product.findById(req.params.id);

    const removedBy = accessBy.username;
    const productTtitle = deleteRequired.title;

    console.log("Below product will be delete: ", productTtitle);
    console.log("Product delete by: ", removedBy);

    if (removedBy && deleteRequired) {
      Product.findOneAndDelete(req.params.id)
        .then((result) => {
          console.log("Result of deletion : ", result);
          res
            .status(200)
            .json(`Product ${productTtitle} has been deleted by ${removedBy}`);
        })
        .catch((err) => {
          console.log("Error in product deletion : ", err);
          res.status(200).json(err);
        });
    } else {
      console.log("no product found");
      res.status(404).json("no usproducter found");
    }
  } catch (error) {
    console.log("Error in deletion : ", error);
    res.status(500).json("Erros in deletion");
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    //  console.log(`Welcome Mr ${req.user.name}. Please wait we are fetching data for you.....`)

    const resultUser = await Product.findById(req.params.id);

    if (resultUser) {
      res.status(200).json(resultUser);
    } else {
      res.status(200).json("No user found");
    }
  } catch (error) {
    console.log("Error is fetching product : ", error);
    res.status(500).json({ Error: error.toString() });
  }
});

router.get("/",verifyTokenAndAuthentication ,async (req, res) => {
  try {
    const query = req.query.new;
    const qCategory = req.query.category;

    if (query) {
      const Products = await Product.find({}).sort({ createdAt: 1 }).limit(1);
      if (Products) {
        res.status(200).json(Products);
      } else {
        res.status(200).json("No product found");
      }
    } else if (qCategory) {
      const Products = await Product.find({ catogries: { $in: [qCategory] } });

      if (Products) {
        res.status(200).json(Products);
      } else {
        res.status(200).json("No product found");
      }
    } else {
      const Products = await Product.find();
      if (Products) {
        res.status(200).json(Products);
      } else {
        res.status(200).json("No product found");
      }
    }
  } catch (error) {
    console.log("Error is fetching products : ", error);
    res.status(500).json({ Error: error.toString() });
  }
});

router.get("/getstats", verifyTokenAndAdmin, async (req, res) => {
  console.log("We are inside stats function");
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    console.log("Last Year : ", lastYear);

    const statsResult = await Product.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    if (statsResult) {
      console.log("Aggregation Result : ", statsResult);
      res.status(200).json(statsResult);
    } else {
      console.log("Aggregation Result is empty");
      res.status(200).json("No user found");
    }
  } catch (error) {
    console.log("Aggregation Erros", error);
    res.status(500).json({ "Aggregation Erros : ": error });
  }
});

module.exports = router;
