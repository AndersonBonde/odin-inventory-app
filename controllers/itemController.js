const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


exports.index = asyncHandler(async (req, res, next) => {
  // Get details of items and categories.
  const [
    numItems,
    numCategories
  ] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec()
  ]);

  const data = {
    title: 'Home Page',
    item_count: numItems,
    category_count: numCategories,
  };
  res.render('index', { data });
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}).sort({ name: 1 }).populate('category').exec();

  const data = {
    title: 'Item List',
    item_list: allItems,
  };
  res.render('item_list', { data });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  // Get detail from item an associated category.
  const item = await Item.findById(req.params.id).populate('category').exec();

  if (item === null) {
    // Item not found.
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  const data = {
    item,
    title: 'Item Detail',
  };
  res.render('item_detail', { data });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  // Get all categories, which we use to add to our item.
  const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();

  const data = { 
    title: 'Create Item',
    categories: allCategories,
  };
  res.render('item_form', { data });
});

// Display item create on POST.
exports.item_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'New item must have a valid description')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('number_in_stock', 'Number in stock must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  // Process request after sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(parseFloat(req.body.price).toFixed(2)),
      numberInStock: Number(req.body.number_in_stock),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();

      const data = {
        item,
        title: 'Create Item',
        categories: allCategories,
        errors: errors.array(),
      };
      res.render('item_form', { data });
    } else {
      // Data from form is valid. Save Item.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of the item.
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // No result.
    res.redirect('/inventory/items');
  }

  const data = {
    item,
    title: 'Delete Item',
  };
  res.render('item_delete', { data });
});

// Display item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of items.
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect('/inventory/items');
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find({}, 'name').exec(),
  ]);

  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  const data = {
    item,
    title: 'Update Item',
    categories: allCategories,
  };
  res.render('item_form', { data });
});

// Display item update on POST.
exports.item_update_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'New item must have a valid description')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Please, choose a category')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('number_in_stock', 'Number in stock must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  //Process request after validation.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped/trimmed data and old id.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(parseFloat(req.body.price).toFixed(2)),
      numberInStock: Number(req.body.number_in_stock),
      _id: req.params.id, // Required or new ID will be assigned.
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).populate('category').exec(),
        Category.find({}, 'name').exec(),
      ]);

      const data = {
        item,
        title: 'Update Item',
        categories: allCategories,
        errors: errors.array(),
      };
      res.render('item_form', { data });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item);
      // Redirect to item detail page.
      res.redirect(updatedItem.url);
    }
  }),
]
