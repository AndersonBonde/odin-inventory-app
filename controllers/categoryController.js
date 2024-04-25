const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const [allItems, allCategories] = await Promise.all([
    Item.find().populate('category').exec(),
    Category.find().sort({ name: 1 }).exec()
  ]);

  const data = {
    title: 'Category List',
    item_list: allItems,
    category_list: allCategories,
  };
  res.render('category_list', { data });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec()
  ]);

  if (category === null) {
    // Not found.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  const data = {
    category,
    title: 'Category Detail',
    category_items: categoryItems,
  };
  res.render('category_detail', { data });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category create GET');
});

// Display Category create on POST.
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category create POST');
});

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category delete GET');
});

// Display Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category delete POST');
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category update GET');
});

// Display Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: Category update POST');
});
