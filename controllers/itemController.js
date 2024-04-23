const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

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
  res.send('TODO: Item create GET');
});

// Display item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item create POST');
});

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item delete GET');
});

// Display item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item delete POST');
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item update GET');
});

// Display item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Item update POST');
});
